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
    'MoveLeftIntent' : function () {
        this.emit('MoveLeft');
    },
    'MoveRightIntent': function () {
        this.emit('MoveRight');
    },
    'MoveStraightIntent': function () {
        this.emit('MoveStraight');
    },
    'MoveIntent': function () {
        this.emit('Move');
    },
    'GetRoom' : function () {
        // Get basic room description
        var speechOutput = "Beginning Room";

        this.emit(':tellWithCard', speechOutput, SKILL_NAME)
    },
    'MoveLeft' : function () {
        var speechOutput = "Left Room"
        this.emit(':tellWithCard', speechOutput, SKILL_NAME)
    },
    'MoveRight': function () {
        var speechOutput = "Right Room"
        this.emit(':tellWithCard', speechOutput, SKILL_NAME)
    },
    'MoveStraight': function () {
        var speechOutput = "Straight Room"
        this.emit(':tellWithCard', speechOutput, SKILL_NAME)
    },
    'Move': function () {
        var speechOutput = "Move"
        this.emit(':tellWithCard', speechOutput, SKILL_NAME)
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
    }
};