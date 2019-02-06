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
            collection.insertOne(data,(err,res)=>{
                if(!err){
                    client.close();
                    callback(false,res);
                }else{
                    client.close();
                    callback('could not create document',false);
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
                    client.close();
                    callback(docs);
                }else{
                    client.close();
                    callback(false);
                }
              });

        }else{
            callback('could not connect to the database');
        }
    });
}

// update a document
lib.update = (targetCollection,tragetDocument,data,callback) => {
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
            collection.updateOne(tragetDocument,{$set : data},(err,docs) => {
                if(!err){
                    client.close();
                    callback(false);
                }else{
                    client.close();
                    callback('could not update the document');
                }
              });

        }else{
            callback('could not connect to the database');
        }
    });
}



module.exports = lib;
