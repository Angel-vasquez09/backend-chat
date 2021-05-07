class Mensaje {
    constructor(uid, nombre, mensaje){
        this.uid = uid;
        this.nombre = nombre;
        this.mensaje = mensaje;
    }
}


class ChatMensajes {

    constructor(){
        this.mensajes = [];
        this.usuarios = {};
    }

    get ultimos10Msj(){
        // Extraer los ultimos 10 mensajes 
        this.mensajes = this.mensajes.splice(0,10);
        return this.mensajes;
    }

    get usuariosArr(){
        return Object.values( this.usuarios ); // [{}, {}, {}]
    }

    enviarMensaje(uid, nombre, mensaje){
        this.mensajes.unshift(
            new Mensaje(uid,nombre,mensaje)
        );
    }

    conectarUsuario(usuario){
        // 1234:{usuario}
        this.usuarios[usuario.id] = usuario;
    }

    usuarioDesconectado(id){
        delete this.usuarios[id];
    }

}

module.exports = ChatMensajes;