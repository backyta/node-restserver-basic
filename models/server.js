const express = require('express');
const cors = require('cors');

const { dbConnection } = require('../db/config');
const fileUpload = require('express-fileupload');


class Server{

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth: '/api/auth',
            buscar: '/api/buscar',
            users: '/api/users',
            productos: '/api/productos',
            categories: '/api/categories',
            uploads: '/api/uploads'
        }
        
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
        this.app.use( express.static('public') ); // tiene la ruta por defecto '/', por eso no aplica la ruta 'hello world'

        //Fileupload, carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true // para crear carpetas, tener cuidado.
        }));
    }

    routes(){
       
        this.app.use( this.paths.auth , require('../routes/auth'))
        this.app.use( this.paths.buscar, require('../routes/buscar'))
        this.app.use( this.paths.users , require('../routes/users'))
        this.app.use( this.paths.uploads , require('../routes/uploads'))
        this.app.use( this.paths.productos , require('../routes/productos'))
        this.app.use( this.paths.categories , require('../routes/categories'))
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
