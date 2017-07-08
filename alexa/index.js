'use strict';
var Alexa = require('alexa-sdk');
var http = require('http');

var APP_ID = undefined; //OPTIONAL: replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";
var SKILL_NAME = 'dungeon companion';

/**
 * Array containing space facts.
 */

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        var response = null;

        http.get('http://nodejs.org/dist/index.json', (res) => {
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
                    response = parsedData;
                } catch (e) {
                    response = e;
                }
            });
        }).on('error', (e) => {
            console.error(`Got error: ${e.message}`);
        });

        this.emit(':tellWithCard', response, SKILL_NAME);
    },
    'GetRoomIntent' : function () {
        this.emit('GetRoom');
    },
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
    'GetRoom' : function () {
        // Get basic room description
        var speechOutput = "Beginning Room";

        this.emit(':tellWithCard', speechOutput, SKILL_NAME);
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
};