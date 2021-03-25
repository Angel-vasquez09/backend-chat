const express = require('express')
const cors = require('cors')

// Creamos la clase
class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        // MiddleWare
        this.middleware();

        // Rutas de mi app
        this.routes();
    }




    middleware(){
        
        this.app.use(cors());

        this.app.use(express.json());

        this.app.use(express.static('public'))
    }


    // Rutas de mi aplicacion
    routes(){
        this.app.use('/usuario', require('../routes/user'))
    }






    listen(){
        this.app.listen(this.port, () => {
            console.log(`Example app listening on port ${this.port}!`)
        })
    }

}

// Exportamos la clase
module.exports = Server;