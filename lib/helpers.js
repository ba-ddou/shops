




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



module.exports = helpers;