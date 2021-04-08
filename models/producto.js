const {Schema, model} = require("mongoose");

const productoSchema = Schema({
    
    nombre: {
        type: String,
        require: [true, 'El nombre es obligatorio'],
        unique: true
    },

    estado: {
        type: Boolean,
        default: true,
        require: true
    },

    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        require: true
    },

    precio: {
        type: Number,
        default: 0
    },

    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        
    },

    descripcion: {
        type: String,
    },

    disponible: {
        type: Boolean,
        default: true
    },

    img: {
        type: String,
    }
})

module.exports = model('Producto',productoSchema);