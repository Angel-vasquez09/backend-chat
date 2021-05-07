const jwt = require('jsonwebtoken');
const { Usuario } = require('../models')

const generarToken = (uid = '') => {

    return new Promise( (resolve, reject) => {

        const cargaUtil = { uid };

        jwt.sign(cargaUtil, process.env.SECRETOPRIVATEKEY, {
            expiresIn: '10h'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('No se pudo crear el token')
            }else{
                resolve(token);
            }
        })

    })
}


const comprobarToken = async(token = '') => {

    try {
        if(token.length <= 10){
            return null;
        }

        const { uid } = jwt.verify(token, process.env.SECRETOPRIVATEKEY);

        const usuario = await Usuario.findById(uid);

        if (usuario) {
            if (usuario.estado) {
                return usuario;
            }else{
                return null;
            }
        }else{
            return null;
        }


    } catch (error) {
        return null;
    }

}


module.exports = {
    generarToken,
    comprobarToken
}
