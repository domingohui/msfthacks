var restify = require('restify');
var builder = require('botbuilder');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
const PORT = process.env.port || process.env.PORT || 3978;
server.listen(PORT, function () {
    console.log('%s listening to http://localhost:%s', server.name, PORT); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', 
    function (session, args, next) {
        if ( !session.user_data.name) {
            session.beginDiaglo('/profile');
        }
        else {
            // Has user name
            session.send("Hello " + session.user_data.name);
        }
    }
);

bot.dialog('/profile',
    function (session) {
        builder.Prompts.text(session, "What is your name?");
    },
    function (session, results) {
        session.user_data.name = results.response;
        session.endDialog();
    }
);
