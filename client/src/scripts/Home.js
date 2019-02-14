import React, { Component } from 'react';
import logo from './graphics/logo.png';

const AuthenticationControles = (props) => {
    return ( 
        <div id="AuthenticationControles">
                <div id="signinButton" className={props.signinState}>
                    <span>Sign in</span>
                </div>
                <div id="signupButton" className={props.signupState}>
                    <span>Sign up</span>
                </div>
            </div> 
     );
}
 


const AuthenticationButton = (props) => {
    return ( 
        <div id="AuthenticationButton">
            <span>{props.text}</span>          
        </div>
     );
}

class AuthenticationForm extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <div id="AuthenticationForm">

                <div class="input-field form--element">
                    <input  id="email" type="text" class="validate" />
                    <label for="email">Email</label>
                </div>

                <div class="input-field form--element">
                    <input  id="password" type="password" class="validate" />
                    <label for="password">Password</label>
                </div>

                <p>
                    <label>
                        <input id="authenticationCheckbox" type="checkbox" class="filled-in" checked = "true" />
                        <span>save my session</span>
                    </label>
                </p>
                
                <AuthenticationButton />

            </div>
         );
    }
}

class AuthenticationWidget extends Component {
    state = {  }
    render() { 
        return ( 
            <div id="AuthenticationWidget">
                <span>Log in to Shops.</span>
                <AuthenticationForm />
            </div>
         );
    }
}


const BannerGraphics = (props) => {
    return ( 
        <div id="BannerGraphics">
            <img src={logo} alt="logo" />
            <div id="bannerIllusration"></div>
        </div>
     );
}

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <div id="Home">
                <BannerGraphics />
                <AuthenticationWidget />
                <AuthenticationControles />
            </div>
         );
    }
}

 




 
export default Home;