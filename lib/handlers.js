/*
*
*
*Request handlers
*
*
*/

//Dependecies
const helpers = require('./helpers');
const _data = require('./data');
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

    var fullName = typeof(data.payload.fullName) == 'string' && data.payload.fullName.trim().length >0 ? data.payload.fullName : false;
    var email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length >0 ? data.payload.email : false;
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length >0 ? data.payload.fullName : false;   
    
    if(fullName && email && password){
        //Make sur the user doesn't already exist
        _data.read('users',{email : email},res=>{
            if(!res){
                var hashedPassword  = helpers.hash(password);
                var userObject = {
                    fullName : fullName,
                    email : email,
                    hashedPassword : hashedPassword
                }
                _data.create('users',userObject,err=>{
                    if(!err){
                        callback(200);
                    }else{
                        callback(500,{'Error' : 'could not create new user'});
                    }
                });
            }else{
                callback(400,{'Error' : 'User already exists'});
            }
        });

    }else{
        callback(400,{'Error':'Missing required fields'});
    }
    
    
}




 //Not found handler
 handlers.notFound = (data,callback)=>{
    callback(404);
};

module.exports = handlers;