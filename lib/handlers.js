/*
*
*
*Request handlers
*
*
*/

//Dependecies
const helpers = require('./helpers');

//handlers container
var handlers = {};


// Users
handlers.users = (data,callback)=>{
    var acceptableMethods = ['post'];
    if(acceptableMethods.indexOf(data.method)>-1){
        handlers._users[data.method](data,callback);
    }else{
        callback(405);
    }
};


// users subMethods container
handlers._users={}

// users - post
// required data: fullname,email,password
handlers._users.post = (data,callback)=>{
    var obj = {};
    obj.data = data;
    obj.response = 'succefully received request from:'+ data.payload.firstName;
    callback(200,obj);
}




 //Not found handler
 handlers.notFound = (data,callback)=>{
    callback(404);
};

module.exports = handlers;