const {response} = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');



/*FUNCION GET*/
const usuariosGet = async (req, res = response) => {

    //Destructuracion de argumentos 
    const {limite = 5, desde = 0} = req.query;
    const queryFilter = {state : true};  

    /*No utikizaremos await en estas dos funciones ya que una no depende de la otra, lo mejor es utilzzar promesas para ejecutar
    const usuarios = await Usuario.find(queryFilter)
                    .skip(Number(desde))
                    .limit(Number(limite));
    
    const total = await Usuario.countDocuments(queryFilter);
    */

    /*Utilizamos el await por que necesitamos obtener primeramente los parametros que vienen por req.query
    **En caso de no utilizar un await en la Promise.all, ejecutaria todo en simultaneo y avanzaria.
    **En cambio con el await en la Promise le decimos que las ejecute en simultaneo y devuelva el resultado en simultaneo tambien.
    ** Y si una de las promesas da error la otra tambien dara error.
    */
    const [total, usuarios] = await Promise.all([ //La primer promesa se almacena en 'total', sin importar cual se resuelva primero
        Usuario.countDocuments(queryFilter),
        Usuario.find(queryFilter)
                    .skip(Number(desde))
                    .limit(Number(limite))
    ]);

    res.json({
        total,
        usuarios
        });

    }

/*FUNCION POST*/
const usuariosPost = async (req, res  = response ) => {

    //Creamos la instancia del modelo Usuario   
    const {name, email ,password ,rol} = req.body;
    const usuario = new Usuario({name, email, password, rol});

    //Encriptar password
    const salt = bcrypt.genSaltSync(10); //Indicamos la cantidad de vueltas para hasshear
    usuario.password = bcrypt.hashSync(password, salt);

    //Almacenamos el usuario en la base de datos
    await usuario.save();

    //Mostramos informacion recibida por la request
    res.json({
        msg: "Post API - Controller",
        usuario
    })
};
 

/*FUNCION PUT*/
const usuariosPut = async (req, res = response ) => {

    const { id } = req.params;
    const {_id, password, google, email, ... resto} = req.body;  
    
    //TODO validar contra base de datos
    if(resto.password){
        //Encriptar password
        const salt = bcrypt.genSaltSync(10); //Indicamos la cantidad de vueltas para hasshear
        resto.password = bcrypt.hashSync(resto.password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id,resto); //findByIdAndUpdate le dice busca ese id, encuentralo y actualizalo

    res.json(usuario);
};


/*FUNCION DELETE*/
const usuariosDelete = async (req, res  = response) => { 

    const { id } = req.params; //id usuario a borrar

    //Fisicamente lo borramos
    //const usuario = await Usuario.findByIdAndDelete(id);

    /*
    const uid = req.uid; //uid del usuario que devuelve el JWT
    const usuarioAuth = await Usuario.findOne({"_id": uid});
*/
    const usuario = await Usuario.findByIdAndUpdate(id, {state: false});
    const usuarioAuth = req.uid;

    res.json({
       msg : "Usuario eliminado correctamente",
       usuario,
       usuarioAuth
    })
}; 


/*FUNCION PATCH*/
const usuariosPatch = (req, res  = response) => {
    res.json({
        msg: "Patch API - Controller"
    })
};


  module.exports ={
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete,
    usuariosPatch
  };