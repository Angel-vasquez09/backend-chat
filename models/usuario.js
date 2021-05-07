const {Schema, model} = require('mongoose');


const usuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, "Nombre obligatorio"]
    },
    apellido: {
        type: String,
        required: [true, "Apellido obligatorio"]
    },

    correo: {
        type: String,
        required: [true, "Correo obligatorio"],
        unique: true
    },

    password: {
        type: String,
        required: [true, "Contraseña obligatoria"]
    },

    img: {
        type: String
    },

    rol: {
        type: String,
        default: 'USER_ROL',
        emun: ['ADMIN_ROLE','USER_ROL']
    },

    estado: {
        type: Boolean,
        default: true
    },

    google: {
        type: Boolean,
        default: false
    },
    online: {
        type: Boolean,
        default: false
    }

})

// Quitamos el password y la __v del a respuesta de la base de datos

usuarioSchema.methods.toJSON = function() {
    const {__v,password,_id, ...usuario} = this.toObject();
    usuario.id = _id; // Cambiamos el nombre del _id por uid
    return usuario;
}


module.exports = model('Usuario', usuarioSchema);