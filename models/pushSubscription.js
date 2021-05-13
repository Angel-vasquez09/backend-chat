const {Schema, model} = require("mongoose");

const subscription = Schema({

    id: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        require: true
    },
    subcription: {
        type: Object,
        require: true
    }
})

module.exports = model('Subscription',subscription);