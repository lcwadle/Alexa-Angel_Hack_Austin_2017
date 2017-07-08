'use strict';
var Alexa = require('alexa-sdk');

var APP_ID = undefined; //OPTIONAL: replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";
var SKILL_NAME = 'Bacon Facts';

/**
 * Array containing space facts.
 */
var FACTS = [
    "September third is International Bacon Day.",
    "Each year in America, one point seven billion pounds of bacon are consumed in food service. That is the equivalent of eight point five nimitz class aircraft carriers.",
    "Sixty nine percent of all food service operators serve bacon.",
    "Bacon is one of the oldest processed meats in history. The Chinese began salting prok bellies as early as fifteen hundred B.C..",
    "Pregnant women should eat bacon. Choline, which is found in bacon, helps fetal brain development.",
    "Bacon appeals to males slightly more than females.",
    "Bacon is consumed at breakfast an average of twelve times per person per year.",
    "A 250 pound pig yields about twenty three pounds of bacon.",
    "People over the age of thirty four make up most bacon consumption.",
    "More than half of all homes keep bacon in their fridge at all times.",
    "Bacon is made from the side and back cuts pork meat. The taste and flavor of the meat is generally better.",
    "Most salable bacon flavored products are bacon toothpaste, bacon peanut brittle, bacon dental floss, bacon popcorn, bacon vodka, bacon mints, etc.",
    "Sometimes turkey bacon is also used as a replacement of real bacon. They are generally healthier than the regular bacon.",
    "Some critics believe that few manufacturers don’t have a good pig farming process as they doubt they mistreat the pigs during the farming process which can hugely impact the nutritional components of the meat.",
    "Bacon is addictive. It contains six types of umami, which produces an addictive neurochemical response."
    
];

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit('GetFact');
    },
    'GetNewFactIntent': function () {
        this.emit('GetFact');
    },
    'GetFact': function () {
        // Get a random space fact from the space facts list
        var factIndex = Math.floor(Math.random() * FACTS.length);
        var randomFact = FACTS[factIndex];

        // Create speech output
        var speechOutput = "Here's your fact: " + randomFact;

        this.emit(':tellWithCard', speechOutput, SKILL_NAME, randomFact)
    },
    'AMAZON.HelpIntent': function () {
        var speechOutput = "You can say tell me a bacon fact, or, you can say exit... What can I help you with?";
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