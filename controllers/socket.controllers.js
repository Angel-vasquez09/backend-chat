const Usuario = require('../models/usuario');
const Chat = require('../models/chat');

const usuarioConectado = async(id = '') => {
    const usuario = await Usuario.findById(id);
    usuario.online = true;
    await usuario.save();
    const usuarios = await Usuario.find();
    
    return [usuario,usuarios];
}


// USUARIOS REGISTRADOS
const totalUser = async(id = '') => {
    const usuarios = await Usuario.find();
    return usuarios;
}


// ACTUALIZAR USUARIO

const actualizarUser = async(data) => {
    var id = data.id;
    const usuario  = await Usuario.findById(id);
    usuario.nombre   = data.nombre;
    usuario.apellido = data.apellido;
    await usuario.save();
    const usuarios = await Usuario.find();
    return [usuario,usuarios];
}




const usuarioDesonectado = async(id = '') => {
    const usuario = await Usuario.findById(id);
    usuario.online = false;
    await usuario.save();
    const usuarios = await Usuario.find();
    return [usuarios,usuario];
}


const grabarMensaje = async( payload ) => {

    try {
        const mensaje = new Chat( payload );
        await mensaje.save();

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }

}

const usuariosConectados = async() => {

    const [total, usuarios] = await Promise.all([
        // Con este metodo resolvemos dos promesas de un solo tiroo
        // y es mas rapido que esperar que se ejecute una y luego la otra
        // Esta las ejecuta a las dos al tiempo
        Usuario.countDocuments({estado:true}),
        Usuario.find({estado: true})
            .skip( Number(0))
            .limit(Number(10))
    ])

    return [total, usuarios];
}


module.exports = {
    usuarioConectado,
    usuarioDesonectado,
    grabarMensaje,
    usuariosConectados,
    totalUser,
    actualizarUser
}