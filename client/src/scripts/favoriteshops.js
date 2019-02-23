import React, { Component } from 'react';

const FavoriteShopsList = () => {
    
    return(
        ""
    )
}

 


class FavoriteShops extends Component {
    constructor(props) {
        super(props);
    }
   
    render() { 

        var favoriteshopsList = this.props.favoriteShopsList;
        
        var shopsBody = "";
        // favoriteshopsList && favoriteshopsList.length > 0 ? <FavoriteShopsList favoriteShopsList={favoriteShopsList} /> : "";
        return ( 
            <div className="shops--container">
                {shopsBody}
            </div>

         );
    }
}
 
export default FavoriteShops;