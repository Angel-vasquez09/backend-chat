const { response } = require("express");
const bcryptjs = require('bcryptjs');
const Usuario = require("../models/usuario");
const { generarToken } = require("../helpers/generar-token");
const { googleVerifu } = require("../helpers/db-google-verify");






const loginUsuario = async(req, res = response) => {

    const {correo, password} = req.body;

    try {

        // Verificar si el correo existe
        const usuario = await Usuario.findOne({correo});

        if (!usuario) {
            return res.status(400).json({
                msg: "Correo / password son incorrectos - correo"
            })
        }
        
        // Verificar si el usuario esta activo en la base de datos
        if (!usuario.estado) {
            return res.status(400).json({
                msg: "Correo / password son incorrectos - estado"
            })
        }

        // Verificar la contraseña
        const veriPass = bcryptjs.compareSync(password, usuario.password);

        if (!veriPass) {
            return res.status(400).json({
                msg: "Correo / password son incorrectos - password"
            })
        }

        // Generar el JWT

        const token = await generarToken(usuario.id);



        res.json({
            usuario,
            token
        })
        
    } catch (error) {
        return res.status(500).json({
            msg: error
        })
    }


}


const googleSignin = async(req, res = response) => {

    const { id_token } = req.body;

    console.log(id_token);
    const { correo, nombre, img ,apellido} = await googleVerifu(id_token);
    console.log('correo', correo)
    console.log('nombre', nombre)
    console.log('img', img)

    try {
        
        // Funcion para verificar que la cuanta de google sea correcta

        let usuario = await Usuario.findOne({correo});

        if (!usuario) {
            
            const data = {
                nombre,
                correo,
                apellido,
                img,
                password: ':p',
                google: true
            }

            usuario = new Usuario(data);
            await usuario.save();
        }

        if (!usuario.estado) {
            return res.status(401).json({
                mjg: 'Usuario bloqueado, hable con el administrador'
            })
        }

        // Generar tokend
        const token = await generarToken(usuario.id);

        res.json({
            usuario,
            token
        })
        
    } catch (error) {
        console.log(error)
        res.status(400).json({
            msj: 'Token de google no reconocido',
            error
        })
    }

    
}

const renovarToken = async(req, res = response) => {

    const usuario = req.user;

    const token = await generarToken(usuario.id);

    res.json({
        usuario,
        token
    })
}

module.exports = {
    loginUsuario,
    googleSignin,
    renovarToken

}