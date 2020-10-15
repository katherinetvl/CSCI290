const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

//const accountSid = "";
//const authToken = "";

var enterAccountSid = process.argv[2];
var enterAuthToken = process.argv[3];

if (enterAccountSid && enterAuthToken)
{
    accountSid = enterAccountSid;
    authToken = enterAuthToken;

    const client = new twilio(accountSid, authToken);

    const MessagingResponse = require("twilio").twiml.MessagingResponse;

    let lastMessage = "";

    let app = express();

    app.use(bodyParser.urlencoded({extended:false}));

    // when incoming messages happen 
    app.post('/sms', function (request, response)
    {
        const twiml = new MessagingResponse();

        switch(request.body.Body.toLowerCase())
        {
            case 'last':
                twiml.message(lastMessage);
                break;
            default:
                lastMessage = request.body.Body;
                twiml.message("You have registered this message as the last message. Enter 'last' to see the previous message at any time.");
        }

        response.writeHead(200,{'Content-Type' : 'text/xml'});
        // console.log(twiml.toString());
        response.end(twiml.toString());
    });

    app.listen(8000);
}
else 
{
    console.log("Please enter Twilio account and password information in command line.");
    return 1;
}