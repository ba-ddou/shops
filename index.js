/*
*
*
* Primary file for the api
*
*/


const http = require('http');
const config = require('./lib/config');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const helpers = require('./lib/helpers');
const handlers = require('./lib/handlers');


// Istantiate he HTTP server
var httpServer = http.createServer((req,res)=> mainServer(req,res));

// Start the HTTP server
 httpServer.listen(config.httpPort,()=>{
    console.log('the server is listening on port '+config.httpPort);
});

var mainServer = (req,res)=>{

    //Get the url and parse it
    var parsedUrl = url.parse(req.url,true);

    //Get the path 

    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g,'');

    //Get the query string object
    var queryStringObject = parsedUrl.query;

    //Get the http method
    var method = req.method.toLowerCase();

    //Get the headers as an object
    var headers = req.headers;

    //Get the payload, if any 
    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data',data=> buffer+= decoder.write(data));
    req.on('end',()=>{
        buffer+=decoder.end();


        //create the data object to send to the handler
        var data = {
            trimmedPath : trimmedPath,
            queryStringObject : queryStringObject,
            method : method,
			headers : headers,
			payload : helpers.parseJsonToObject(buffer)
        }

        var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
        
        //route the request to the handler specified in the router
        chosenHandler(data,(statusCode,payload)=>{
            //use the status code called back by the handler or default to 200
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

            //use te payload called back from the handler or default to an empty object
            payload = typeof(payload) == 'object' ? payload : {};


            //convert the payload to a string
            var payloadString = JSON.stringify(payload);

            //Send a response
            res.setHeader('Content-Type','application/json');
            res.writeHead(statusCode);

            res.end(payloadString);

            console.log('Returning this response: ' ,statusCode,payloadString);
        });


    });


    //Define a request router
    var router = {
        'users' : handlers.users,
        'tokens' : handlers.tokens,
        'impressions' : handlers.impressions
    }

    

}