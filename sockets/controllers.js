const { Socket } = require('socket.io');
const {comprobarJWT} = require('../helpers/generar-jwt');

const  ChatMensajes  = require('../models/chat-mensajes');

const chatMensajes = new ChatMensajes();

const socketController = async ( socket = new Socket(), io ) => { 

    //Tomar el Token enviado desde el front
    //console.log(socket.handshake.headers['x-token']);

    const usuario = await comprobarJWT(socket.handshake.headers['x-token']);

    if(!usuario){
        socket.disconnect();
    }

    //Agregar el usuairo conectado
    await chatMensajes.conectarUsuario( usuario );
    io.emit('usuarios-activos', chatMensajes.usuariosArr);
    socket.emit('recibir-mensajes', chatMensajes.ultimos10)

    //Conecttar usuario a una sala privada
    socket.join(usuario.uid);// global, socket.id , usuario.id

    //Limpiar cuando alguien se desconecta
    socket.on('disconnect', () => {
        chatMensajes.desconectarUsuario(usuario.id);

        //Informamos a todos quien se desconecto
        io.emit('usuarios-activos', chatMensajes.usuariosArr);
    });

    //Enviar mensajes
    socket.on('enviar-mensaje', ({  uid ,mensaje}) => {

        if ( uid ){
            //mensaje privado
            socket.to(uid).emit('mensaje-privado' ,{ de: usuario.name , mensaje});

        } else{
            chatMensajes.enviarMensaje(usuario.uid, usuario.name, mensaje);
            io.emit('recibir-mensajes', chatMensajes.ultimos10)
        }

    });
} 

module.exports = {
    socketController
};