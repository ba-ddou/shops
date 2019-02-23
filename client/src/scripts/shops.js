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
                 this.likeShop = this.likeShop.bind(this);
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
                                this.setState(prevState=>{
                                     Array.prototype.push.apply(prevState.shopsList,data.shopsList);
                                     return {shopsList : prevState.shopsList };
                                        });
                                
                        });
                
        }

        likeShop(shopId){
                var likedShop = this.state.shopsList.find(shop=>shop.shopId==shopId);
                
                var targetUrl = "/impressions"
                fetch(targetUrl,{
                        headers: {
                          'Accept': 'application/json',
                          'Content-Type': 'application/json',
                          'token' : this.props.accessToken
                        },
                        method: "POST",
                        body : JSON.stringify({impression : "liked",
                                                shopObject: likedShop}) 
                    })
                        .then(blob => blob.json())
                        .then(data => {
                                
                                
                        });
                
        }


        render() {  
                return ( 
                        <BrowserRouter>
                                <div id="shops">
                                        <Route component={Navigation}/>
                                        <Route exact path='/' render={(props) => <NearbyShops shopsList={this.state.shopsList} coords={this.state.coords} likeShop={this.likeShop}/> } />
                                        <Route path='/favoriteshops'render={(props) => <FavoriteShops favoriteShopsList={this.state.userInfo.liked}/> } />
                                        <Route path='/profile' component={Profile}/>
                                </div>
                        </BrowserRouter>
                );
        }
}
 
export default Shops;