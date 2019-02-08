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
                _data.create('users',userObject,(err,res)=>{
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
    var acceptableMethods=['post','delete'];
    if(acceptableMethods.indexOf(data.method)>-1){
        handlers._impressions[data.method](data,callback);
    }else{
        callback(405);
    }
}






// Container for all the impressions subMethods
handlers._impressions = {}

// impressions - Post
// Required data: accessToken, shopObject
handlers._impressions.post = (data,callback)=>{
    //check if the token exists
    var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
    var data = typeof(data.payload) == 'object' ? data.payload : false;
    
    if(token && data.shopObject){

        //check if the user associated with the token exists in the database
        _data.read('users',{accessToken : token},res=>{
            if(res){
                //store user's ObjectId and associated impression array
                var userId = res[0]._id;

                var impression = helpers.impressionElement(data.impression,data.shopObject.shopId);
                //check if the shop already exists in the database
                _data.read('shops',{shopId : data.shopObject.shopId},res=>{
                    if(res){


                        //update the shops document
                        _data.update('shops',{shopId : data.shopObject.shopId},{$push:{users:userId}},err=>{
                            if(!err){
                                
                                //update the users document
                                _data.update('users',{accessToken : token},{$push: {[data.impression] : impression}},err=>{
                                    if(!err){
                                        callback(200);
                                    }else{
                                        callback(500,'could not update users');
                                    }
                                });
                            }else{
                                callback(500,'could not update shop');
                            }
                        });

                    }else{

                        //create shopObject and add the reference to the user
                        var shopObject = data.shopObject;
                        shopObject.users = [userId];

                        //insert shop object in the database
                        _data.create('shops',shopObject,(err,res)=>{
                            if(!err && res){
                                //update the users document
                                _data.update('users',{accessToken : token},{$push: {[data.impression] : impression}},err=>{
                                    if(!err){
                                        callback(200);
                                    }else{
                                        callback(500,'could not update users');
                                    }
                                });

                            }else{
                                callback(500,{'Error' : 'could not create shop document'});
                            }
                        });
                    }
                });
            }else{
                callback(404,{'Error' : 'could not find the user'});
            }
        });
    }else{

        callback(400,{'Error' : 'missing required fields'});
    }
    
}

// impressions - delete
// Required data: accessToken, shopObject
handlers._impressions.delete = (data,callback)=>{
    var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
    var shopObject = typeof(data.payload) == 'object' ? data.payload : false;


    if(token && shopObject){
        //check if the user associated with this token exists in the database
        _data.read('users' , {accessToken : token},res=>{
            if(res){

                //store user's ObjectId 
                var userId = res[0]._id;
                console.log(userId , typeof(userId));

                //lookup the shop in the database
                _data.read('shops',{shopId : shopObject.shopId},res=>{
                    if(res){

                        if(res[0].users.length>1){

                            _data.update('shops',{shopId : shopObject.shopId},{$pull:{users : {$in : [userId]}}},err=>{
                                if(!err){

                                    _data.update('users',{accessToken : token},{$pull : {[shopObject.impression] : {$in : [shopObject.shopId]}}},err=>{
                                        if(!err){
                                            callback(200);
                                        }else{
                                            callback(500,{'Error' : 'could not update user impressions'});
                                        }
                                    });
                                }else{
                                    callback(500,'could not update shop users');
                                }
                            });
                        }else{
                            _data.delete('shops',{shopId : shopObject.shopId},(err,docs)=>{
                                if(!err){

                                    _data.update('users',{accessToken : token},{$pull : {[shopObject.impression] : {$in : [shopObject.shopId]}}},err=>{
                                        if(!err){
                                            callback(200);
                                        }else{
                                            callback(500,{'Error' : 'could not update user impressions'});
                                        }
                                    });
                                }else{
                                    callback(500,{'Error' : 'could not delete shop'});
                                }
                            });
                        }
                    }else{
                        callback(400,{'Error' : 'shop not found'});
                    }
                });

            }else{
                callback(404,{'Error' : 'could not find user'});
            }
        }); 
    }
    
}

 //Not found handler
 handlers.notFound = (data,callback)=>{
    callback(404);
};

module.exports = handlers;