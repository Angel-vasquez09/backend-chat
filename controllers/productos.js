const { response } = require("express");
const Producto = require("../models/producto");


// OBTENER TODOS LOS PRODUCTOS DE LA BASE DE DATOS PAGINADOS
const productos = async(req, res = response) => {

    const {limite = 5, desde = 0} = req.query;

    const [total, productos] = await Promise.all([
        
        Producto.countDocuments({estado:true}), // total
        Producto.find({estado: true}) // categorias
            .populate('usuario','nombre')
            .populate('categoria','nombre')
            .skip( Number(desde ))
            .limit(Number(limite))
    ])
    
    res.json({
        total,
        productos
    })
}



// OBTENER PRODUCTOS POR ID
const obtenerProductoPorId = async(req, res = response) => {

    const { id } = req.params;

    const producto = await Producto.findOne({_id: id})
                                .populate('usuario','nombre')
                                .populate('categoria','nombre');

    res.json({
        producto
    })

}



// CREAR UN PRODUCTO
const crearProducto = async(req, res = response) => {

    const { descripcion, precio, categoria } = req.body;

    const productoBD = await Producto.findOne({nombre: req.body.nombre.toUpperCase()});

    if ( productoBD ) {
        return res.json({
            msj: `El producto ${req.body.nombre} ya esta registrado en la base de datos`
        })
    }

    const data = {
        nombre: req.body.nombre.toUpperCase(),
        descripcion,
        precio,
        usuario: req.usuario._id,
        categoria
    }

    const producto = new Producto(data);

    await producto.save();

    res.status(201).json({
        producto
    })


}


// ACTUALIZAR PRODUCTO POR ID
const actualizarProducto = async(req, res = response) => {

    const { id } = req.params;

    const {estado, usuario, ...data} = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const productoActualizado = await Producto.findByIdAndUpdate(id,data, {new: true});

    res.json(productoActualizado);
}



// ELIMINAR PRODUCTO
const eliminarProducto = async(req, res = response) => {

    const { id } = req.params;

    const producto = await Producto.findByIdAndUpdate(id, {estado: false})

    //const usuarioAutent = req.usuario;

    res.json(producto);
}


module.exports = {
    productos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto
}