const jwt = require('jsonwebtoken');


const generarToken = (uid = '') => {

    return new Promise( (resolve, reject) => {

        const cargaUtil = {uid};

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


module.exports = {
    generarToken
}
