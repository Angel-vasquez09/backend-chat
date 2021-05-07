const { Socket } = require("socket.io");
const { usuarioDesonectado, grabarMensaje, usuarioConectado, totalUser, actualizarUser } = require("../controllers/socket.controllers");
const { comprobarToken } = require("../helpers");

const { ChatMensajes } = require("../models");

const chatMensaje = new ChatMensajes();
/* Antes de subirlo a un hosting elimina el = new Socket
Esto lo coloque para que me ayudara con la sintaxis
ese paso es solo mientras construyo el controller */

// Este metodo es el que nos dice cuando un usuario se conecta
// Esta funcion esta en el constructor del server
const socketController = async(socket = new Socket, io) => {

    const usuario = await comprobarToken(socket.handshake.headers['x-token']);

    if (!usuario) {
        return socket.disconnect();
    }

    // Agregar usuario
    chatMensaje.conectarUsuario( usuario );
    //const usuariosTotal = await usuariosRegistrados();
    //console.log( 'Usuarios total: =>',usuariosTotal);
    // Cuando un usuario se conecte le emitimos todos los usuarios conectados
    //io.emit('usuarios-registrados', usuariosTotal);

    // Cuando un usuario se conecte le emitimos los ultimos dies mensajes
    //socket.emit('recibir-mensajes', chatMensaje.ultimos10Msj);

    // Conectar al usuario a una sala especiali
    socket.join(usuario.id);


    // Quitar usuario de la lista de los conectados cuando se desconecta
    socket.on('disconnect', () => {
        const userDesconectado = usuarioDesonectado(usuario.id);
        userDesconectado.then(([usuarios,usuario]) => {
            socket.broadcast.emit('desconectado', usuario);
            io.emit('user-registrados', usuarios);
        })

    });

    socket.on('actualizar', (payload) => {
        const user = actualizarUser(payload);
        user.then(([usuario,usuarios]) => {

            io.emit('user-registrados', usuarios);

            socket.emit('user-actualizado', {usuario,usuarios});

        })
    })

    socket.on('enviar-mensaje', async({para, mensaje}) => {
        
        // Grabamos el mensaje en la base de datos
        const mjs = await grabarMensaje({de: usuario.id, para: para, mensaje: mensaje })
        
        const datos = { nombre: usuario.nombre, mensaje: mensaje }
        
        //chatMensaje.enviarMensaje(usuario.id, usuario.nombre, mensaje);
        
        // Le enviamos el mensaje al usuario con el que estamos chateando
        socket.to(para).emit('mensaje-privado', { datos: mjs, yo: false})
        // recibo los ultimos 10 mensajes que han enviado
        
    })

    // Usuario Conectado
    const userConectado = usuarioConectado(usuario.id);
    userConectado.then(([usuarios, usuario]) => {
        socket.broadcast.emit('conectado', usuarios);
        io.emit('user-registrados', usuario);
    })

    
}


module.exports = {
    socketController
}