import React, { Component } from 'react';
import shopPhotoPlaceholder from './graphics/logo.png';

const Preloader = () => {
    return ( <div className="shops--container-preloader">
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
</div> );
}
 

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
            {Preloader}
        </React.Fragment>
     );
}

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
 



 
const NearbyShopsList = (props) =>{
    var shopsList = props.shopsList;
    var likeShop = props.likeShop;
    
    var listItems = shopsList.map((shop) =>
                                    (<div id={shop.shopId} className="shop" key={shop.shopId}>
                                        <div className="shop--info">
                                            <span className="shop--info-name">{shop.name}</span>
                                            <span className="shop--info-adresse">{shop.adresse}</span>
                                            <div className="shop--info-image">
                                                <ShopThumbnail photoRef={shop.photoRef} />
                                                
                                            </div>
                                        </div>
                                        <div className="shop--controles">
                                            <span className="shop--controles-distance">{shop.distance.substring(0,4) +"km"}</span>
                                            <div className="shop--controles-dislike"></div>
                                            <div className={props.animatedLikeShopId && props.animatedLikeShopId == shop.shopId ? "shop--controles-like shop--controles-like-active" : "shop--controles-like"} onClick={likeShop.bind(0,shop.shopId)}></div>
                                        </div>
                                    </div>)
                                );
    return(
        <React.Fragment>
            {listItems}
        </React.Fragment>
    )
}


class NearbyShops extends Component {
    
    constructor(props) {
        super(props);
        this.state = { 
            animatedLikeShopId : false
         }
        this.likeShopFeedback = this.likeShopFeedback.bind(this);
    }

    likeShopFeedback(shopId){
        this.setState({animatedLikeShopId : shopId});
        this.props.likeShop(shopId);
    }
        
    render() { 
        
        var shopsList = this.props.shopsList;
        
       
        var shopsBody = shopsList.length > 0 ? <NearbyShopsList shopsList={shopsList} likeShop={this.likeShopFeedback} animatedLikeShopId={this.state.animatedLikeShopId}/> : <NearbyShopsPlaceholder />;
        return ( 
            <div className="shops--container">
                {shopsBody}
            </div>

         );
    }
}
 
export default NearbyShops;