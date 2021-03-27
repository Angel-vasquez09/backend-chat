const { Router } = require('express');
const { check } = require('express-validator');

const {usuarioGet, usuarioPut, usuarioPost, usuarioDelete} = require("../controllers/user");
const { esRolValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middleware/validar-campos');
const { esAdminRole } = require('../middleware/validar-role');
const { validarToken } = require('../middleware/validar-token');

const router = Router();


// OBTENER TODOS LOS USUARIOS PERO PAGINADOS
router.get('/get', usuarioGet);




// ACTUALIZAR USUARIO POR ID
router.put('/put/:id',[
    check('id', 'no es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRolValido),
    validarCampos
], usuarioPut); // Actualizar un dato con parametro




// CREAR USUARIO
router.post('/post', 
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('correo','El correo no es valido').isEmail(),
    check('correo').custom(emailExiste),
    check('password','El password debe tener mas de 6 caracteres').isLength({min: 6}),
    check('rol').custom(esRolValido)
    ,
    validarCampos
,usuarioPost)



// ELIMINAR USUARIO
router.delete('/delete/:id',[
    validarToken,
    esAdminRole,
    check('id', 'no es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuarioDelete)


module.exports = router;