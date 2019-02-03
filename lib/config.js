/*
*
*
* Create and export configuration variables
*
*
*/


var config = {};

config.staging={
    httpPort: 3000,
    mongoServer : 'mongodb://localhost:27017',
    dbName : 'shops',
    hashingSecret : 'password'
};



module.exports = config.staging;