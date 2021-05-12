const { response } = require("express");

const Chat = require("../models/chat");

const obtenerChat = async(req, res = response) => {

    const miId = req.user.id; // Quien enviara el mensaje
    const mensajeDe = req.params.de; // aquien le enviaremos el msj

    const lastMsj = await Chat.find({
        $or: [{de: miId, para: mensajeDe},{ de: mensajeDe, para: miId}]
    })
    .sort({createdAt: 'asc'});
    /* .limit(40); */


    res.json({
        ok: true,
        mensajes: lastMsj
    })
}

module.exports = {
    obtenerChat
}