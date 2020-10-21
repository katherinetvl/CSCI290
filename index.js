const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const e = require('express');

//const accountSid = "";
//const authToken = "";

let enterAccountSid = process.argv[2];
let enterAuthToken = process.argv[3];

if (enterAccountSid && enterAuthToken)
{
    accountSid = enterAccountSid;
    authToken = enterAuthToken;

    const client = new twilio(accountSid, authToken);

    const MessagingResponse = require("twilio").twiml.MessagingResponse;

    let idArr = [];
    let noGamesArr = [];

    let app = express();

    app.use(bodyParser.urlencoded({extended:false}));
 
    app.post('/sms', function (request, response)
    {
        const twiml = new MessagingResponse();
        console.log(request.body); 
        var idUser = request.body.From;
        var idIndex = idArr.indexOf(idUser);
        if(idIndex < 0)
        {
            idArr.push(idUser);
            noGamesArr.push(0); 
        }
        twiml.message("Hello! Would you like to start a new game? (yes or no)");
        
        switch(request.body.Body.toLowerCase())
        {
            case 'yes' :
            twiml.message("Guess a number between 1 and 1000");
            console.log(request.body); 

            let randomNumber = Math.floor(Math.random() * 11);
            let userGuess = request.body.Body;
            if (userGuess == randomNumber)
            {
                console.log(request.body); 
                twiml.message("Way to go! You win! The number was " + randomNumber);
                var gamesPlayed = noGamesArr[idIndex];
                noGamesarr[idIndex] = gamesPlayed++; 
                twiml.message("Your number of games played: " + noGamesArr[gamesPlayed]);
            } 
            else if (userGuess < randomNumber)
            {
                var gamesPlayed = noGamesArr[idIndex];
                noGamesarr[idIndex] = gamesPlayed++; 
                twiml.message("Sorry, your guess is too low.");
                twiml.message("Your number of games played: " + noGamesArr[gamesPlayed]);
            }
            else
            {
                var gamesPlayed = noGamesArr[idIndex];
                noGamesarr[idIndex] = gamesPlayed++; 
                twiml.message("Sorry, your guess is too high!");
                twiml.message("Your number of games played: " + noGamesArr[gamesPlayed]);
            }
            break;

            case 'no': 
            twiml.message("Message back when you want to play!");
            break;

            default:
            twiml.messsage("Invalid response.");
            break;
        }  
        response.writeHead(200,{'Content-Type' : 'text/xml'});
        response.end(twiml.toString());
    });

    // when incoming messages happen 
    /*
    app.post('/sms', function (request, response)
    {
        const twiml = new MessagingResponse();

        // start game 
        let randomNumber = rand(0,1000);
        let n = request.body.Body;
        switch(n)
        {
            case 'last':
                twiml.message(lastMessage);
                break;
            default:
                lastMessage = request.body.Body;
                twiml.message("Take a guess!");
        }

        response.writeHead(200,{'Content-Type' : 'text/xml'});
        // console.log(twiml.toString());
        response.end(twiml.toString());
    });

    */
    app.listen(8000);

}
else 
{
    console.log("Please enter Twilio account and password information in command line.");
    return 1;
}