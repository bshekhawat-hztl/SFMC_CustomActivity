define([
    'postmonger'
], function(
    Postmonger
) {
    'use strict';

    var connection = new Postmonger.Session();
    var payload = {};
    var lastStepEnabled = false;
    var steps = [ // initialize to the same value as what's set in config.json for consistency
        { "label": "Create SMS Message", "key": "step1" }
    ];
    var currentStep = steps[0].key;

    $(window).ready(onRender);

    connection.on('initActivity', initialize);
    connection.on('requestedTokens', onGetTokens);
    connection.on('requestedEndpoints', onGetEndpoints);

    connection.on('clickedNext', save);
    //connection.on('clickedBack', onClickedBack);
    //connection.on('gotoStep', onGotoStep);

    function onRender() {
        // JB will respond the first time 'ready' is called with 'initActivity'
        connection.trigger('ready');
        connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');
    }

  function initialize(data) {
       console.log("Initializing data data: "+ JSON.stringify(data));
        if (data) {
            payload = data;
        }    

        var hasInArguments = Boolean(
            payload['arguments'] &&
            payload['arguments'].execute &&
            payload['arguments'].execute.inArguments &&
            payload['arguments'].execute.inArguments.length > 0
         );

        var inArguments = hasInArguments ? payload['arguments'].execute.inArguments : {};

        console.log('Has In arguments: '+JSON.stringify(inArguments));

        $.each(inArguments, function (index, inArgument) {
            $.each(inArgument, function (key, val) {

                if (key === 'accountSid') {
                    $('#accountSID').val(val);
                }

                if (key === 'authToken') {
                    $('#authToken').val(val);
                }

                if (key === 'messagingService') {
                    $('#messagingService').val(val);
                }

                if (key === 'body') {
                    $('#messageBody').val(val);
                }                                                               

            })
        });

        connection.trigger('updateButton', {
            button: 'next',
            text: 'done',
            visible: true
        });

    }

    function onGetTokens (tokens) {
        // Response: tokens = { token: <legacy token>, fuel2token: <fuel api token> }
        console.log("Tokens function: "+JSON.stringify(tokens));
        //authTokens = tokens;
    }

    function onGetEndpoints (endpoints) {
        // Response: endpoints = { restHost: <url> } i.e. "rest.s1.qa1.exacttarget.com"
        console.log("Get End Points function: "+JSON.stringify(endpoints));
    }

    function save() {

       /* var accountSid = $('#accountSID').val();
        var authToken = $('#authToken').val();
        var messagingService = $('#messagingService').val();
        var body = $('#messageBody').val();
        console.log("body",body);
        payload['arguments'].execute.inArguments = [{
            "accountSid": accountSid,
            "authToken": authToken,
            "messagingService": messagingService,
            "body": body,
            "to": "{{Contact.Attribute.TwilioV1.TwilioNumber}}" //<----This should map to your data extension name and phone number column
        }];

        payload['metaData'].isConfigured = true;

        console.log("Payload on SAVE function: "+JSON.stringify(payload));
        connection.trigger('updateActivity', payload);*/
        
// custom_activity.js - Custom Activity Boilerplate for Genesys-SFMC integration

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request-promise-native");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "frame-ancestors 'self' https://*.exacttarget.com https://*.marketingcloudapps.com"
  );
  res.setHeader("X-Frame-Options", "ALLOW-FROM https://*.exacttarget.com");
  next();
});

// Serve static files (like index.html)
app.use(express.static(path.join(__dirname, 'public')));

const GENESYS_AUTH_URL = "https://login.mec1.pure.cloud/oauth/token";
const GENESYS_CLIENT_ID = "a36298ab-fed3-428c-9d1f-86e99c982b63";
const GENESYS_CLIENT_SECRET = "tJL4zU-PQpV6BHI-owOChKzE5v8M9U0WkDRfbWcU0wY";
const GENESYS_MSG_URL = "https://api.mec1.pure.cloud/api/v2/flows/executions";

// Root route to confirm app is running and show access token
app.get("/", async (req, res) => {
  try {
    const authResponse = await request.post({
      url: GENESYS_AUTH_URL,
      form: {
        client_id: GENESYS_CLIENT_ID,
        client_secret: GENESYS_CLIENT_SECRET,
        grant_type: "client_credentials",
      },
      json: true,
    });

    const accessToken = authResponse.access_token;
    console.log("Auth token generated: ", accessToken);

    res.send(`
      <h2>SFMC Genesys Custom Activity server is running.</h2>
      <h3>Current Access Token:</h3>
      <pre>${accessToken}</pre>
    `);
  } catch (error) {
    console.error("Error generating auth token on root route:", error);
    res.send("SFMC Genesys server is running but failed to generate token.");
  }
});

// Serve config.json file
app.get("/config.json", (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.sendFile(path.join(__dirname, "config.json"));
});

// Custom Activity UI Endpoints (POST as required by SFMC Journey Builder)
app.post("/save", (req, res) => {
  console.log("Save request received");
  res.status(200).json({ message: "Save successful" });
});

app.post("/publish", (req, res) => {
  console.log("Publish request received");
  res.status(200).json({ message: "Publish successful" });
});

app.post("/validate", (req, res) => {
  console.log("Validate request received");
  res.status(200).json({ message: "Validation successful" });
});

app.get("/activity", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Execute activity endpoint
app.post("/execute", async (req, res) => {
  try {
    console.log("Execute request body:", req.body);

    const authResponse = await request.post({
      url: GENESYS_AUTH_URL,
      form: {
        client_id: GENESYS_CLIENT_ID,
        client_secret: GENESYS_CLIENT_SECRET,
        grant_type: "client_credentials",
      },
      json: true,
    });

    const accessToken = authResponse.access_token;
    console.log("Auth token for execution: ", accessToken);

    const inArgs = req.body.inArguments || [];

    const payload = {
      flowId: "770ea816-7ce7-4e44-ac49-b935fba7f268", // replace with correct flow ID
      inputData: {
        "Flow.responseId": inArgs.find(arg => arg.responseId)?.responseId || "default-response-id",
        "Flow.customerPhone": inArgs.find(arg => arg.to)?.to,
        "Flow.integrationId": "hardcoded-integration-id", // replace as needed
        "Flow.sessionId": inArgs.find(arg => arg.sessionId)?.sessionId || "sessionid",
        "Flow.key1": "key1",
        "Flow.value1": "value1",
        "Flow.key2": "key2",
        "Flow.value2": "value2",
        "Flow.key3": "key3",
        "Flow.value3": "value3",
        "Flow.key4": "key4",
        "Flow.value4": "value4",
        "Flow.key5": "key5",
        "Flow.value5": "value5"
      }
    };

    console.log("Final payload to Genesys:", JSON.stringify(payload, null, 2));

    const response = await request.post({
      url: GENESYS_MSG_URL,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log("Response from Genesys:", response);
    res.status(200).send("Success");
  } catch (err) {
    console.error("Error executing activity:", err.message || err);
    res.status(500).send("Failure");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

    }                    

});
