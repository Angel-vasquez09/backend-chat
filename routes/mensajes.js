const { Router } = require('express');
const { validarToken } = require('../middleware/validar-token');
const { obtenerChat } = require('../controllers/mensajes');

const router = new Router();

router.get('/:de',validarToken, obtenerChat);



module.exports = router;