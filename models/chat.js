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
    mensaje: {
        type: String,
        required: true
    }

},{
    timestamps: true
})

chatSchema.methods.toJSON = function() {
    const {__v,_id, ...chat} = this.toObject();
    return chat;
}

module.exports = model('Chat', chatSchema);