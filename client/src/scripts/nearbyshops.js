import React, { Component } from 'react';


const NearbyShopsPlaceholder = () => {
    return ( 
        <div className="shop shop--placeholder">
            <div className="shop--info">
                <span className="shop--info-name"></span>
                <span className="shop--info-adresse"></span>
                <div className="shop--info-image"></div>
            </div>
            <div className="shop--controles">
                <span className="shop--controles-distance"></span>
                <div className="shop--controles-dislike"></div>
                <div className="shop--controles-like"></div>
            </div>
        </div>
     );
}
 


class NearbyShops extends Component {
    
    constructor(props) {
        super(props);
        this.state = {  }
    }
        
    render() { 
        const numbers = [1,2,3,4,5,6,7,8];
        const listItems = numbers.map((number) =>
                                        <NearbyShopsPlaceholder key={number.toString()} />
                                    );
        return ( 
            <div className="shops--container">
                {listItems}
            </div>

         );
    }
}
 
export default NearbyShops;