// Importaciones propias de node
const path = require('path');
const fs = require('fs'); // fileSystem

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL); // Autenticamos nuestro backend con cloudinary

const { response } = require("express");
const { subirArchivo } = require("../helpers/subir-archivo");
const {Usuario, Producto} = require("../models");


const cargarArchivo = async(req, res = response) => {

    // verigficamos que envien cualquier archivo, que no este vacio
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        res.status(400).json({
            msg: 'No hay archivos que subir'
        });
        return;
    }

    // TryCatch atrapa los errores que solo aparecen en la consola y no los
    // Mustra en un mensaje de json que tengamos
    try {
        // IMAGENES
        const nombre = await subirArchivo(req.files,undefined, 'imgs');
    
        res.json({
            nombre
        })
        
    } catch (error) {
        
        res.status(400).json({
            error
        })
    }
}



// ACTUALIZAR IMAGEN
const actualizarImg = async(req, res = response) => {

    const { coleccion, id} = req.params;
    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if ( !modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
            break;
    
        case 'productos':
            modelo = await Producto.findById(id);
            if ( !modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
            break;
    
        default:
            return res.status(500).json({
                msg: 'Se me olvido esto'
            });
    }

    // Verificar que exista el archivo y que no guarde la misma imagen
    if (modelo.img) {

        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        
        // Si existe el directorio procederemos a eliminarlo y a guardar la
        // imagen que querramos poner por la que estaba anteriormente
        if (fs.existsSync(pathImagen)) {
            // Eliminamos ese directorio
            fs.unlinkSync(pathImagen)
        }
    }

    // Metodo para crear la carpeta y guardar la imagen
    // Usuarios/imagen del usuario
    const nombre = await subirArchivo(req.files,undefined, coleccion);

    modelo.img = nombre;
    modelo.save();


    res.json({
        modelo
    })

}
const actualizarImgCloudinary = async(req, res = response) => {

    const { coleccion, id} = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if ( !modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
            break;
    
        case 'productos':
            modelo = await Producto.findById(id);
            if ( !modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
            break;
    
        default:
            return res.status(500).json({
                msg: 'Se me olvido esto'
            });
    }

    // Verificar que exista el archivo y que no guarde la misma imagen
    if (modelo.img) {
        const nombreArr = modelo.img.split('/');
        const nombre    = nombreArr[nombreArr.length - 1 ];
        const [ public_id ] = nombre.split('.');
        cloudinary.uploader.destroy(public_id);
    }
    

    const { tempFilePath } = req.files.archivo;

    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

    modelo.img = secure_url;

    modelo.save();


    res.json({
        modelo
    })

}


// MOSTRAR IMAGEN

const mostrarImg = async(req, res = response) => {

    const { coleccion, id } = req.params;

    let modelo;

    
    
    switch (coleccion) {
        
        case 'usuarios': 

            modelo = await Usuario.findById(id);

            if ( !modelo) {
                return res.status(400).json({
                    msg: `No existe el usuario con el id ${id}`
                })
            }
            break;
    
        case 'productos':

            modelo = await Producto.findById(id);

            if ( !modelo) {
                return res.status(400).json({
                    msg: `No existe el producto con el id ${id}`
                })
            }
            break;
    
        default:

            return res.status(500).json({
                msg: 'Se me olvido esto'
            });
    }

    // Verificar que exista el archivo y que no guarde la misma imagen
    if (modelo.img) {

        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        // Si existe la imagen la muestro
        if (fs.existsSync(pathImagen)) {
            return res.sendFile(pathImagen);
        }
    }

    // Ruta de Imagen por defecto si no existe 
    const noImg = path.join(__dirname, '../assets', 'img' , 'no-image.jpg'); 
    

    res.sendFile(noImg);
}



module.exports = {
    cargarArchivo,
    actualizarImg,
    mostrarImg,
    actualizarImgCloudinary
}