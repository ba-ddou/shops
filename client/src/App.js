import React, { Component } from 'react';
import Home from './scripts/home';
import Shops from './scripts/shops';


class App extends Component {
  
  
    constructor(props) {
      super(props);
      this.state = { 
        accessToken : window.localStorage.getItem('accessToken')
      }
     
    }
    
   
  
  render() {
    const accessToken = this.state.accessToken;
    if(accessToken)
      return (
        <Home />
      );
    else{
      return(
        <Shops />
      );  
    }
  }
}

export default App;


