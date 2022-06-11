const {response} = require('express'); 
const {ObjectId} = require('mongoose').Types;

const  usuario  = require('../models/usuario');
const Category = require('../models/category');
const Product = require('../models/product');

const coleccionesPermitidas = [
    'users',
    'roles',
    'categories',
    'products'
];


const search = async (req, res = response) => {

    const {collection, termino} = req.params;

    if(!coleccionesPermitidas.includes(collection)){
        return res.status(400).json({ 
            msg : `Las colecciones permitidas son: ${coleccionesPermitidas}`
        });
    }

    switch(collection){
        case 'users':
            getUser( termino, res);
        break;

        case 'categories':
            getCategories( termino, res);
        break;

        case 'products':
            getProducts( termino, res);
        break;

        default:
            res.status(500).json({
                msg: 'Se le olvido hacer esta busqueda'
            })

    }

};

//GET USER
const getUser = async (termino = '' , res = response) => {

    const isMongoId = ObjectId.isValid(termino); // TRUE, FALSE
    
    if(isMongoId){
        const user = await usuario.findById(termino);

        return res.status(200).json({
            results:  (user) ? [ user ] : []
        });
    }

    const regex = new RegExp(termino, 'i'); //Utilizamos una expresion regular para insensivilar la busqueda

    //BUSCAMOS USUARIOS
    const users = await usuario.find({
        $or: [{ name: regex}, {email: regex}],
        $and: [{status: true}]
    });

    return res.status(200).json({
        results:  (users) ? [ users ] : []
    });

} 

//GET CATEGORIES
const getCategories = async(termino = '', res = response) =>{

    const isMongoId = ObjectId.isValid(termino); // TRUE, FALSE

    if(isMongoId){
        const category = await Category.findById(termino);
        const products = await Product.find({category: termino});

        return res.status(200).json({
            msg: 'category',
            category,
            products
        }) 
       }

    const regex = new RegExp(termino, 'i'); //Utilizamos una expresion regular para insensivilar la busqueda

    //BUSCAMOS CATEGORIES
    const categories = await Category.find({ 
        $or: [{ name: regex}, {status: true}]
    }).populate('user','name');


    return res.status(200).json({ 
        results : (categories) ? [ categories ] : []
     });


}
 

//GET PRODUCTS
const getProducts = async(termino ='', res = response) => {
    
    const isMongoId = ObjectId.isValid(termino); // TRUE, FALSE

     if(isMongoId){
        const product = await Product.findById(termino).populate('category','name').populate('user','name');

       return res.status(200).json({
            msg: 'product',
            product
        });
     }

     const regex =new RegExp(termino,'i');
     
     //BUSCAMOS PRODUCTOS
     const products = await Product.find({ 
         $or: [{name : regex}, {description : regex}],
         $and: [{status: true}]
     }).populate('category','name').populate('user','name');

     return res.status(200).json({
            results:  (products) ? [ products ] : []
     });
}



module.exports = {
    search
};