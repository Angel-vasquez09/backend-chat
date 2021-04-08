const Role = require("../models/role");
const Usuario = require("../models/usuario");
const Categoria = require("../models/categoria");
const Producto = require("../models/producto");

const esRolValido = async(rol = '') => {

    const existeRole = await Role.findOne({rol});
    if ( !existeRole ) {
        throw new Error(`El rol ${rol} no es valido`)
    }
}

const emailExiste = async(correo = '') => {

    const existeEmail = await Usuario.findOne({correo});

    if(existeEmail){
        throw new Error(`El correo ${correo} ya esta registrado`)
    } 

}

const existeUsuarioPorId = async(id) => {

    const existeUsuario = await Usuario.findById(id);

    if(!existeUsuario){
        throw new Error(`El id ${id} no existe registrado`)
    } 

}

const existeCategoriaPorId = async(id) => {

    const existeCategoria = await Categoria.findById(id);

    if(!existeCategoria){
        throw new Error(`El id ${id} no existe registrado`)
    } 

}


const existeProductoPorId = async(id) => {

    const existeProducto = await Producto.findById(id);

    if(!existeProducto){
        throw new Error(`El id ${id} no existe registrado`)
    } 

}


const coleccionesPermitidas = (coleccion = '', colecciones = []) => {

    const incluida = colecciones.includes(coleccion);

    if ( !incluida) {
        throw new Error(`La coleccion ${coleccion} no esta incluida en [${colecciones}]`)
    }

    return true;
}



module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas
    
}