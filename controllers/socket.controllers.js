const Usuario = require('../models/usuario');
const Chat = require('../models/chat');
const CountMjs = require('../models/count-mjs');

const usuarioConectado = async(id = '') => {
    const usuario = await Usuario.findById(id);
    usuario.online = true;
    await usuario.save();
    const usuarios = await Usuario.find();
    
    return [usuario,usuarios];
}

// Metodo para obtener la cantidad de mensajes que no a leido cada usuario
const countMensajes = async(mi) => {

    const count = await CountMjs.find({para: mi});

    return count;
}

// Metodo para crear un mensaje no leido de un usuario,
// o para aumentar la cantidad de mensajes que no han leido
const guardarCountMjs = async({de,para,num}) => {

    const usuario = await Usuario.findById(para);
    // Verificamos si esta dentro de nuestro chatt
    if (!usuario.chat || usuario.usuario !== de) {
        /* Si no esta dentro de nuestro chatt procederemos a
        guardar los mensajes que no a leido */
        const count = await CountMjs.find({
            $and: [{de: de},{para: para}]
        });

        if (count.length === 0) {
            const guardar = await CountMjs({de,para});
            await guardar.save();
        }else{
            count[0].cantidad++;
            count[0].save();
        }
    }

    return true;
}

// USUARIOS REGISTRADOS
const totalUser = async() => {
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



// ACTUALIZAR USUARIO PARA SABER EN QUE CHAT SE ENCUENTRA
const chatActivo = async(de,para,chat) => {

    const usuario  = await Usuario.findById(de);
    usuario.usuario = para;
    if (chat) {
        usuario.chat = true;
        const count = await CountMjs.find({
            $and: [{de: para},{para: de}]
        });
        if (count.length > 0) {
            // Cuando entre al chat colocamos en 0 los mensajes que no habiamos leido
            count[0].cantidad = 0;
            count[0].save();
        }
    }else{
        usuario.chat = false;
    }
    await usuario.save();

    return true;

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
    actualizarUser,
    countMensajes,
    guardarCountMjs,
    chatActivo
}