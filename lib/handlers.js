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
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length >0 ? data.payload.password : false;   
    
    if(fullName && email && password){
        //Make sur the user doesn't already exist
        _data.read('users',{email : email},res=>{
            if(!res){
                var hashedPassword  = helpers.hash(password);
                var accessToken = helpers.createRandomString(20);
                var userObject = {
                    fullName : fullName,
                    email : email,
                    hashedPassword : hashedPassword,
                    accessToken : accessToken
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


// Tokens
handlers.tokens= (data,callback)=>{
    var acceptableMethods=['post'];
    if(acceptableMethods.indexOf(data.method)>-1){
        handlers._tokens[data.method](data,callback);
    }else{
        callback(405);
    }
}

// Container for all the tokens subMethods
handlers._tokens = {}

// Token -post
// required data: email, password
// optional data: none
handlers._tokens.post = (data,callback)=>{
    var email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length > 0 ? data.payload.email.trim() : false;
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

    if(email && password){
        // find the user that matches the email
        _data.read('users',{email : email},res=>{
            if(res){
                //hash the sent password and compare it to the password stored in the database
                var hashedPassword = helpers.hash(password);

                if(hashedPassword && hashedPassword == res[0].hashedPassword){
                    callback(200,{accessToken : res[0].accessToken});

                }else{
                    
                    callback(400,{'Error' : 'the email and password combination does not match'});
                }

            }else{
                callback(404,{'Error' : 'could not find the user'});
            }
        });
    }else{
        callback(400,{'Error' : 'missing required fields'});
    }
}

// Impressions
handlers.impressions = (data,callback)=>{
    var acceptableMethods=['post'];
    if(acceptableMethods.indexOf(data.method)>-1){
        handlers._tokens[data.method](data,callback);
    }else{
        callback(405);
    }
}

// Container for all the impressions subMethods
handlers._impressions = {}

// impressions - Post
// Required data: accessToken, shopObject
handlers._impressions.post = (data,callback)=>{
    
}


 //Not found handler
 handlers.notFound = (data,callback)=>{
    callback(404);
};

module.exports = handlers;