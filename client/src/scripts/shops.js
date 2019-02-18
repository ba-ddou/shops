import React, { Component } from 'react';
import {BrowserRouter , Route} from 'react-router-dom';
import Navigation from './navigation';
import NearbyShops from './nearbyshops';
import FavoriteShops from './favoriteshops';
import Profile from './profile';

class Shops extends Component {
        constructor(props) {
                super(props);
                this.state = {  }
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