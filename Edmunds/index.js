const ApiBuilder = require('claudia-api-builder');

const api = new ApiBuilder();

api.get('/hello', function () {
    return 'hello world';
});

module.exports = api;
