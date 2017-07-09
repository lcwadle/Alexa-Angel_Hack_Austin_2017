'use strict';
var Alexa = require('alexa-sdk');
var http = require('http');

var APP_ID = undefined; //OPTIONAL: replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";
var SKILL_NAME = 'dungeon companion';

var states = {
    DESCRIBEMODE: '_DESCRIBEMODE',          // Describes the current room to the user
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
    alexa.registerHandlers(newSessionHandler, startGameHandlers);
    alexa.execute();
};

// set state to start up and  welcome the user
var newSessionHandler = {
    'LaunchRequest': function () {
        this.handler.state = states.DESCRIBEMODE;
        this.emit(':ask', welcomeMessage, repeatWelcomeMessage);
    },
    'AMAZON.HelpIntent': function () {
        this.handler.state = states.STARTMODE;
        this.emit(':ask', helpMessage, helpMessage);
    },
    'Unhandled': function () {
        this.handler.state = states.STARTMODE;
        this.emit(':ask', promptToStartMessage, promptToStartMessage);
    }
};

var startGameHandlers = Alexa.CreateStateHandler(states.DESCRIBEMODE, {
    'GetRoomIntent' : function () {
        this.handler.state = states.INTERACTMODE;
        this.emit('GetRoom');
        
    },
    'GetRoom' : function () {
        var response = null;
                https.get('https://angelhack-10-dungeon-companion.mybluemix.net/api/rooms', (res) => {
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
                    var description = parsedData[0]['description'];
                    this.emit(':tellWithCard', description, SKILL_NAME);
                } catch (e) {
                    response = e.message;
                }
            });
        }).on('error', (e) => {
            console.error(`Got error: ${e.message}`);
        });
        
    },
    'AMAZON.HelpIntent': function () {
        this.handler.state = states.STARTMODE;
        this.emit(':ask', helpMessage, helpMessage);
    },
    'Unhandled': function () {
        this.handler.state = states.STARTMODE;
        this.emit(':ask', promptToStartMessage, promptToStartMessage);
    }
});

var interactGameHandlers = Alexa.CreateStateHandler(states.INTERACTMODE, {
    'MoveIntent': function () {
        this.emit('move');
    },
    'PickUpIntent' : function () {
        this.emit('pickUp');
    },
    'TouchIntent': function () {
        this.emit('touch');
    },
    'DropIntent': function () {
        this.emit('drop');
    },
    'LookAtIntent': function () {
        this.emit('lookAt');
    },
    'OpenIntent': function () {
        this.emit('open');
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', helpMessage, helpMessage);
    },
    'Unhandled': function () {
        this.emit(':ask', promptToStartMessage, promptToStartMessage);
    },
    'move': function () {
        var moveType = this.event.request.intent.slots.Movement.value;

        if (moveType == null) {
            var speechOutput = "I cannot understand";

            this.emit(':tellWithCard', speechOutput, SKILL_NAME);
        }
        else {
            var speechOutput = 'Move ' + moveType;

            this.emit(':tellWithCard', speechOutput, SKILL_NAME);
        }
        shouldEndSession = false;
    },
    'pickUp' : function () {
        var interactType = this.event.request.intent.slots.Interaction.value;

        if (interactType == null) {
            var speechOutput = "I cannot understand";

            this.emit(':tellWithCard', speechOutput, SKILL_NAME);
        }
        else {
            var speechOutput = 'Picked up ' + interactType;

            this.emit(':tellWithCard', speechOutput, SKILL_NAME);
        }
    },
    'touch': function () {
        var interactType = this.event.request.intent.slots.Interaction.value;

        if (interactType == null) {
            var speechOutput = "I cannot understand";

            this.emit(':tellWithCard', speechOutput, SKILL_NAME);
        }
        else {
            var speechOutput = 'Touched ' + interactType;

            this.emit(':tellWithCard', speechOutput, SKILL_NAME);
        }
    },
    'drop': function () {
        var interactType = this.event.request.intent.slots.Interaction.value;

        if (interactType == null) {
            var speechOutput = "I cannot understand";

            this.emit(':tellWithCard', speechOutput, SKILL_NAME);
        }
        else {
            var speechOutput = 'Dropped ' + interactType;

            this.emit(':tellWithCard', speechOutput, SKILL_NAME);
        }
    },
    'lookAt': function () {
        var interactType = this.event.request.intent.slots.Interaction.value;

        if (interactType == null) {
            var speechOutput = "I cannot understand";

            this.emit(':tellWithCard', speechOutput, SKILL_NAME);
        }
        else {
            var speechOutput = 'Looked at ' + interactType;

            this.emit(':tellWithCard', speechOutput, SKILL_NAME);
        }
    },
    'open': function () {
        var interactType = this.event.request.intent.slots.Interaction.value;

        if (interactType == null) {
            var speechOutput = "I cannot understand";

            this.emit(':tellWithCard', speechOutput, SKILL_NAME);
        }
        else {
            var speechOutput = 'Opened ' + interactType;

            this.emit(':tellWithCard', speechOutput, SKILL_NAME);
        }
    },
    'AMAZON.HelpIntent': function () {
        var speechOutput = "You can say move left or move right, or, you can say exit... What can I help you with?";
        var reprompt = "What can I help you with?";
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'Goodbye!');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', 'Goodbye!');
    },
    'Unhandled': function () {
        this.emit(':tell', "Error");
    }
});