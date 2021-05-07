const express = require('express')
const cors = require('cors');
const { dbConnection } = require('../database/config');
const fileUpload = require('express-fileupload');
const { socketController } = require('../sockets/controller');

// Creamos la clase
class Server {

    constructor(){
        this.app    = express();
        this.port   = process.env.PORT;
        // Configurar el backend para que trabaje con sockets
        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server);

        //Conectar a la base de datos
        this.connectarDB();

        // MiddleWare
        this.middleware();

        // Rutas de mi app
        this.routes();

        // Sockets
        this.sockets();
    }




    middleware(){
        
        this.app.use(cors());

        this.app.use(express.json());

        this.app.use(express.static('public'))

        // Carga de archivo
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
        
    }

    sockets(){
        this.io.on('connection', (socket) => socketController(socket, this.io));
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

        this.app.use('/uploads',  require('../routes/uploads'));

        this.app.use('/mensajes',  require('../routes/mensajes'));

    }






    listen(){
        this.server.listen(this.port, () => {
            console.log(`Example app listening on port ${this.port}!`)
        })
    }

}

// Exportamos la clase
module.exports = Server;