const { response } = require("express");

const  Categoria = require('../models/categoria');


/* 
    OBTENER TODAS LAS CATEGORIAS PAGINADAS
*/
const categoriasGet = async(req, res = response) => {

    const {limite = 5, desde = 0} = req.query;

    const [total, categorias] = await Promise.all([
        
        Categoria.countDocuments({estado:true}), // total
        Categoria.find({estado: true}) // categorias
            .populate('usuario','nombre')
            .skip( Number(desde ))
            .limit(Number(limite))
    ])
    
    res.json({
        total,
        categorias
    })
}  




/* 
    OBTENER CATEGORIA POR ID
*/
const obtenerCategoria = async(req, res) => {

    const { id } = req.params;

    const categoriaBD = await Categoria.findById({_id: id})
                                .populate('usuario','nombre');

    res.json({
        categoriaBD
    })
}





/* 
    CREAR CATEGORIAS
*/
const crearCategoria = async(req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaBD = await Categoria.findOne({nombre});

    if (categoriaBD) {
        return res.json({
            msj: `La categoria ${categoriaBD} ya existe en la base de datos`
        })
    }

    // Generamos los datos que vamos a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    // Preparamos los datos que vamos a guardar
    const categoria = new Categoria(data);

    // Guardamos los datos en la base de datos
    await categoria.save();


    res.status(201).json({
        categoria
    })
}



/* 
    ACTUALIZAR CATEGORIAS
*/
const actualizarCategoria = async(req, res) => {

    const { id } = req.params;

    /* Desestructuramos los datos para evitar que se actualicen
    el usuario y el estado
    ...data almacena los demas datos que no sesestructuramos
     */
    const {estado, usuario, ...data} = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const actualizarC = await Categoria.findByIdAndUpdate(id,data, {new: true});


    res.json(actualizarC);
}




/* 
    CAMBIAR EL ESTADO DE LAS CATEGORIAS PARA NO PERDER ESTADO
*/
const borrarCategoria = async(req, res) => {

    const { id } = req.params;
    // No eliminamos el usuario solo le colocamos el estado en false
    const categoria = await Categoria.findByIdAndUpdate(id, {estado: false})

    //const usuarioAutent = req.usuario;

    res.json(categoria);
}




module.exports = {
    categoriasGet,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
}