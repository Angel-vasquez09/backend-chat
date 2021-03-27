const { response } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');


const validarToken = async(req,res = response,next) => {

    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: "No enviaron ningun token"
        })
    }

    try {
        
        // verificamos si es un token valido
        const { uid } = jwt.verify(token,process.env.SECRETOPRIVATEKEY);

        // Verificamos si el id esta en la base de datos
        const usuario = await Usuario.findById(uid);

        // Verificamos si el usuario existe
        if (!usuario) {
            return res.status(401).json({
                msg: "El token no es valido - el usuario no existe en la base de datos"
            })
        }

        // verificamos si el usuario se encuentra activo o no
        if (!usuario.estado) {
            return res.status(401).json({
                msg: "El token no es valido - el usuario tiene el estado en falso"
            })
        }

        // Si el token es valido guardamos los datos del usuario
        req.usuario = usuario;

        next();

    } catch (error) {

        console.log(error);
        res.status(401).json({
            msg: "Token no valido"
        })
        
    }


}

module.exports = {
    validarToken
}