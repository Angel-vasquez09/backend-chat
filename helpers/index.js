

const dbValidators   = require('./db-validators');
const generarToken   = require('./generar-token');
const subirArchivo   = require('./subir-archivo');
const dbGoogleVerify = require('./db-google-verify');



module.exports = {
    ...dbValidators,
    ...generarToken,
    ...subirArchivo,
    ...dbGoogleVerify
}