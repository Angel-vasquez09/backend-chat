

const productos = require('./productos');
const buscar = require('./buscar');
const categoria = require('./categoria');
const uploads = require('./uploads');
const usuario = require('./user');
const auth = require('./auth');


module.exports = {
    ...productos,
    ...buscar,
    ...categoria,
    ...uploads,
    ...usuario,
    ...auth
}