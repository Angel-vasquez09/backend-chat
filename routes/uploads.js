const { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivo, actualizarImg, mostrarImg, actualizarImgCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');
const { validarCampos } = require('../middleware/validar-campos');

const router = Router();

// SUBIR ARCHIVO(S)
router.post('/', cargarArchivo);

// ACTUALIZAR
router.put('/:coleccion/:id',[
    check('id', 'Id no es de mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios','productos'])),
    validarCampos
], actualizarImgCloudinary);


router.get('/:coleccion/:id',[
    check('id', 'Id no es de mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios','productos'])),
    validarCampos
],mostrarImg);


module.exports = router;