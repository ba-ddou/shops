




//Dependencies
var crypto = require('crypto');
var config = require('./config')

//helpers container
var helpers = {};



//Parse a json string to an object without throwing any errors
helpers.parseJsonToObject = (str)=>{
    try{
        var obj = JSON.parse(str);
        return obj;
    }catch(e){
        return {};
    }
};

//Create a SHA256 hash
helpers.hash = (str)=>{
	if(typeof(str) == 'string' && str.length > 0){
		var hash = crypto.createHmac('sha256',config.hashingSecret).update(str).digest('hex'); 
		return hash;
	}else{
		return false;
	}
};


//Create a random alphanumeric string
helpers.createRandomString = strLength=>{
    strLength = typeof(strLength) =='number' && strLength>0 ? strLength : false;
    if(strLength){
        var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';

        
        var str = '';
        for(var i=0;i<strLength;i++){

            var randomCharacter = characters.charAt(Math.floor(Math.random()*characters.length));
            str += randomCharacter;
        }
        return str;

    }else{
        return false;
    }
}

//Create impression object 
helpers.impressionElement = (impression,shopId)=>{

    if(impression == 'liked'){
        return shopId;
    }else if(impression == "disliked"){
        var expires = Date.now() + 1000*60*60*2;
        return {
            shopId : shopId,
            expires : expires
        };
    }else return false;
}


//create a shop pull query
helpers.shopPullQuery = (impression,shopId)=>{
    if(impression == 'liked'){
        return {$pull : {
            liked : {
                $in : [shopId]
            }}};
    }else if(impression == "disliked"){
        return {$pull:{
            disliked : {
                shopId : shopId
            }
        }};
    }else return false;
}

//Calculate the distance between 2 coordinates
helpers.distance = (userCoords,shopCoords)=>{
    var earthRadiusKm = 6371;

    var dLat = (userCoords.lat-shopCoords.lat)*0.0174532925199433;
    var dLng = (userCoords.lng-shopCoords.lng)*0.0174532925199433;

    userCoords.lat = userCoords.lat*0.0174532925199433;
    shopCoords.lat = shopCoords.lat*0.0174532925199433;

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLng/2) * Math.sin(dLng/2) * Math.cos(userCoords.lat) * Math.cos(shopCoords.lat); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 

    var distance = earthRadiusKm * c;

    return distance.toString();
}





module.exports = helpers;