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
console.log("Execution flow 1");  

    function onRender() {
        console.log("Execution flow 2");  
        // JB will respond the first time 'ready' is called with 'initActivity'
        connection.trigger('ready');
        console.log("Execution flow 3");  
        connection.trigger('requestTokens');
        console.log("Execution flow 4");  
        connection.trigger('requestEndpoints');
        console.log("Execution flow 5"); 
    }
console.log("Execution flow 6"); 
  function initialize(data) {
       console.log("Initializing data data: "+ JSON.stringify(data));
      console.log("Execution flow 7"); 
        if (data) {
            console.log("Execution flow 8:"); 
            payload = data;
            console.log("Execution flow 9: ",payload); 
        }    
console.log("Execution flow 10"); 
        var hasInArguments = Boolean(
            payload['arguments'] &&
            payload['arguments'].execute &&
            payload['arguments'].execute.inArguments &&
            payload['arguments'].execute.inArguments.length > 0
         );
console.log("Execution flow 100"); 
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
        console.log("Execution flow 101");
        //authTokens = tokens;
    }

    function onGetEndpoints (endpoints) {
        // Response: endpoints = { restHost: <url> } i.e. "rest.s1.qa1.exacttarget.com"
        console.log("Get End Points function: "+JSON.stringify(endpoints));
    }

    function save() {

    
console.log("testing 1");    
var settings = {
  "url": "https://login.mec1.pure.cloud/oauth/token",
  "method": "POST",
  "timeout": 0,
  "headers": {
    "Content-Type": "application/x-www-form-urlencoded"
  },
  "data": {
    "grant_type": "client_credentials",
    "client_id": "a36298ab-fed3-428c-9d1f-86e99c982b63",
    "client_secret": "tJL4zU-PQpV6BHI-owOChKzE5v8M9U0WkDRfbWcU0wY"
  }
};
console.log("testing 2");
$.ajax(settings).done(function (response) {
  console.log('response:----',response);
    
    console.log('response1:----',response.access_token);
    var token = response.access_token;
var tokenType = response.token_type; // This should be "bearer" based on your previous message

// Create the proper authorization header
var authHeader = tokenType + " " + token; // This will be "bearer YOUR_TOKEN_VALUE"
console.log('authHeader:----',authHeader);
var setting = {
  "url": "https://api.mec1.pure.cloud/api/v2/flows/executions",
  "method": "POST",
  "timeout": 0,
  "headers": {
    "Content-Type": "application/json",
    "Authorization": authHeader  // Use the properly formatted auth header
  },
  "data": JSON.stringify({
    "flowId": "770ea816-7ce7-4e44-ac49-b935fba7f268",
    "inputData": {
      "Flow.responseId": "6339aaa3-6279-462d-8be4-d428ff251ba9",
      "Flow.customerPhone": "919352221400",
      "Flow.integrationId": "933eb6ae-5a55-4d0d-b036-41356101e7aa",
      "Flow.sessionId": "APIEvent-e890190d-a263-bc1c-90b8-ba15d169bb8f",
        "Flow.ContactId":"SU00077",
      "Flow.key1": "1",
      "Flow.value1": "GenesysPOC",
      "Flow.key2": "",
      "Flow.value2": "",
      "Flow.key3": "",
      "Flow.value3": "",
      "Flow.key4": "",
      "Flow.value4": "",
      "Flow.key5": "",
      "Flow.value5": ""
    }
  }),
};

console.log("testing 8");  
$.ajax(setting).done(function (response) {
  console.log("API call successful:", response);
    connection.trigger('updateActivity', payload)
}).fail(function(jqXHR, textStatus, errorThrown) {
  console.error("API call failed:", textStatus, errorThrown);
});
      
  
});
     
      console.log("testing 3");  

        
    }     
});               


