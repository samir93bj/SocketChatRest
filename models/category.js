const { Schema, model } = require('mongoose');

const CategorySchema = Schema({
    name:{
        type: String,
        required:[true,'El nombre es obligatorio'],
        unique: true
    },
    status : {
        type: Boolean,
        default: true,
        required: true,
    },
     user :{
        type: Schema.Types.ObjectId,
        ref: 'usuario',
        required: true
     }
});

//Quitamos el __v  para que retorne solo lo demas
CategorySchema.methods.toJSON = function (){
    const { __v,_id, ...category } = this.toObject();
    category.uid = _id;
    return category;
}

module.exports = model('category', CategorySchema );
