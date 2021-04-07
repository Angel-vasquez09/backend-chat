const express = require('express')
const cors = require('cors');
const { dbConnection } = require('../database/config');

// Creamos la clase
class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        //Conectar a la base de datos
        this.connectarDB();

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


    async connectarDB(){
        await dbConnection();
    }


    // Rutas de mi aplicacion
    routes(){
        
        this.app.use('/auth',       require('../routes/auth'));

        this.app.use('/categorias', require('../routes/categorias'));
        
        this.app.use('/usuario',    require('../routes/user'));

        this.app.use('/productos',  require('../routes/productos'));

        this.app.use('/buscar',  require('../routes/buscar'));

    }






    listen(){
        this.app.listen(this.port, () => {
            console.log(`Example app listening on port ${this.port}!`)
        })
    }

}

// Exportamos la clase
module.exports = Server;