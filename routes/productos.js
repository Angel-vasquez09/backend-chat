const { Router, response } = require('express');
const { check } = require('express-validator');
const { productos, obtenerProductoPorId, crearProducto, actualizarProducto, eliminarProducto } = require('../controllers/productos');
const { existeProductoPorId, esRolValido, existeCategoriaPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middleware/validar-campos');
const { esAdminRole } = require('../middleware/validar-role');
const { validarToken } = require('../middleware/validar-token');


const router = Router();


// OBTENER TODOS LOS PRODUCTOS PAGINADOS
router.get('/', productos);



// OBTENER PRODUCTO POR ID
router.get('/:id',[
    validarToken,
    check('id','Este id no es correcto').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], obtenerProductoPorId);



// CREAR PRODUCTOS
router.post('/',[
    validarToken,
    check('categoria').custom(existeCategoriaPorId),
    check('nombre','Nombre es obligatorio').not().isEmpty(),
    check('descripcion','Descripcion es obligatoria').not().isEmpty(),
    validarCampos
], crearProducto);


// ACTUALIZAR PRODUCTO POR ID
router.put('/:id',[
    validarToken,
    check('nombre','Nombre es obligatorio').not().isEmpty(),
    check('descripcion','Descripcion es obligatoria').not().isEmpty(),
    check('id','Este id no es correcto').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], actualizarProducto)


//  ELIMINAR PRODUCTO
router.delete('/:id',[
    validarToken,
    esAdminRole,
    check('id','Este id no pertenece a mongo').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], eliminarProducto)






module.exports = router;