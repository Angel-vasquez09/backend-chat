const { Router } = require('express');
const { check } = require('express-validator');
const { categoriasGet, obtenerCategoria, crearCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validators');
const { esAdminRole } = require('../middleware/validar-role');
const { validarCampos } = require('../middleware/validar-campos');
const { validarToken } = require('../middleware/validar-token');


const router = Router();


// OBTENER TODAS LAS CATEGORIAS PERO PAGINADOS
router.get('/', categoriasGet);




// OBTENER UNA CATEGORIA POR ID - PUBLICA
router.get('/:id',[
    check('id','Este id es incorrecto').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], obtenerCategoria);




// CREAR UNA NUEVA CATEGORIA - PRIVADA - CUALQUIER PERSONA CON TOKEN VALIDO
router.post('/',[
    validarToken,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);




// ACTUALIZAR UNA CATEGORIA - PRIVADO
router.put('/:id',[
    validarToken,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('id','Este id no es correcto').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], actualizarCategoria);




// BORRAR - CAMBIAR EL ESTADO A FALSE PARA NO BORRAR LA CATEGORIA SOLO EL ADMIN
router.delete('/:id',[
    validarToken,
    esAdminRole,
    check('id', 'no es un ID valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], borrarCategoria);


module.exports = router;