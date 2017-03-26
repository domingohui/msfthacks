var restify = require('restify');
var builder = require('botbuilder');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
const PORT = process.env.port || process.env.PORT || 3978;
const END_POINT = '/api/messages';

server.listen(PORT, function () {
    console.log('%s listening to http://localhost:%s', server.name, PORT); 
    console.log('Bot message end point: http://localhost:%s%s', PORT, END_POINT);
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post(END_POINT, connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', 
    function (session) {
    }
);
