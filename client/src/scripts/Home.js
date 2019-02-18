import React, { Component } from 'react';
import logo from './graphics/logo.png';

const AuthenticationControles = (props) => {
    
    var signinState = props.signUp ? "authentication--button-active" : "";
    var signupState = !props.signUp ? "authentication--button-active" : "";

    return ( 
        
        <div id="AuthenticationControles">
                <div id="signinButton" className={"authentication--button authentication--button-left "+signinState} onClick={props.signinBtnClicked}>
                    <span>Sign in</span>
                </div>
                <div id="signupButton" className={"authentication--button authentication--button-right "+signupState} onClick={props.signupBtnClicked}>
                    <span>Sign up</span>
                </div>
            </div> 
     );
}
 


const AuthenticationButton = (props) => {   
    if(props.buttonState) return(
        <div id="AuthenticationButton">
            <div>
            <div class="preloader-wrapper small active">
                <div class="spinner-layer spinner-color">
                    <div class="circle-clipper left">
                        <div class="circle"></div>
                    </div>
                    <div class="gap-patch">
                        <div class="circle"></div>
                    </div>
                    <div class="circle-clipper right">
                        <div class="circle"></div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
    else return ( 
        <div id="AuthenticationButton" onClick={props.postForm} >
            <span>{props.text}</span>          
        </div>
     );
}

class AuthenticationForm extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            error : "",
            fullname : "",
            email : "",
            password : "",
            saveSession : false
         }
         this.updateForm = this.updateForm.bind(this);
         this.postForm = this.postForm.bind(this);
    }

    componentDidUpdate(prevProps){
        if(this.props.signUp != prevProps.signUp){
            this.setState({
                buttonSpinner : false,
                error : "",
                fullname : "",
                email : "",
                password : "",
                saveSession : false
            });
        }
    }

    updateForm(){
        var formValues = {
            fullname : document.getElementById('fullname').value,
            email : document.getElementById('email').value,
            password : document.getElementById('password').value,
            saveSession : document.getElementById('authenticationCheckbox').checked
        }
        this.setState(formValues);
        
    }

    postForm(){
        var path = this.props.signUp ? "/users" : "/tokens";
        this.setState({buttonSpinner : true});
        fetch(path,{
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({fullName: this.state.fullname, email: this.state.email , password : this.state.password})
        })
          .then(blob => blob.json())
          .then(data => {
            this.processResponse(data);
          });
        
    }

    processResponse(data){
        if(data.accessToken){
            if(this.state.saveSession) window.localStorage.setItem('accessToken' , data.accessToken);
            else sessionStorage.accessToken = data.accessToken;
            this.props.authentication(data.accessToken);
            
  
        }else{
            this.setState({error : data.Error});
            
        }
        this.setState({buttonSpinner : false});
    }
    
    render() { 

        return (
            <div id="AuthenticationForm" className={this.state.error ? 'error' : ''}>
                <div className={"input-field form--element "+(this.props.signUp ? "show" : "hide")}>
                    <input  id="fullname" type="text" value={this.state.fullname} onChange={this.updateForm} />
                    <label for="fullname">Fullname</label>
                </div>  
                <div className="input-field form--element">
                    <input  id="email" type="text" value={this.state.email} onChange={this.updateForm} />
                    <label for="email">Email</label>
                </div>

                <div className="input-field form--element">
                    <input  id="password" type="password" value={this.state.password} onChange={this.updateForm} />
                    <label for="password">Password</label>
                </div>
                <p className={this.props.signUp ? 'hide' : 'show'}>
                    <label>
                        <input id="authenticationCheckbox" type="checkbox" className="filled-in" checked={this.state.saveSession} onChange={this.updateForm}  />
                        <span>save my session</span>
                    </label>
                </p>

                <div id="authenticationError" className={this.state.error ? 'show' : 'hide'}>
                    <span></span>{this.state.error}
                </div>
                        
                <AuthenticationButton text={this.props.signUp ? 'SIGNUP' : 'LOGIN'} postForm={this.postForm} buttonState={this.state.buttonSpinner} />

            </div>
         );
    }
}

class AuthenticationWidget extends Component {
    
    render() { 
        var AuthenticationWidgetTitle = this.props.signUp ? "Create an account" : "Log in to Shops.";
        return ( 
            <div id="AuthenticationWidget">
                <span id="AuthenticationWidgetTitle">{AuthenticationWidgetTitle}</span>
                <AuthenticationForm signUp={this.props.signUp} authentication={this.props.authentication}/>
            </div>
         );
    }
}


const BannerGraphics = (props) => {
    return ( 
        <div id="BannerGraphics">
            <img id="logo" src={logo} alt="logo" />
            <div id="bannerIllustration"></div>
        </div>
     );
}

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = { signUp : false };
        this.signinBtnClicked = this.signinBtnClicked.bind(this);
        this.signupBtnClicked = this.signupBtnClicked.bind(this);
      }
    
      signinBtnClicked(){
        this.setState({ signUp : false });
      }
    
      signupBtnClicked(){
        this.setState({signUp : true });
      }
      
    render() { 
        return ( 
            <div id="Home">
                <BannerGraphics />
                <AuthenticationWidget signUp={this.state.signUp} authentication={this.props.authentication} />
                <AuthenticationControles signUp={this.state.signUp} signinBtnClicked={this.signinBtnClicked} signupBtnClicked={this.signupBtnClicked}/>
            </div>
         );
    }
}

 




 
export default Home;