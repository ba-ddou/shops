/*
*
*
* Create and export configuration variables
*
*
*/


var config = {};

config.staging={
    httpPort: 3001,
    mongoServer : 'mongodb://localhost:27017',
    dbName : 'shops',
    hashingSecret : 'password',
    placesApiKey : 'AIzaSyA8C43MGetCMCiAAyK33mUegbeAHrzXc4w'
};



module.exports = config.staging;