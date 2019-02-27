import React, { Component } from 'react';
import {Link, NavLink} from 'react-router-dom';




class WebNav extends Component {
    constructor(props) {
        super(props);
    }
    render() { 
        var pathname = this.props.pathname;
        return ( 
            <div id="webNav">
                <div id="webNav--links">
                    <Link to="/">
                        <div id="webNav--links-nearbyshops" className={pathname === 'Nearby Shops' ? 'webNav--link webNav--link-active' : 'webNav--link' }>
                            <span className="webNav--links-icon webNav--links-nearbyshopsIcon"></span>
                            <span className="webNav--links-title">Nearby Shops</span>
                        </div>
                    </Link>
                    <Link to="/favoriteshops">
                        <div id="webNav--links-favoriteshops" className={pathname === 'Favorite Shops' ? 'webNav--link webNav--link-active' : 'webNav--link' }>
                            <span className="webNav--links-icon webNav--links-favoriteshopsIcon"></span>
                            <span className="webNav--links-title">Favorite Shops</span>
                        </div>              
                    </Link>
                </div>
                <div id="webNav--logo"></div>
            </div>
         );
    }
}



class MobileNav extends Component {
   
        constructor(props) {
            super(props);
        }
        
    render() { 
        var pathname = this.props.pathname;
        return ( 
            <div id="mobileNav">
                <div id="currentPage">
                    <div id="currentpage--icon"></div>
                    <span>{pathname}</span>
                </div>
                <div id="mainNav">
                    <Link to="/">
                        <div id="mainav--nearbyshops" className={pathname === 'Nearby Shops' ? 'mainav--button-active' : '' }></div>
                    </Link>
                    <Link to="/favoriteshops">
                        <div id="mainav--favoriteshops" className={pathname === 'Favorite Shops' ? 'mainav--button-active' : '' }></div>              
                    </Link>
                    <Link to="profile">
                        <div id="mainav--profile"  className={pathname === 'Profile' ? 'mainav--button-active' : '' }></div>
                    </Link>
                    

                    
                </div>
            </div>
         );
    }
}
 







class Navigation extends Component {
    
        constructor(props) {
            super(props);
            this.state = { 
                device : window.innerWidth <=480 ? 'mobile' : 'web'
             }
        }
        

    render() { 
        var pathname = this.props.location.pathname.replace(/^\/+|\/+$/g,'');
        pathname = pathname === '' ? 'Nearby Shops' : pathname;
        pathname = pathname === 'favoriteshops' ? 'Favorite Shops' : pathname;
        pathname = pathname === 'profile' ? 'Profile' : pathname;
        const nav = this.state.device==='mobile' ? <MobileNav pathname={pathname} /> : <WebNav pathname={pathname} />;
        
        return ( 
            <React.Fragment>
                {nav}
            </React.Fragment>
            
         );
    }
}
 
export default Navigation;