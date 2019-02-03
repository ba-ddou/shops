/*
*
*
*Library for interacting with database
*
*/


//Dependencies 
const MongoClient = require('mongodb').MongoClient;
const config = require('./config');

// Library container
var lib = {};


// create a new document
lib.create = (targetCollection,data,callback)=>{
    mongoServer = config.mongoServer;
    dbName = config.dbName;

    // create a new mongo client
    var client = new MongoClient(mongoServer,{useNewUrlParser : true});

    // connecting to the database
    client.connect(err=>{
        if(!err){
            var db = client.db(dbName);
            var collection = db.collection(targetCollection);

            //insert the new document
            collection.insert(data,(err,res)=>{
                if(!err){
                    client.close();
                    callback(false);
                }else{
                    callback('could not create document');
                }
            });




        }else{
            callback('could not connect to the database');
        }
    });
}


// Read data from the database
lib.read = (targetCollection,data,callback) => {
    mongoServer = config.mongoServer;
    dbName = config.dbName;

    // create a new mongo client
    var client = new MongoClient(mongoServer,{useNewUrlParser : true});

    // connecting to the database
    client.connect(err=>{
        if(!err){
            var db = client.db(dbName);
            var collection = db.collection(targetCollection);

            //select data from the database
            collection.find(data).toArray((err, docs) => {
                if(!err && docs.length > 0){
                    callback(docs);
                }else{
                    callback(false);
                }
              });

        }else{
            callback('could not connect to the database');
        }
    });
}



module.exports = lib;
