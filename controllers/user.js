
const { response } = require("express")
const Usuario = require("../models/usuario");
const bcryptjs = require("bcryptjs");
const fs = require('fs');
const path = require('path');

const usuariosRegistrados = async(req, res = response) => {
    
    const [total, usuarios] = await Promise.all([
        // Con este metodo resolvemos dos promesas de un solo tiroo
        // y es mas rapido que esperar que se ejecute una y luego la otra
        // Esta las ejecuta a las dos al tiempo
        Usuario.countDocuments({estado:true}),
        Usuario.find({estado: true})
    ])
    
    res.json({
        total,
        usuarios
    })
}

// OBTENER USUARIO POR ID
const usuarioId = async(req, res = response) => {
    
    const usuario = await Usuario.findById(req.params.id);

    try {
        if (usuario) {
            res.json({ 
                usuario
            })
        }
    } catch (error) {
        console.log(error);
    }

}


// VALIDAR CORREO
const validarCorreo = async(req, res = response) => {

    const {correo} = req.params;

    const usuario = await Usuario.find({correo: correo});

    if (usuario.length === 0) {
        return res.json({
            ok: true,
            mensaje: 'Correo valido no existe'
        })
    }else{
        return res.json({
            ok: false,
            mensaje: 'Correo ya existe'
        })
    }

}



const usuarioGet = async(req, res = response) => {

    const {limite = 10, desde = 0} = req.query;
    // Selecciona todos los datos, pero solo los que tengan el estado en true
    /* const usuarios = await Usuario.find({estado: true})
        .skip( Number(desde ))
        .limit(Number(limite)); */

    // Total de datos que tengo pero ingora los que tengan el estado en false
    //const total = await Usuario.countDocuments({estado:true});

    /* Creamos una promesa para ejecutar los dos await al tiempo y
    que las consultas demoren menos, nos ahorramos tiempo */

    const [total, usuarios] = await Promise.all([
        // Con este metodo resolvemos dos promesas de un solo tiroo
        // y es mas rapido que esperar que se ejecute una y luego la otra
        // Esta las ejecuta a las dos al tiempo
        Usuario.countDocuments({estado:true}),
        Usuario.find({estado: true})
            .skip( Number(desde ))
            .limit(Number(limite))
    ])
    
    res.json({
        total,
        usuarios
    })
}

const usuarioPut = async(req, res = response) => {

    const { id } = req.params;

    const {_id,password, google,correo, ...resto} = req.body;

    // Si existe la contrase??a quiere decir que el usuario la va a actualizar
    if (password) {
        // Actualizamos la contrase??a encryptandola nuevamente
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    // Actualizamos por medio del id
    const usuario = await Usuario.findOneAndUpdate(id, resto);

    res.json({
        usuario
    })
}

const usuarioPost = async(req, res) => {


    const {nombre,apellido, correo, password, rol, img} = req.body;

    // Creamos la intancia de nustra clase usuario
    const usuario = new Usuario({nombre, apellido,correo, password, rol, img});

    // Verificar si el correo existe en la base de datos
    /* */

    // Encriptar la contrase??a
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    // Guardamos los datos en la base de datos
    await usuario.save();

    res.json({
        usuario
    })
}



const usuarioDelete = async(req, res = response) => {

    const { id } = req.params;
    // No eliminamos el usuario solo le colocamos el estado en false
    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false})

    const usuarioAutent = req.usuario;

    res.json(usuario);
}


module.exports = {
    usuarioId,
    usuarioGet,
    usuarioPut,
    usuarioPost,
    usuarioDelete,
    usuariosRegistrados,
    validarCorreo

}