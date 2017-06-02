const botBuilder = require('claudia-bot-builder');

const bot = botBuilder(function(message) {
    const response = `Thanks for sending '${message.text}'... your message is very important to us but something happened ...`;
    console.log(response);
    return response;
});

module.exports = bot;