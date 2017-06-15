const AWS = require('aws-sdk');
const botBuilder = require('claudia-bot-builder');
const shortid = require('shortid');
const fetch = require('node-fetch');
const twilio = require('twilio');
const mime = require('mime-types');
const jimp = require('jimp');
const stream = require('stream');

const env = process.env;

AWS.config.update = {
    accessKeyId: env.AccessKeyId,
    secretAccessKey: env.SecretAccessKey,
    region: 'us-east-1'
};

const s3Stream = require('s3-upload-stream')(new AWS.S3({
    accessKeyId: env.AccessKeyId,
    secretAccessKey: env.SecretAccessKey,
    region: 'us-east-1'
}));

const uploadS3 = (buffer, ext) => new Promise((resolve, reject) => {

    const imageName = `${shortid.generate()}.${ext}`;

    const upload = s3Stream.upload({
        Bucket: 'epigopolis',
        Key: imageName,
        ACL: 'public-read-write'
    });

    upload.on('error', function(err) {
        reject(err);
    });

    // Handle upload completion.
    upload.on('uploaded', function(result) {
        resolve(imageName);
    });

    const bufStream = new stream.PassThrough();
    bufStream.end(buffer);
    bufStream.pipe(upload);

});

const sendSMS = (phone, message, imageName) => new Promise((resolve, reject) => {
    // Twilio Credentials 
    const accountSid = env.TwilioAccountSid;
    const authToken = env.TwilioAuthToken;

    // require the Twilio module and create a REST client 
    const client = twilio(accountSid, authToken);

    client.messages.create({
        to: phone,
        from: '+18609474670',
        body: message,
    }, function(err, msg) {
        if (err) {
            reject(err);
        }
        console.log(`Message sent: ${msg.sid}`);
        resolve(imageName);
    });
});

const resizeImage = jimpImage => new Promise((resolve, reject) => {

    jimpImage.resize(400, jimp.AUTO)
        .quality(60)
        .getBuffer(jimp.MIME_JPEG, function(err, buffer) {
            if (err) {
                reject(err);
            }
            console.log('resized image');
            resolve(buffer);
        });
});

const sendToLex = (phoneNumber, message) => new Promise((resolve, reject) => {

    const lexruntime = new AWS.LexRuntime({
        accessKeyId: env.AccessKeyId,
        secretAccessKey: env.SecretAccessKey,
        region: 'us-east-1'
    });

    const params = {
        botAlias: 'Prod',
        botName: 'epigopolis',
        inputText: message,
        userId: phoneNumber.replace('+', '')
            // sessionAttributes: {
            //     '<String>': 'STRING_VALUE',
            //     /* '<String>': ... */
            // }
    };

    lexruntime.postText(params, function(err, data) {
        if (err) {
            console.log(err, err.stack);
            reject(`${err}`);
        } else {
            resolve(data);
        }
    });

});

const formatResponse = function(predictionData) {

    // TODO - should also be able to tell if it is NOT a car and what part of the car
    // also do we need to provide a disclaimer that anything we return is not competely legit? Like if the user sends a picture of someone else's car etc. how would we know.

    const damaged = parseFloat(predictionData.frontdamaged);
    const notdamaged = parseFloat(predictionData.frontok);

    if (damaged > notdamaged) {
        return 'Based on the image you provided it looks like there might be severe damage to your vehicle.';
    }

    return 'Based on the image you provided it appears that the damage to your vehicle is probably minor.';
};


// https://benmccormick.org/2015/12/30/es6-patterns-converting-callbacks-to-promises/
// https://gist.github.com/schempy/87567e11633f8ef11c8e

const bot = botBuilder(function(message) {

    // const bot = function(message) {

    console.log(JSON.stringify(message));

    const imageExt = mime.extension(message.originalRequest.MediaContentType0);

    const phoneNumber = message.originalRequest.From;

    if (message.originalRequest.MediaUrl0) {

        console.log('processing image');

        return sendSMS(phoneNumber, 'Letting you know I just received your image and should have something to tell you shortly... ')
            .then(function() {
                // return fetch(message.originalRequest.MediaUrl0);
                return jimp.read(message.originalRequest.MediaUrl0);
                // }).then(function(res) {
                //     return streamToBuffer(res.body);
            }).then(function(img) {
                return resizeImage(img);
            }).then(function(buf) {
                console.log('upload to s3');
                return uploadS3(buf, imageExt);
                // }).then(function(imageName) {
                //     console.log('uploaded image to s3:', JSON.stringify(imageName));
                //     return sendSMS(phoneNumber, 'I am now checking out the damage to your vehicle based on the image you provided...', imageName);
            }).then(function(imageName) {
                // sleep to make sure texts show up in order
                console.log('retrieving prediction');
                return fetch(`${env.TFEndpoint}/${imageName}`).then(function(res) {
                    return res.json();
                }).then(function(json) {
                    console.log(JSON.stringify(json));
                    return formatResponse(json);
                });
            }).then(function(prediction) {
                console.log('sending final prediction');
                return sendSMS(phoneNumber, prediction);
            }).catch(function(error) {
                console.log(error);
                sendSMS(phoneNumber, 'Oops - an error occurrred attempting to process your image. Could you try sending that again?');
            });
    } else {
        // return sendToLex(phoneNumber, message.text);
        return sendToLex(phoneNumber, message.text).then(function(response) {
            console.log(response);
            return response;
        });
    }
    // } else if (message.text.match(/quote/i)) {
    //     return fetch('http://api.forismatic.com/api/1.0/?method=getQuote&format=text&lang=en').then(function(res) {
    //         return res.text();
    //     });

    // }
    // return greeting.random();

}, { platforms: ['twilio'] });

module.exports = bot;