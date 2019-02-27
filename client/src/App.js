import React, { Component } from 'react';
import Home from './scripts/home';
import Shops from './scripts/shops';


class App extends Component {
  
  
    constructor(props) {
      super(props);
      this.state = { 
        accessToken : window.localStorage.getItem('accessToken') ? window.localStorage.getItem('accessToken') : sessionStorage.accessToken
      }
      this.authentication = this.authentication.bind(this);
      this.logout = this.logout.bind(this);
    }
    
    authentication(token){
      this.setState({accessToken : token});
    }
   
    logout(){
      window.localStorage.removeItem('accessToken');
      sessionStorage.accessToken = false;
      this.setState({accessToken : false});
    }
  
    render() {
      
      const accessToken = this.state.accessToken;
      if(accessToken){return (
          <Shops accessToken={this.state.accessToken} logout={this.logout}/>
        );}
      else{
        return(
          <Home authentication={this.authentication} />
        );}
    }
}

export default App;


