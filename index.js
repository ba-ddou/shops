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

        jsonData = JSON.stringify(data);

        res.setHeader('Content-Type','application/json'); 
        res.end(jsonData);

        console.log('Returning this response: ' ,jsonData);

    });

    

}