const webPush = require('web-push');

webPush.setVapidDetails(
    'mailto:vasquez092020@outlook.es',
    process.env.PUBLIC_PUSH_KEY,
    process.env.PRIVATE_PUSH_KEY,
);


module.exports = webPush;