const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { dbConnection } = require('../database/config');
 
class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth :          '/api/auth',
            usuarios :      '/api/users',
            categorias :    '/api/categories',
            products :      '/api/products',
            search :        '/api/search',
            uploads :       '/api/uploads'
        }   

        //Conectar a la DB
        this.conectarDB();
        
        //middleware 
        this.middleware();

        //Rutas de mi aplicacion
        this.routes();
    }
    
    async conectarDB(){
        await dbConnection();
    }

    middleware (){

        //CORS
        this.app.use(cors());

        //Lectura y parseo del body
        this.app.use(express.json());

        //Directorio publico
        this.app.use(express.static('public'));

        //FILE UPLOADS
        this.app.use(fileUpload({ 
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath : true
        }));
    }

    routes(){

        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.usuarios, require('../routes/users'));
        this.app.use(this.paths.categorias, require('../routes/categories'));
        this.app.use(this.paths.products, require('../routes/products'));
        this.app.use(this.paths.search, require('../routes/search'));
        this.app.use(this.paths.uploads, require('../routes/uploads'));
    }

    listen(){

        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en: https://localhost:${this.port}`);
        });
    }
}
  

module.exports = Server;
