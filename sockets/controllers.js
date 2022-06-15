const { Socket } = require('socket.io');

const socketController = ( socket = new Socket() ) => { 

    console.log('Cliente Conectado', socket.id);

};

module.exports = {
    socketController
};