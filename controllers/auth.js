const bcrypt = require('bcryptjs');
const { response } = require('express');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

const loginController = async(req, res = response) =>{

    const {email ='', password=''} = req.body;

    try {

        const usuario = await Usuario.findOne({email});

        //Verificar si el mail existe
        if (!usuario){
            return res.status(404).json({
                msg: 'Usuario / Password no son correctos'
            });
        }

        //Si el usuario esta activo
        if(!usuario.state){
            return res.status(404).json({
                msg: 'Usuario desactivado / Comuniquese con el Administrador'
            });
        }


        //Verificar la contraseña
        const validPassword = bcrypt.compareSync(password, usuario.password);

         //Si lla constraseña es incorrecta
         if(!validPassword){
            return res.status(404).json({
                msg: 'Usuario / Password no son correctos'
            });
        }

        //Generar el JWT
        const token = await generarJWT(usuario.id);


    res.status(200).json({
        msg: 'login ok',
        usuario,
        token
    });

    }catch(error){
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }

}

const googleSignin = async(req, res = response) => {

    const  { id_token }  = req.body;

    try{

        const {email, name, image}= await googleVerify(id_token);

        //Verificamos que el usurio no este registrado en nuestra DB
        let usuario = await Usuario.findOne({email});

        //En caso de que no este registrado
        if(!usuario){

            //Crear Usuario
            const data = {
                name,
                email,
                password : ':p',
                image,
                state: true,
                google: true,

            };

            usuario = new Usuario(data);
            await usuario.save();
        }


        //Si el usuario desactivado en la DB
        if(!usuario.state){
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado.'
            });
        }

        //Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            msg: 'Login exitoso',
            usuario,
            token
        });

    }catch(error){

        res.status(404).json({
            msg: 'Token de Google no verificado'
        });
        console.log(error);
    }


}

module.exports = {
    loginController,
    googleSignin
}
