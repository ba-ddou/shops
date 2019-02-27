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

    const numbers = [1,2,3,4,5,6,7,8,9,10,11,12];
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
            <Preloader />
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
    var shopsList = props.shopsList.filter(shop=>!shop.liked);
    var impressionFeedback = props.impressionFeedback;
    
    var listItems = shopsList.map((shop) =>
                                    (<div id={shop.shopId} className={(props.animatedDislikeShopId.length > 0 && props.animatedDislikeShopId.indexOf(shop.shopId) >-1 ) || (props.animatedLikeShopId.length > 0 && props.animatedLikeShopId.indexOf(shop.shopId) > -1 ) ? "shop shop--remove" : "shop"} key={shop.shopId}>
                                        <div className="shop--info">
                                            <span className="shop--info-name">{shop.name}</span>
                                            <span className="shop--info-adresse">{shop.adresse}</span>
                                            <div className="shop--info-image">
                                                <ShopThumbnail photoRef={shop.photoRef} />
                                                
                                            </div>
                                        </div>
                                        <div className="shop--controles">
                                            <span className="shop--controles-distance">{shop.distance.substring(0,4) +"km"}</span>
                                            <div className={props.animatedDislikeShopId && props.animatedDislikeShopId == shop.shopId ? "shop--controles-dislike shop--controles-dislike-active" : "shop--controles-dislike"} onClick={impressionFeedback.bind(0,shop.shopId,"disliked")}></div>
                                            <div className={props.animatedLikeShopId && props.animatedLikeShopId == shop.shopId ? "shop--controles-like shop--controles-like-active" : "shop--controles-like"} onClick={impressionFeedback.bind(0,shop.shopId,"liked")}></div>
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
            animatedLikeShopId : [],
            animatedDislikeShopId : []

         }
        this.impressionFeedback = this.impressionFeedback.bind(this);
    }

    impressionFeedback(shopId,impression){
        if(impression == "liked") this.setState(prevState=>{ 
                                                     prevState.animatedLikeShopId.push(shopId);
                                                     return {animatedLikeShopId : prevState.animatedLikeShopId};
                                                });
        else this.setState(prevState=>{
                                prevState.animatedDislikeShopId.push(shopId);
                                return {animatedDislikeShopId : prevState.animatedDislikeShopId};
                                        });
        this.props.postImpression(shopId,impression);
    }
        
    render() { 
        
        var shopsList = this.props.shopsList;
        
       
        var shopsBody = shopsList.length > 0 ? <NearbyShopsList shopsList={shopsList} impressionFeedback={this.impressionFeedback} animatedLikeShopId={this.state.animatedLikeShopId} animatedDislikeShopId={this.state.animatedDislikeShopId}/> : <NearbyShopsPlaceholder />;
        return ( 
            <div className="shops--container">
                {shopsBody}
            </div>

         );
    }
}
 
export default NearbyShops;