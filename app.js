//Requerimos 'dotenv' para tomar los datos de la configuracion del .env
require('dotenv').config();
const Server = require('./models/server');

const server = new Server();

server.listen();

