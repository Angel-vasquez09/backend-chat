const { response } = require("express");

const webpush = require('../helpers/webpush');

// Notificar un nuevo mensaje a un usuario especifico
const newMessage = async(req, res = response) => {

    const { title, message, pushSubscription } = req.body;

    const payload = JSON.stringify({
        title  : title,
        message: message
    });
    
    try {
        await webpush.sendNotification(pushSubscription,payload);
    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    newMessage
}

