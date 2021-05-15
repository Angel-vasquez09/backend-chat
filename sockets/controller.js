const { Socket } = require("socket.io");
const { usuarioDesonectado, grabarMensaje, usuarioConectado, actualizarUser, countMensajes, guardarCountMjs, chatActivo, totalUser } = require("../controllers/socket.controllers");
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

    // OBTENER TODOS LOS MENSAJES NO LEIDOS DEL USUARIO AUTENTICADO


    // Quitar usuario de la lista de los conectados cuando se desconecta
    socket.on('disconnect', async() => {
        const [user,users] = await usuarioDesonectado(usuario.id);
        socket.broadcast.emit('desconectado', {user,users});
    });

    // Me toco emitir primero desde el servidor para poder escuchar el chat activo
    // No podia emitir desde el cliente
    socket.emit('chat','emitir chat activo');

    socket.on('chat-activo', async({de,para,chat}) => {
        await chatActivo(de,para,chat);
    })
    
    socket.on('chat-inactivo', async({de,para,chat}) => {
        await chatActivo(de,para,chat);
    })





    socket.on('actualizar', async(payload) => {
        const [user,usuarios] = await actualizarUser(payload);

        // Manda las actualizaciones a todos los usuarios menos a mi
        socket.broadcast.emit('actualizado-user', {usuarios}); 
        /* Me manda la actualizacion solo ami, para mostrar un mensaje
        verificando que se me actualizo correctamente */
        socket.emit('user-actualizado', {user}); 
        
    })

    socket.on('enviar-mensaje', async({para, mensaje, hora}) => {
        
        // Grabamos el mensaje en la base de datos
        await grabarMensaje({de: usuario.id, para: para, mensaje: mensaje })
        
        const datos = { nombre: usuario.nombre, mensaje: mensaje, hora: hora }
        
        /* chatMensaje.enviarMensaje(usuario.id, usuario.nombre, mensaje); */
        // Le enviamos el mensaje al usuario con el que estamos chateando
        socket.to(para).emit('mensaje-privado', { datos: datos, yo: false})
        
        await guardarCountMjs({de: usuario.id,para: para, num: 1 });
        
        // Le eniamos una notificacion al usuario de que tiene un mensaje sin leer
        const countM = await countMensajes(para);
        
        const total = await totalUser();

        socket.to(para).emit('count-mjs-priv', {total,countM});
        
        
        
    })

    socket.on('countMjs', async() => {
        const countM = await countMensajes(usuario.id);
        socket.emit('countMjs', countM);
    });

    const usuarioConectadoServer = async() => {

        const [user, users] = await usuarioConectado(usuario.id);
        const countM        = await countMensajes(usuario.id);

        socket.emit('count-mjs', {users,countM});
        socket.emit('user-registrados', users);
        socket.broadcast.emit('conectado', {user,users});
    }

    // Se ejecutara cuando un usuario se conecte
    usuarioConectadoServer();

    
    
    
}


module.exports = {
    socketController
}