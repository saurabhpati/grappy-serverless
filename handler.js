'use strict';

// Close dialog with the customer, reporting fulfillmentState of Failed or Fulfilled ("Thanks, your pizza will arrive in 20 minutes")
function close(sessionAttributes, fulfillmentState, message) {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'Close',
            fulfillmentState,
            message,
        },
    };
}

function getCard(sessionAttributes, fulfillmentState, message) {
    return {
        "sessionAttributes": sessionAttributes,
        "dialogAction": {
            "type": "ElicitSlot",
            "message": {
                "contentType": "PlainText",
                "content": "Okay, here we go. Which animal do you see?"
            },
            "intentName": "VirtualPlayCardIntent",
            "slots": {
                "Animal": ""
            },
            "slotToElicit": "Animal",
            "responseCard": {
                "version": 1,
                "contentType": "application/vnd.amazonaws.card.generic",
                "genericAttachments": [
                    {
                        "title": "What do you see?",
                        "subTitle": "Which animal do yo see in the picture?",
                        "imageUrl": "https://placeimg.com/220/220/animals",
                        "buttons": [{
                            "text": "Dog",
                            "value": "Dog"
                        }, {
                            "text": "Cat",
                            "value": "Cat"
                        }, {
                            "text": "Bird",
                            "value": "Bird"
                        }, {
                            "text": "None",
                            "value": "None"
                        }]
                    }
                ]
            }
        }
    }
}

// --------------- Events -----------------------

function dispatch(request, callback) {
    console.log(`request received for userId=${request.userId}, intentName=${request.currentIntent.name}`);
    const { currentIntent: { slots }, sessionAttributes } = request;
    
    if (slots) {
        const { canStart } = slots;

        if (canStart === 'Yes' || canStart === 'y' || canStart === 'yes') {
            // callback(close(
                //sessionAttributes, 
                // 'Fulfilled', 
                // { 
                    // 'contentType': 'SSML', 
                    // 'content': `<speak>Okay. Here we go.</speak>` 
                // }));
                callback(getCard(
                    sessionAttributes,
                    'Fulfilled',
                    {
                        'contentType': 'PlainText',
                        'content': `Okay. Here we go, What do you see here?`
                    }));
        } else {
            callback(close(
                sessionAttributes, 
                'Fulfilled', 
                { 
                    'contentType': 'SSML', 
                    'content': `<speak>Okay. Maybe some other time then.</speak>` 
                }));
        }
    }
    
    callback(close(
            sessionAttributes, 
            'Fulfilled', 
            { 
                'contentType': 'SSML', 
                'content': `<speak>Alright as you wish.</speak>` 
            }));
}

// --------------- Main handler -----------------------

// Route the incoming request based on intent.
// The JSON body of the request is provided in the event slot.
exports.handler = (event, context, callback) => {
    try {
        dispatch(event,
            (response) => {
                callback(null, response);
            });
    } catch (err) {
        callback(err);
    }
};