import React, { Component } from 'react';
import {BrowserRouter , Route} from 'react-router-dom';
import Navigation from './navigation';
import NearbyShops from './nearbyshops';
import FavoriteShops from './favoriteshops';
import Profile from './profile';

class Shops extends Component {
        constructor(props) {
                super(props);
                this.state = { 
                        shopsList : []
                 }
                 this.callMaps = this.callMaps.bind(this);
                 this.postImpression = this.postImpression.bind(this);
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
                        headers: { 'token' : this.props.accessToken }
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
                                                return {userInfo : prevState.userInfo ,shopsList : prevState.shopsList };
                                        });
                                        
                                }else if(!data.Error && impression=="disliked"){
                                        this.setState(prevState=>{
                                                var shopsList = prevState.shopsList.filter(shop=>shop.shopId!=shopId);
                                                prevState.userInfo.disliked.push({shopId : shopId,expires:0});
                                                        
                                                return {userInfo : prevState.userInfo ,shopsList : shopsList };
                                        });
                                }
                                
                        });
                
        }

       


        render() {  
                return ( 
                        <BrowserRouter>
                                <div id="shops">
                                        <Route component={Navigation}/>
                                        <Route exact path='/' render={(props) => <NearbyShops shopsList={this.state.shopsList} coords={this.state.coords} postImpression={this.postImpression} /> } />
                                        <Route path='/favoriteshops'render={(props) => <FavoriteShops favoriteShopsList={ this.state.userInfo ? this.state.userInfo.liked : false}/> } />
                                        <Route path='/profile' component={Profile}/>
                                </div>
                        </BrowserRouter>
                );
        }
}
 
export default Shops;