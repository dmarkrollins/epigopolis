const bot = require('./index');

const msg = {};
msg.originalRequest = {};
const goodCar = 'https://s-media-cache-ak0.pinimg.com/736x/fa/09/e4/fa09e43390526e90af18f9aadfa1cbc2.jpg';
const badCar = 'http://edenprairieweblogs.org/html/blogimages/The%20Crash%202.jpg';
// msg.originalRequest.MediaUrl0 = 'http://api.twilio.com/2010-04-01/Accounts/ACafb3aab8c37d6a101e027d3cd49bdba8/Messages/MMff674a1b376cf09bd7275e8024a06975/Media/MEed065ec3af554f26bce71ee07ec45697';
// msg.originalRequest.MediaUrl0 = goodCar;
// msg.originalRequest.MediaContentType0 = 'image/jpeg';
msg.originalRequest.From = '+18608361141';
msg.text = 'Hi';
// msg.originalRequest.To = '+18608361141';

bot(msg);