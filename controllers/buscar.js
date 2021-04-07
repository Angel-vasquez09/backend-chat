const { response } = require("express");
const Usuario = require("../models/usuario");
const Producto = require("../models/producto");
const Categoria = require("../models/categoria");
const { ObjectId } = require('mongoose').Types;

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos'
];



// BUSQUEDA POR USUARIOS
const buscarUsuario = async(termino = '', res = response) => {

    // Verificamos que el id sea de mongodb
    const esIdMongo = ObjectId.isValid(termino); // TRUE O FALSE

    // Si pertenecce a mongo hacemos una busqueda del usuario al que le pertenece
    if (esIdMongo) {
        // Hacemo una busqueda por id
        const usuario = await Usuario.findById(termino);
        
        // Agregamos el resultado
        return res.json({
            results: (usuario) ? [usuario] : []
        });
    }

    // Creamos una expresion regular para que no le importen las mayusculas
    const regex = new RegExp(termino, 'i');

    // hacemos una busqueda por nombre ó por correo
    // pero solo de los usuarios que tengan el estado a true
    const usuarios = await Usuario.find({
        $or: [{nombre: regex},{correo: regex}],
        $and: [{estado: true}]
    });

    if (usuarios) {
        return res.json({
            usuarios
        })
    }

}


// BUSQUEDA POR CATEGORIAS
const busquedaCategoria = async(termino = '', res = response) => {

    const esIdMongo = ObjectId.isValid(termino); // TRUE O FALSE

    // Si pertenecce a mongo hacemos una busqueda del usuario al que le pertenece
    if (esIdMongo) {
        // Hacemo una busqueda por id
        const categoria = await Categoria.findById(termino);
        
        // Agregamos el resultado
        return res.json({
            results: (categoria) ? [categoria] : []
        });
    }

    // Creamos una expresion regular para que no le importen las mayusculas
    const regex = new RegExp(termino, 'i');

    // hacemos una busqueda por nombre ó por correo
    // pero solo de los usuarios que tengan el estado a true
    const categorias = await Categoria.find({nombre: regex,estado: true});

    if (categorias) {
        return res.json({
            categorias
        })
    }

}


// BUSQUEDA POR PRODUCTOS
const busquedaProducto = async(termino = '', res = response) => {

    const esIdMongo = ObjectId.isValid(termino); // TRUE O FALSE

    // Si pertenecce a mongo hacemos una busqueda del usuario al que le pertenece
    if (esIdMongo) {
        // Hacemo una busqueda por id
        const producto = await Producto.findById(termino)
                                        .populate('categoria','nombre');
        
        // Agregamos el resultado
        return res.json({
            results: (producto) ? [producto] : []
        });
    }

    // Creamos una expresion regular para que no le importen las mayusculas
    const regex = new RegExp(termino, 'i');

    // hacemos una busqueda por nombre ó por correo
    // pero solo de los usuarios que tengan el estado a true
    const productos = await Producto.find({nombre: regex, estado: true, disponible: true})
                                    .populate('categoria','nombre');

    if (productos) {
        return res.json({
            productos
        })
    }

}



// BUSQUEDA GENERAL
const buscar = (req, res = response) => {

    const { coleccion, termino } = req.params;

    if ( !coleccionesPermitidas.includes(coleccion) ) {
        return res.status(400).json({
            msg: `La coleccion ${coleccion} no existe`
        })
    }


    switch (coleccion) {
        case 'usuarios':
            buscarUsuario(termino, res)
            break;

        case 'categorias':
            busquedaCategoria(termino, res)
            break;

        case 'productos':
            busquedaProducto(termino, res)
            break;
    
        default:
            return res.status(500).json({
                msg: 'Error al buscar'
            })
    }




}


module.exports = {
    buscar
}