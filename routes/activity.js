//'use strict';
var util = require('util');

// Deps
const SFClient = require('../utils/sfmc-client');
const logger = require('../utils/logger');

const Path = require('path');
const JWT = require(Path.join(__dirname, '..', 'lib', 'jwtDecoder.js'));

var http = require('https');


exports.logExecuteData = [];

function logData(req) {
  exports.logExecuteData.push({
    body: req.body,
    headers: req.headers,
    trailers: req.trailers,
    method: req.method,
    url: req.url,
    params: req.params,
    query: req.query,
    route: req.route,
    cookies: req.cookies,
    ip: req.ip,
    path: req.path,
    host: req.host,
    fresh: req.fresh,
    stale: req.stale,
    protocol: req.protocol,
    secure: req.secure,
    originalUrl: req.originalUrl
  });
  console.log("body: " + util.inspect(req.body));
  console.log("headers: " + req.headers);
  console.log("trailers: " + req.trailers);
  console.log("method: " + req.method);
  console.log("url: " + req.url);
  console.log("params: " + util.inspect(req.params));
  console.log("query: " + util.inspect(req.query));
  console.log("route: " + req.route);
  console.log("cookies: " + req.cookies);
  console.log("ip: " + req.ip);
  console.log("path: " + req.path);
  console.log("host: " + req.host);
  console.log("fresh: " + req.fresh);
  console.log("stale: " + req.stale);
  console.log("protocol: " + req.protocol);
  console.log("secure: " + req.secure);
  console.log("originalUrl: " + req.originalUrl);
}

/*
 * POST Handler for / route of Activity (this is the edit route).
 */
exports.edit = function (req, res) {

  console.log("5 -- For Edit");
  console.log("4");
  console.log("3");
  console.log("2");
  console.log("1");
  //console.log("Edited: "+req.body.inArguments[0]);    

  // Data from the req and put it in an array accessible to the main app.
  //console.log( req.body );
  logData(req);
  res.send(200, 'Edit');
};

/*
 * POST Handler for /save/ route of Activity.
 */
exports.save = function (req, res) {

  console.log("5 -- For Save");
  console.log("4");
  console.log("3");
  console.log("2");
  console.log("1");
  //console.log("Saved: "+req.body.inArguments[0]);

  // Data from the req and put it in an array accessible to the main app.
  console.log('Data from the req:' + req.body);
  logData(req);
  res.send(200, 'Save');
};

/**
 * The Journey Builder calls this method for each contact processed by the journey.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */

exports.execute = function (req, res) {

  console.log("5 -- For Execute");
  console.log("4");
  console.log("3");
  console.log("2");
  console.log("1");

  console.log('Request Body:-' + JSON.stringify(req.body));
  console.log("Executed1: " + req.body.inArguments[0]);

  var requestBody = req.body.inArguments[0];
  console.log('requestBody:' + requestBody);

  const toNumber = req.body.keyValue;
  console.log('To Number:' + toNumber);


  const accountSid = requestBody.accountSid;
  const authToken = requestBody.authToken;
  const to = requestBody.to;
  const from = requestBody.messagingService;
  const body = requestBody.body;
  console.log('Body' + body);

  var axios = require('axios');
  
  var data = JSON.stringify({
    "channel": {
      "id": accountSid
    },
    "contact": {
      "phone_number": toNumber
    },
    "content": {
      "type": "text",
      "payload": body
    }
  });

  var config = {
    method: 'post',
    url: 'https://api.amio.io/v1/messages',
    headers: {
      'authorization': 'Bearer VRnIkYCKVGVV52s8Gg1vEfIFotOKmPlXrWpymHl4eQ0qfAsz0mCM122vTBOXLrOQWGswtK3SNXFIWAjw6MPXgPwV86',
      'content-type': 'application/json'
    },
    data: data
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });

  //const client = require('twilio')(accountSid, authToken); 

  /*client.messages 
        .create({ 
           body: body,
           from: from,
           to: toNumber
         }) 
        .then(message =>{
             console.log(JSON.stringify(message));
             console.log("Account SID:"+message.accountSid);
             console.log("apiVersion:"+message.apiVersion);
             try
             {
                  SFClient.saveData(process.env.DATA_EXTENSION_EXTERNAL_KEY, [
                    {
                      keys: {
                        uri: message.uri,
                      },
                      values: {
                        uri: message.uri,  
                        account_sid: message.accountSid,
                        api_version: message.apiVersion,
                        body:message.body,
                        date_created:message.dateCreated,
                        date_sent:message.dateSent,
                        date_updated:message.dateUpdated,
                        direction:message.direction,
                        error_code:message.errorCode,
                        error_message:message.errorMessage,
                        from:message.from,
                        messaging_service_sid:message.messagingServiceSid,
                        num_media:message.numMedia,
                        num_segments:message.numSegments,
                        price:message.price,
                        price_unit:message.priceUnit,
                        sid:message.sid,
                        status:message.status,
                        to:message.to,  
                      },
                    },
                  ]);
             }
              catch(err)   
             {
                 console.log(err);
             }
      
          }) 
        .done();*/

  // FOR TESTING
  logData(req);
  res.send(200, 'Publish');



  // Used to decode JWT
  /*JWT(req.body, process.env.jwtSecret, (err, decoded) => {

     // verification error -> unauthorized request
       if (err) {
           console.error(err);
           return res.status(401).end();
       }

       if (decoded && decoded.inArguments && decoded.inArguments.length > 0) {
          
           // decoded in arguments
            var decodedArgs = decoded.inArguments[0];
           
            const accountSid = decodedArgs.accountSid;
            const authToken = decodedArgs.authToken;
            const to = decodedArgs.to;
            const from = decodedArgs.messagingService;
            const body = decodedArgs.body;
            console.log('Body'+body);
           console.log('from'+from);

            const client = require('twilio')(accountSid, authToken); 

              client.messages 
                    .create({ 
                       body: body,
                       messagingService: from,
                       to: to
                     }) 
                    .then(message => console.log(message.sid)) 
                    .done();
               
          
           logData(req);
           res.send(200, 'Execute');
       } else {
           console.error('inArguments invalid.');
           return res.status(400).end();
       }
   });*/
};

/**
 * Endpoint that receives a notification when a user saves the journey.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */

/*
 * POST Handler for /publish/ route of Activity.
 */
exports.publish = function (req, res) {

  console.log("5 -- For Publish");
  console.log("4");
  console.log("3");
  console.log("2");
  console.log("1");
  //console.log("Published: "+req.body.inArguments[0]);        

  // Data from the req and put it in an array accessible to the main app.
  console.log(req.body);
  logData(req);
  res.send(200, 'Publish');
};

/*
 * POST Handler for /validate/ route of Activity.
 */
exports.validate = function (req, res) {

  console.log("5 -- For Validate");
  console.log("4");
  console.log("3");
  console.log("2");
  console.log("1");
  //console.log("Validated: "+req.body.inArguments[0]);       

  // Data from the req and put it in an array accessible to the main app.
  //console.log( req.body );
  logData(req);
  res.send(200, 'Validate');
};
