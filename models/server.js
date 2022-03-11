const express = require('express')
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.paths = {
            users:      '/api/users',
            auth:       '/api/auth',
            buscar:     '/api/buscar',
            categories: '/api/categories',
            products:   '/api/products'
        };

        // Conectar a la base de datos
        this.conectarDb();

        // Middlewares
        this.middlewares();
        // Rutas de mi aplicacion
        this.routes();
    }

    async conectarDb() {
        await dbConnection();
    }

    middlewares() {
        //CORS
        this.app.use( cors() );
        //Lectura y parseo del body
        this.app.use( express.json() );
        // Directorio Público
        this.app.use( express.static('public') );
    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.users, require('../routes/users'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.categories, require('../routes/categories'));
        this.app.use(this.paths.products, require('../routes/products'));
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log('Server is running in port ', this.port );
        });
    }
}

module.exports = Server;