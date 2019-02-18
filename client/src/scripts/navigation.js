import React, { Component } from 'react';
import {Link, NavLink} from 'react-router-dom';




class WebNav extends Component {
    state = {  }
    render() { 
        return ( 
            <div>WebNav</div>
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
                        <div id="mainav--nearbyshops" className={pathname == 'Nearby Shops' ? 'mainav--button-active' : '' }></div>
                    </Link>
                    <Link to="/favoriteshops">
                        <div id="mainav--favoriteshops" className={pathname == 'Favorite Shops' ? 'mainav--button-active' : '' }></div>              
                    </Link>
                    <Link to="profile">
                        <div id="mainav--profile"  className={pathname == 'Profile' ? 'mainav--button-active' : '' }></div>
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
        pathname = pathname == '' ? 'Nearby Shops' : pathname;
        pathname = pathname == 'favoriteshops' ? 'Favorite Shops' : pathname;
        pathname = pathname == 'profile' ? 'Profile' : pathname;
        const nav = this.state.device=='mobile' ? <MobileNav pathname={pathname} /> : <WebNav pathname={pathname} />;
        
        return ( 
            <React.Fragment>
                {nav}
            </React.Fragment>
            
         );
    }
}
 
export default Navigation;