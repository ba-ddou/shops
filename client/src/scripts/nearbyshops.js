import React, { Component } from 'react';


const NearbyShopsPlaceholder = () => {

    const numbers = [1,2,3,4,5,6,7,8];
    const listItems = numbers.map((number) =>
                                    <div className="shop shop--placeholder" key={number.toString()}>
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

    return ( 
        <React.Fragment>
            {listItems}
            <div className="shops--container-preloader">
                <div className="preloader-wrapper small active">
                    <div className="spinner-layer spinner-color">
                        <div className="circle-clipper left">
                            <div className="circle"></div>
                        </div>
                        <div className="gap-patch">
                            <div className="circle"></div>
                        </div>
                        <div className="circle-clipper right">
                            <div className="circle"></div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
     );
}
 


class NearbyShops extends Component {
    
    constructor(props) {
        super(props);
        this.state = {  }
    }
        
    render() { 
        
        return ( 
            <div className="shops--container">
                <NearbyShopsPlaceholder />
            </div>

         );
    }
}
 
export default NearbyShops;