const jwt = require('jsonwebtoken');;
const Usuario = require('../models/usuario');

//GENERAR JWT - 
const generarJWT = (uid = '') =>{

    return new Promise ((resolve, reject) => {

        const payload = {uid};

        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
           expiresIn: '365d' 
        }, (err, token) => {
            if(err){
                console.log(err);
                reject('No se pudo generar el token');
            }
            else{
                resolve(token);
            }
        })

    });
}

//VALIDAR JWT - SOCKET
const comprobarJWT = async (token = '') => {
    try{

        if(token <= 10 ){
            return null;
        }

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const usuario = await Usuario.findById(uid);

        if(usuario){

            if(usuario.state){
                return usuario;
            }else{
                return null;
            }
        }else{
            return null;
        }

    }catch{
        return null;
    }
}

module.exports = {
    generarJWT,
    comprobarJWT
}