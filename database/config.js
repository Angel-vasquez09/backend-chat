const mongoose = require("mongoose");

const dbConnection = async() => {

    try {

        await mongoose.connect(process.env.MONGODB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        })

        console.log("Base de datos online!")

    } catch (error) {
        console.log('Este es el error =>' + error)
        throw new Error('Error al iniciar la base de datos')
    }

}

module.exports = {
    dbConnection
}