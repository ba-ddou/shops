import React, { Component } from 'react';


const ShopThumbnail = (props) => {
    var photoUrlPrefix = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=';
    var placesApiKey = '&key=AIzaSyA8C43MGetCMCiAAyK33mUegbeAHrzXc4w';
    var shopThumbnail;
    if(props.photoRef){
        shopThumbnail = <img src={photoUrlPrefix+props.photoRef+placesApiKey} />
    }else{
        shopThumbnail = (<div className="shopThumbnail--placeholder">
                            <div>
                                <div className="shopThumbnail--placeholder-icon"></div>
                                <span>no available thumbnail</span>
                            </div>
                        </div>);
    }
    
    return ( 
        <React.Fragment>
            {shopThumbnail}
        </React.Fragment>
     );
}


const FavoriteShopsList = (props) => {
    var favoriteShopsList = props.favoriteShopsList;

    var listItems = favoriteShopsList.map((shop) =>
                                    (<div id={shop.shopId} className="shop" key={shop.shopId}>
                                        <div className="shop--info">
                                            <span className="shop--info-name">{shop.name}</span>
                                            <span className="shop--info-adresse">{shop.adresse}</span>
                                            <div className="shop--info-image">
                                                <ShopThumbnail photoRef={shop.photoRef} />
                                                
                                            </div>
                                        </div>
                                        <div className="shop--controles">
                                            
                                            <div className="shop--controles-dislike"></div>
                                            <div className={"shop--controles-like shop--controles-like-active"} ></div>
                                        </div>
                                    </div>)
                                );
    return(
        <React.Fragment>
            {listItems}
        </React.Fragment>
    )
}

 


class FavoriteShops extends Component {
    constructor(props) {
        super(props);
    }
   
    render() { 

        var shopsList = this.props.favoriteShopsList;
        
        var shopsBody = shopsList && shopsList.length > 0 ? <FavoriteShopsList favoriteShopsList={shopsList} /> : "";
        return ( 
            <div className="shops--container">
                {shopsBody}
            </div>

         );
    }
}
 
export default FavoriteShops;