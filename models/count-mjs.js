const {Schema, model} = require("mongoose");


const chatSchema = Schema({

    de: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario', 
        required: true
    },
    para: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario', 
        required: true
    },
    cantidad: {
        type: Number,
        default: 1
    }

})

chatSchema.methods.toJSON = function() {
    const {__v,_id, ...chat} = this.toObject();
    return chat;
}

module.exports = model('Count', chatSchema);