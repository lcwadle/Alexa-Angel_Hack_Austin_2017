'use strict';
var Alexa = require('alexa-sdk');

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
        this.emit('GetRoom');
    },
    'GetRoomIntent' : function () {
        this.emit('GetRoom');
    },
    'MoveIntent': function () {
        this.emit('Move');
    },
    'GetRoom' : function () {
        // Get basic room description
        var speechOutput = "Beginning Room";

        this.emit(':tellWithCard', speechOutput, SKILL_NAME);
    },
    'Move': function () {
        var moveType = this.event.request.intent.slots.Movement.value;
        var speechOutput = 'Move ' + moveType;

        this.emit(':tellWithCard', speechOutput, SKILL_NAME);
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