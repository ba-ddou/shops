
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



module.exports = helpers;