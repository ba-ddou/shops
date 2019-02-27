import React, { Component } from 'react';
import {BrowserRouter , Route} from 'react-router-dom';
import Navigation from './navigation';
import NearbyShops from './nearbyshops';
import FavoriteShops from './favoriteshops';
import Profile from './profile';


class Notification extends Component {
        constructor(props) {
                super(props);
        }
        
        componentDidMount(){
                this.props.removeNotification();
        }
        render(){
                var info = this.props.info;
            return ( 
                <div className={"notification notification--"+info.type}>
                        <span>{info.text}</span>
                </div>
                 );    
        }
        
}
 



class Shops extends Component {
        constructor(props) {
                super(props);
                this.state = { 
                        shopsList : [],
                        notification : false
                 }
                 this.callMaps = this.callMaps.bind(this);
                 this.postImpression = this.postImpression.bind(this);
                 this.removeNotification = this.removeNotification.bind(this);
                 this.unlike = this.unlike.bind(this);
        }

        componentDidMount(){
                
                fetch("/users",{
                        headers: {
                          'Accept': 'application/json',
                          'Content-Type': 'application/json',
                          'token' : this.props.accessToken
                        },
                        method: "GET"
                    })
                      .then(blob => blob.json())
                      .then(data => {
                                this.setState({userInfo : data});
                                
                                navigator.geolocation.getCurrentPosition((e)=>{
                                        
                                        this.setState({coords:{
                                                lat : e.coords.latitude ,
                                                lng : e.coords.longitude
                                        }});
                                        
                                        
                                        this.callMaps('/shops?lat='+e.coords.latitude+'&lng='+e.coords.longitude);
                                });
                                
                      });
        }

        callMaps(targetUrl){
                
                fetch(targetUrl,{
                        headers: { 'token' : this.props.accessToken } //uhguihuih
                        })
                        .then(blob => blob.json())
                        .then(data => {
                                this.setState({nextPageToken : data.nextPageToken});
                                if(this.state.userInfo.liked && this.state.userInfo.liked.length>0){
                                        var shopsList = this.signLikedShops(data.shopsList);
                                }else{
                                        var shopsList =data.shopsList;
                                }
                                this.setState(prevState=>{
                                     Array.prototype.push.apply(prevState.shopsList,shopsList);
                                     return {shopsList : prevState.shopsList };
                                        });
                                
                        });
                
        }

        signLikedShops(shopsList){
                
                var likedShopsIds = this.state.userInfo.liked.map(shop=>shop.shopId);
                var signedShopsList = shopsList.map(shop=>{
                        if(likedShopsIds.indexOf(shop.shopId) > -1){
                                shop.liked = true;
                        }else{
                                shop.liked = false;
                        }
                        return shop;
                });
                return signedShopsList;
        }

        postImpression(shopId,impression){
                var shopObject = this.state.shopsList.find(shop=>shop.shopId==shopId);
                
                var targetUrl = "/impressions"
                fetch(targetUrl,{
                        headers: {
                          'Accept': 'application/json',
                          'Content-Type': 'application/json',
                          'token' : this.props.accessToken
                        },
                        method: "POST",
                        body : JSON.stringify({impression : impression,
                                                shopObject: shopObject}) 
                    })
                        .then(blob => blob.json())
                        .then(data => {
                                if(!data.Error && impression=="liked"){
                                        this.setState(prevState=>{
                                                var shopObject = prevState.shopsList.find(shop=>shop.shopId==shopId);
                                                prevState.userInfo.liked.push(shopObject);
                                                shopObject.liked = true;
                                                return {userInfo : prevState.userInfo ,shopsList : prevState.shopsList,notification : {text : "1 shop added to Favorites",type: "orange"}};
                                        });
                                        
                                }else if(!data.Error && impression=="disliked"){
                                        this.setState(prevState=>{
                                                var shopsList = prevState.shopsList.filter(shop=>shop.shopId!=shopId);
                                                prevState.userInfo.disliked.push({shopId : shopId,expires:0});
                                                        
                                                return {userInfo : prevState.userInfo ,shopsList : shopsList, notification : {text : "1 shop Blocked",type: "dark"}};
                                        });
                                }
                                
                        });
                
        }

        unlike(shopId){
                var targetUrl = "/impressions"
                fetch(targetUrl,{
                        headers: {
                          'Accept': 'application/json',
                          'Content-Type': 'application/json',
                          'token' : this.props.accessToken
                        },
                        method: "DELETE",
                        body : JSON.stringify({impression: "liked",
                                               shopId: shopId}) 
                    })
                        .then(blob => blob.json())
                        .then(data => {
                                if(!data.Error){
                                        this.setState(prevState=>{
                                                var shopObject = prevState.shopsList.find(shop=>shop.shopId==shopId);
                                                shopObject.liked = false;
                                                prevState.userInfo.liked = prevState.userInfo.liked.filter(shop=>shop.shopId!=shopId);
                                                
                                                return {userInfo : prevState.userInfo ,shopsList : prevState.shopsList,notification : {text : "1 shop removed from Favorites",type: "orange"}};
                                        });
                                        
                                }
                        });
        }

        removeNotification(){
                setTimeout(()=>{
                        this.setState({notification :false})
                },3000);
                
        }

       logout(){

       }


        render() {  
                var notification = false;
                var profileData ={};
                if(this.state.userInfo){
                        profileData={
                                fullName : this.state.userInfo.fullName,
                                email : this.state.userInfo.email,
                                likedShopsCount : this.state.userInfo.liked.length,
                                dislikedShopsCount: this.state.userInfo.disliked.length
                        };
                }
                if(this.state.notification){
                  notification = <Notification info={this.state.notification} removeNotification={this.removeNotification}/>
                }
                return ( 
                        <BrowserRouter>
                                <div id="shops">
                                        <Route render={(props)=><Navigation pathname={props.location.pathname} data={profileData}  logout={this.props.logout}/> }/>
                                        <Route exact path='/' render={(props) => <NearbyShops shopsList={this.state.shopsList} coords={this.state.coords} postImpression={this.postImpression} /> } />
                                        <Route path='/favoriteshops'render={(props) => <FavoriteShops favoriteShopsList={ this.state.userInfo ? this.state.userInfo.liked : false} unlike={this.unlike} /> } />
                                        <Route path='/profile' render={(props)=><Profile data={profileData}  logout={this.props.logout} />}/>
                                        {notification}
                                        
                                </div>
                        </BrowserRouter>
                );
        }
}
 
export default Shops;