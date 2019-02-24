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
const config = require('./config');
const fetch = require('node-fetch');
//handlers container
var handlers = {};


// Users
handlers.users = (data,callback)=>{
    var acceptableMethods = ['post','get'];
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
    var email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length >0 ? data.payload.email.toLowerCase() : false;
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length >0 ? data.payload.password : false;   
    
    if(fullName && email && password){
        //Make sur the user doesn't already exist
        _data.read('users',{email : email},res=>{
            if(!res){

                // hash the password
                var hashedPassword  = helpers.hash(password);

                // generate a random access token
                var accessToken = helpers.createRandomString(20);

                // create the user object
                var userObject = {
                    fullName : fullName,
                    email : email,
                    hashedPassword : hashedPassword,
                    accessToken : accessToken,
                    liked : [],
                    disliked : []
                }

                // insert the user object in the database
                _data.create('users',userObject,(err,res)=>{
                    if(!err){

                        // callback the user's access token
                        callback(200,{'accessToken' : res.ops[0].accessToken});
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

//Users - get
//Required data : accessToken
//Optional data : none
handlers._users.get = (data,callback)=>{
    //check if the token exists
    var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
    if(token){

        // read user data from the database
        _data.read('users',{accessToken : token},res=>{
            if(res){
                // unblock shops which blocking period is expired
                handlers._impressions.unblockShops(res[0]);

                // read user data from the database
                _data.read('users',{accessToken : token},res=>{
                    if(res){
                        // delete _id, token and password from the userObject
                        var userObject = res[0];
                        delete userObject._id;
                        delete userObject.accessToken;
                        delete userObject.hashedPassword;
                        
                        // loop throught the liked shops and map shopsIds to their respective shop object
                        if(userObject.liked && userObject.liked.length>0){
                            var shopObjects=[];
                            var shopsCounter = 0;
                            userObject.liked.forEach(shopId=>{
                                
                                _data.read('shops',{shopId : shopId},res=>{
                                    
                                    delete res[0]._id;
                                    delete res[0].users;
                                    shopObjects.push(res[0]);
                                    shopsCounter++;
                                    if(shopsCounter == userObject.liked.length){
                                        userObject.liked = shopObjects;
                                        callback(200,userObject)

                                    }
                                    
                                });
                                
                            });
                            

                       }else{
                        callback(200,userObject);
                       }
                        
                        
                    }else{
                        callback(500,{'Error' : 'could not read user data'});
                    }
                });
                
                
                
            }else{
                callback(404,{'Error' : 'user not found'});
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
    var email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length > 0 ? data.payload.email.toLowerCase() : false;
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

    if(email && password){
        // find the user that matches the email
        _data.read('users',{email : email},res=>{
            if(res){
                //hash the sent password and compare it to the password stored in the database
                var hashedPassword = helpers.hash(password);

                if(hashedPassword && hashedPassword == res[0].hashedPassword){
                    // callback the access token
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
                var shopPullQuery = helpers.shopPullQuery(shopObject.impression,shopObject.shopId);

                //lookup the shop in the database
                _data.read('shops',{shopId : shopObject.shopId},res=>{

                    if(res){
                        // check the number of user impressions on this shop
                        if(res[0].users.length>1){
                            // remove the user ObjectId from the shops users
                            _data.update('shops',{shopId : shopObject.shopId},{$pull:{users : {$in : [userId]}}},err=>{
                                if(!err){

                                    // remove the shopId from the user object
                                    _data.update('users',{accessToken : token},shopPullQuery,err=>{
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

                            // delete the shops object
                            _data.delete('shops',{shopId : shopObject.shopId},(err,docs)=>{
                                if(!err){
                                    //remove the shopId from the user object
                                    _data.update('users',{accessToken : token},shopPullQuery,err=>{
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
                        callback(404,{'Error' : 'shop not found'});
                    }
                });

            }else{
                callback(404,{'Error' : 'could not find user'});
            }
        }); 
    }
    
}


// filter a user's disliked shops array, and delete shops in which the blocking period is expired
handlers._impressions.unblockShops = (userObject)=>{
    if(userObject){
        // filter the array
        var disliked = userObject.disliked;
        if(disliked){
            var date = Date.now();
        var toUnblock = disliked.filter(e=>date>e.expires);
        toUnblock = toUnblock.map(e=>e.shopId);

        // delete expired blocks from the database
        toUnblock.forEach(e => {
            handlers._impressions.delete({headers:{token : userObject.accessToken},payload:{impression : 'disliked' , shopId : e}},(code,err)=>{});
            
        });
        }
        
    }
        
}


// shops
handlers.shops = (data,callback)=>{
    var acceptableMethods = ['get'];
    if(acceptableMethods.indexOf(data.method)>-1){
        handlers._shops[data.method](data,callback);
    }else{
        callback(405);
    }
};

handlers._shops = {};
// shops - get
// required data: accessToken, coordinates
// optional fields : nextPageToken
handlers._shops.get = (data,callback)=>{
    var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
    var lat = data.queryStringObject.lat ? data.queryStringObject.lat : false;
    var lng = data.queryStringObject.lng ? data.queryStringObject.lng : false;
    var nextPageToken = typeof(data.queryStringObject.nextPageToken) == 'string' ? data.headers.nextPageToken : false;
    console.log(lat);
    console.log(lng);
    _data.read('users' , {accessToken : token},res=>{
        if(res){

            if( (lat && lng) || nextPageToken){
                var apiPath = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?';
                var targetUrl = nextPageToken ? apiPath+'pagetoken='+nextPageToken+'&key='+config.placesApiKey : apiPath+'location='+lat+','+lng+'&rankby=distance&type=restaurant&key='+config.placesApiKey ;

                fetch(targetUrl)
                .then(blob => blob.json())
                .then(data => {
                    
                    var shopsList = data.results.map(e=>{
                        var shop = {};
                        shop.shopId = e.place_id;
                        shop.name = e.name;
                        shop.adresse = e.vicinity;
                        shop.photoRef = e.photos ? e.photos[0].photo_reference : false;
                        shop.distance = helpers.distance({lat : lat, lng : lng},e.geometry.location);
                        shop.coords = e.geometry.location;
                        
                        return shop;
                                                        });
                    
                    callback(200,{nextPageToken : data.next_page_token,shopsList : shopsList});
                });

            }else{
                callback(400,{'Error' : 'Missing required fields'});
            }

        }else{
            
            callback(404,{'Error' : 'the specified user in not found'});
        }
    });

}


 //Not found handler
 handlers.notFound = (data,callback)=>{
    callback(404);
};

module.exports = handlers;