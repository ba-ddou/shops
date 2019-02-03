




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


helpers.hash = (str)=>{
	if(typeof(str) == 'string' && str.length > 0){
		var hash = crypto.createHmac('sha256',config.hashingSecret).update(str).digest('hex'); 
		return hash;
	}else{
		return false;
	}
};



module.exports = helpers;