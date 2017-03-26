'use strict';

const restify = require('restify');
const builder = require('botbuilder');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
let server = restify.createServer();
const PORT = process.env.port || process.env.PORT || 3978;
const END_POINT = '/api/messages';

server.listen(PORT, function () {
    console.log('%s listening to http://localhost:%s', server.name, PORT); 
    console.log('Bot message end point: http://localhost:%s%s', PORT, END_POINT);
});
  
// Create chat bot
let connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
let bot = new builder.UniversalBot(connector);
server.post(END_POINT, connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

let FIRST_DIALOG = true;

bot.dialog('/', [
    function (session) {
        if (FIRST_DIALOG) {
            // Remove prompt image from last session
            session.userData.original = undefined;
        }
        builder.Prompts.choice(session, "Are you an organizer or a participant", "Organizer|Participant");
    },
    function (session, results) {
        let choice = results.response.index;
        if ( choice === 0 ) {
            session.beginDialog('/organizer');
        }
        else if ( choice === 1 ) {
            session.beginDialog('/participant');
        }
    }
]);

bot.dialog('/organizer', [
    function ( session ) {
        builder.Prompts.attachment (session, 'Please upload a photo with missing parts.');
    },
    function ( session, results ) {
        let image = results.response[0];
        // Save the image for participants
        session.userData.original = image;
        session.send('Participants can join the game now!');
        session.endDialog();

        // So that the prompt image doesn't get removed
        FIRST_DIALOG = false;
    }
]);

bot.dialog('/participant', [
    function (session) {
        if ( !session.userData.original ) {
            session.send('Ooops! The organizer hasn\'t set up the game yet!');
            session.endDialog();
        }
        else {
            // Show original (the prompt) photo
            let msg = new builder.Message(session).text("Prompt");
            msg.addAttachment(session.userData.original);
            bot.send(msg)
            builder.Prompts.attachment (session, 'Find it if you can! Send a photo when you do!');
        }
    },
    function ( session, results ) {
        // Get photo url's
        let image = results.response[0];
        let original = session.userData.original;

        // Compare photos
        compare_photos(image.contentUrl, original.contentUrl, session)
    }
]);

function compare_photos (img1, img2, session) {
    let spawn = require('child_process').spawn;
    let process = spawn('./env/bin/python', ['compare_image.py', img1, img2]);
    process.stdout.on('data', function (data){
        if ( Number(data.toString()) < 0.4 ) {
            // Not close enough 
            session.send('Please try again');
            session.endDialog();
            session.beginDialog('/participant');
        }
        else {
            session.send('You got it. Congratulations!');
            session.endDialog();
        }
    });
}
