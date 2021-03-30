const { Router } = require('express');
const { check } = require('express-validator');
const { loginUsuario, googleSignin } = require('../controllers/auth');
const { validarCampos } = require('../middleware/validar-campos');

const router = Router();


router.post('/login',[
    check('correo','El correo es obligatorio').isEmail(),
    validarCampos
] ,loginUsuario);




router.post('/google',[
    check('id_token','El id_token es necesario').not().isEmpty(),
    validarCampos
] , googleSignin);


module.exports = router;