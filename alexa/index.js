'use strict';
var Alexa = require('alexa-sdk');
var http = require('http');
var request = require('request');

var APP_ID = undefined; //OPTIONAL: replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";
var SKILL_NAME = 'dungeon companion';

var states = {        
    INTERACTMODE: '_INTERACTMODE',          // Asks user what action should be taken
    OUTPUTMODE: '_OUTPUTMODE'               // Describes effect of action taken
};

// This is the intial welcome message
var welcomeMessage = "Welcome to Dungeon Companion, are you ready to play?";

// This is the message that is repeated if the response to the initial welcome message is not heard
var repeatWelcomeMessage = "Say yes to start the game or no to quit.";

// this is the help message during the setup at the beginning of the game
var helpMessage = "I will ask you some questions that will identify what you should eat. Want to start now?";

// this is the message that is repeated if Alexa does not hear/understand the reponse to the welcome message
var promptToStartMessage = "Say yes to continue, or no to end the game.";

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(newSessionHandler, interactGameHandlers);
    alexa.execute();
};

// set state to start up and  welcome the user
var newSessionHandler = {
    'LaunchRequest': function () {
        request.post(
            'http://angelhack-10-dungeon-companion.mybluemix.net/api/playersessions/sayhi',
            { json: { userID: this.event.session.user.userId } },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(body)
                }
            }
        );
        this.emit(':ask', welcomeMessage, repeatWelcomeMessage); 
    },
    "YesIntent" : function () {
        this.handler.state = states.INTERACTMODE;
        this.emit(':ask', "What would you like to do?");
    },
    "NoIntent" : function () {
        this.emit(':tell', "Goodbye");
    },
    'Unhandled': function () {
        this.emit(':ask', promptToStartMessage, promptToStartMessage);
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', helpMessage, helpMessage);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'Goodbye!');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', 'Goodbye!');
    }
};

var interactGameHandlers = Alexa.CreateStateHandler(states.INTERACTMODE, {
    'GetRoomIntent' : function () {
        //this.emit(':ask', "We are here");
        var response = null;
        http.get('http://angelhack-10-dungeon-companion.mybluemix.net/api/rooms', (res) => {
            const { statusCode } = res;
            const contentType = res.headers['content-type'];

            let error;
            if (statusCode !== 200) {
                error = new Error('Request Failed.\n' +
                                  `Status Code: ${statusCode}`);
            } else if (!/^application\/json/.test(contentType)) {
                error = new Error('Invalid content-type.\n' +
                                  `Expected application/json but received ${contentType}`);
            }
            if (error) {
                console.error(error.message);
                // consume response data to free up memory
                res.resume();
                return;
            }

            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', (chunk) => { rawData += chunk; });
            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(rawData);
                    var description = "You enter a room.  " + parsedData[0]['description'];
                    this.emit(':ask', description, SKILL_NAME);
                } catch (e) {
                    response = e.message;
                }
            });
        }).on('error', (e) => {
            console.error(`Got error: ${e.message}`);
        });
        
    },
    'MoveIntent': function () {
        var moveType = this.event.request.intent.slots.Movement.value;

        if (moveType == null) {
            var speechOutput = "I cannot understand";

            this.emit(':ask', speechOutput, SKILL_NAME);
        }
        else {
            var speechOutput = 'You move ' + moveType;

            this.emit(':ask', speechOutput, SKILL_NAME);
        }
    },
    'PickUpIntent' : function () {
        var interactType = this.event.request.intent.slots.Item.value;

        if (interactType == null) {
            var speechOutput = "I cannot understand";

            this.emit(':ask', speechOutput, SKILL_NAME);
        }
        else {
            var speechOutput = 'You pick up the ' + interactType;

            this.emit(':ask', speechOutput, SKILL_NAME);
        }
    },
    'TouchIntent': function () {
        var interactType = this.event.request.intent.slots.Item.value;

        if (interactType == null) {
            var speechOutput = "I cannot understand";

            this.emit(':ask', speechOutput, SKILL_NAME);
        }
        else {
            var speechOutput = 'You touched the ' + interactType;

            this.emit(':ask', speechOutput, SKILL_NAME);
        }
    },
    'DropIntent': function () {
        var interactType = this.event.request.intent.slots.Item.value;

        if (interactType == null) {
            var speechOutput = "I cannot understand";

            this.emit(':ask', speechOutput, SKILL_NAME);
        }
        else {
            var speechOutput = 'You drop the ' + interactType;

            this.emit(':ask', speechOutput, SKILL_NAME);
        }
    },
    'LookAtIntent': function () {
        var interactType = this.event.request.intent.slots.Item.value;

        if (interactType == null) {
            var speechOutput = "I cannot understand";

            this.emit(':ask', speechOutput, SKILL_NAME);
        }
        else {
            var speechOutput = 'You looked at the ' + interactType;

            this.emit(':ask', speechOutput, SKILL_NAME);
        }
    },
    'OpenIntent': function () {
        var interactType = this.event.request.intent.slots.Item.value;

        if (interactType == null) {
            var speechOutput = "I cannot understand";

            this.emit(':ask', speechOutput, SKILL_NAME);
        }
        else {
            var speechOutput = 'You open the ' + interactType;

            this.emit(':ask', speechOutput, SKILL_NAME);
        }
    },
    'Unhandled': function () {
        this.emit(':ask', promptToStartMessage, promptToStartMessage);
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', helpMessage, helpMessage);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'Goodbye!');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', 'Goodbye!');
    }
});