const botBuilder = require('claudia-bot-builder');

module.exports = botBuilder(function(message) {
    console.log(JSON.stringify(message));
    return `${message.text} to you too`;
}, { platforms: ['twilio'] });