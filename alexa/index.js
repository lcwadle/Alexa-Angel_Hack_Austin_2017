'use strict';
var Alexa = require('alexa-sdk');
var http = require('http');
var request = require('request');
var _lodash = require('lodash');

var APP_ID = undefined;
var SKILL_NAME = 'dungeon companion';

var states = {        
    INTERACTMODE: '_INTERACTMODE', 
    OUTPUTMODE: '_OUTPUTMODE'               
};

var welcomeMessage = "Welcome to Dungeon Companion, are you ready to play?";

var repeatWelcomeMessage = "Say yes to start the game or no to quit.";

var helpMessage = "I will ask you some questions that will identify what you should eat. Want to start now?";

var promptToStartMessage = "Say yes to continue, or no to end the game.";

var session = null;


// var setSessionObject = function(session){
//     sessionObj = _lodash.clone(session);
// }

// var getSessionObject = function() {
//     return sessionObj;
// }

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(newSessionHandler, interactGameHandlers);
    alexa.execute();
};

var newSessionHandler = {
    'LaunchRequest': function () {
        var self = this;
        request.post(
            'http://angelhack-10-dungeon-companion.mybluemix.net/api/playersessions/greet',
            { json: { userID: this.event.session.user.userId } },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {

                }
                session = _lodash.clone(body.data[0]);
                self.emit(':ask', welcomeMessage, repeatWelcomeMessage);
                //self.emit(':ask', session.currentRoom.description); 
            }
        );
        //this.emit(':ask', welcomeMessage, repeatWelcomeMessage); 
    },
    "YesIntent" : function () {
        this.handler.state = states.INTERACTMODE;

        var message = "  What would you like to do?";

        this.emit(':ask', message);
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
            var response = null;
            var link = "http://angelhack-10-dungeon-companion.mybluemix.net/api/rooms/" + session.currentRoom.roomId;

            http.get(link, (res) => {
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
                    res.resume();
                    return;
                }

                res.setEncoding('utf8');
                let rawData = '';
                res.on('data', (chunk) => { rawData += chunk; });
                res.on('end', () => {
                    try {
                        const parsedData = JSON.parse(rawData);
                        session.currentRoom = _lodash.clone(parsedData);

                        var description = "You enter a room.  " + session.currentRoom.description;
                        this.emit(':ask', description, SKILL_NAME);
                    } catch (e) {
                        response = e.message;
                    }
                });
            }).on('error', (e) => {
                console.error(`Got error: ${e.message}`);
            });
        }
    },
    'PickUpIntent' : function () {
        var interactType = this.event.request.intent.slots.Item.value;

        if (interactType == null) {
            var speechOutput = "I cannot understand";

            this.emit(':ask', speechOutput, SKILL_NAME);
        }
        else {
            this.emit(':ask', session.currentRoom.hasBarrel)
            var speechOutput = 'You pick up the ' + interactType;

            //this.emit(':ask', speechOutput, SKILL_NAME);
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
        else if (interactType == "barrel" && session.hasBarrel) {
            var speechOutput = 'You have already opened the ' + interactType + ' what would you like to do?';

            this.emit(':ask', speechOutput, SKILL_NAME);
        }
        else if (interactType == "barrel" && session.currentRoom.hasBarrel) {
            var speechOutput = 'You open the ' + interactType + ' you received a key.  What would you like to do next?';

            session.currentRoom.hasBarrel = false;
            session.hasBarrel = true;

            this.emit(':ask', speechOutput, SKILL_NAME);
        }
        else {
            this.emit(':ask', "Invalid option, try again.", SKILL_NAME);
        }
    },
    'Unhandled': function () {
        this.emit(':ask', "I cannot understand, what would you like to do?");
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