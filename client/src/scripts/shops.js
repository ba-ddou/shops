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
                               
                                this.callMaps();
                      });
        }

        callMaps(e){
                
                var targetUrl = '/shops?lat=33.56835840000001&lng=-7.6283904';
                fetch(targetUrl,{
                        headers: { 'token' : this.props.accessToken}
                        })
                        .then(blob => blob.json())
                        .then(data => {
                               
                                alert(data.nextPageToken);
                        });
                
        }


        render() {  
                return ( 
                        <BrowserRouter>
                                <div id="shops">
                                        <Route component={Navigation}/>
                                        <Route exact path='/' component={NearbyShops}/>
                                        <Route path='/favoriteshops' component={FavoriteShops}/>
                                        <Route path='/profile' component={Profile}/>
                                </div>
                        </BrowserRouter>
                );
        }
}
 
export default Shops;