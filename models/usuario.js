const {Schema, model} = require('mongoose');


const usuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, "Nombre obligatorio"]
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
        required: true,
        emun: ['ADMIN_ROLE','USER_ROL']
    },

    estado: {
        type: Boolean,
        default: true
    },

    google: {
        type: Boolean,
        default: false
    }

})

// Quitamos el password y la __v del a respuesta de la base de datos

usuarioSchema.methods.toJSON = function() {
    const {__v,password, ...usuario} = this.toObject();
    return usuario;
}


module.exports = model('Usuario', usuarioSchema);