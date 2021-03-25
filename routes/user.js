const { Router } = require('express')
const {usuarioGet, usuarioPut, usuarioPost, usuarioDelete} = require("../controllers/user");

const router = Router();

router.get('/get', usuarioGet);

router.put('/put/:id', usuarioPut); // Actualizar un dato con parametro

router.post('/post', usuarioPost)

router.delete('/delete', usuarioDelete)


module.exports = router;