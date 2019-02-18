import React, { Component } from 'react';
import Home from './scripts/home';
import Shops from './scripts/shops';


class App extends Component {
  
  
    constructor(props) {
      super(props);
      this.state = { 
        accessToken : window.localStorage.getItem('accessToken')
      }
      this.authentication = this.authentication.bind(this);
    }
    
    authentication(token){
      this.setState({accessToken : token});
    }
   
  
    render() {
      const accessToken = this.state.accessToken;
      if(accessToken){return (
          <Shops />
        );}
      else{
        return(
          <Home authentication={this.authentication} />
        );}
    }
}

export default App;


