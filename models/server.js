const express = require('express');
const cors = require('cors');

const { dbConnection } = require('../db/config');


class Server{

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usersPath = '/api/users'
        this.authPath = '/api/auth'

        //Connectio to DB
        this.connectDB();

        //middleswares
        this.middlewares();


        //Rutas de mi aplicacion
        this.routes();
    }

    //methods

    async connectDB(){
        await dbConnection();
    }


    middlewares(){
        //cors
        this.app.use(cors())

        // lectura y parseo del body
        this.app.use( express.json() ); // cualquier info que vengan en el body, la va intentar serealizar a un objeto JS y retorna un Json en el controlador

        //Directorio publico
        this.app.use( express.static('public') ) // tiene la ruta por defecto '/', por eso no aplica la ruta 'hello world'
    }

    routes(){
       
        this.app.use(this.authPath , require('../routes/auth'))
        this.app.use(this.usersPath , require('../routes/users'))
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en puerto ${this.port}`)
        })
    }
    
}

module.exports = Server; 


//* al colocal el midleware en la ruta '/' se sirve el archivo estatico y al llegar a la ruta con el
//* mismo path esta ya no sirve lo del send, esto es porque el middleware se ejecuta antes que la ruta
//* si hubiera otra logica en el middleware si serviria lo del send en la ruta.
