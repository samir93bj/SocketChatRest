const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

//El middleware se dispara con 3 argumentos req, res, next
const validarJWT = async (req = request, res = response, next) => {

    const token = req.header('x-token');

    //Verificamos que el token llegue por el header
    if (!token){
        return res.status(401).json({
            msg: 'Invalid token'
        })
    }

    //Verificamos la autenticidad del token
    try {
      /*const payload =  jwt.verify(token,process.env.SECRETORPRIVATEKEY);
      console.log(payload);*/

      const {uid} = jwt.verify(token,process.env.SECRETORPRIVATEKEY);

      //uid = ID de usuario que viaja en el payload del JWT
      const usuario = await Usuario.findById(uid);
      req.uid = usuario;

      next();

    }catch (err) {
        return res.status(401).json({
            msg: 'Invalid token'
        })
    }

   
}

module.exports = {
    validarJWT
};