const {Schema, model} = require('mongoose'); 

const usuarioSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'El password es obligatorio'],
    },
    image: {
        type: String
    },
    rol: {
        type: String,
        required: true,
        default:'USER_ROLE',
        enum:['ADMIN_ROLE','USER_ROLE']
    },
    img:{
        type: String,
    },
    state:{
        type: Boolean,
        default: false
    },
    google:{
        type: Boolean,
        default: false
    }
}); 

//Quitamos el __v y password para que retorne solo lo demas
usuarioSchema.methods.toJSON = function (){
    const {__v, password,_id, ...usuario} = this.toObject();
    usuario.uid = _id;
    return usuario;
}

module.exports = model('usuario', usuarioSchema );