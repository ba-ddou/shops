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
                               console.log('200');
                                this.setState({nextPageToken : data.nextPageToken});
                                this.setState(prevState=>{
                                     Array.prototype.push.apply(prevState.shopsList,data.shopsList);
                                     return {shopsList : prevState.shopsList };
                                        });
                        });
                
        }


        render() {  
                return ( 
                        <BrowserRouter>
                                <div id="shops">
                                        <Route component={Navigation}/>
                                        <Route exact path='/' render={(props) => <NearbyShops shopsList={this.state.shopsList} />}/>
                                        <Route path='/favoriteshops' component={FavoriteShops}/>
                                        <Route path='/profile' component={Profile}/>
                                </div>
                        </BrowserRouter>
                );
        }
}
 
export default Shops;