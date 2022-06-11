const {response} = require('express');
const Product = require('../models/product');
const category = require('../models/category');

//GET PRODUCTS
const getProducts = async (req,res = response) => {

    const {limit = 5, desde = 0} = req.query;

    const [total, products] = await Promise.all([
        Product.countDocuments({status : true}),
        Product.find({status:true})
                .skip(Number(desde))
                .limit(Number(limit))
    ]);

    res.status(200).json({
        msg: 'GET ROUTE',
        total,
        limit,
        desde,
        products
    });
}
 
//GET PRODUCT
const getProduct = async (req,res = response) => {

    const { id } = req.params;
    const product = await Product.findById(id).populate('category').populate('user');

    res.status(200).json({
        msg: 'GET ROUTE',
        product
    });
}

//POST PRODUCT
const postProduct = async (req,res = response) => {

    const {status, available, user, ...body} = req.body;

    const usuario = req.uid;
    const data = {
        name: body.name.toUpperCase(),
        precio: body.precio,
        description: body.description,
        category: body.category,
        user : usuario._id,
    }

    const product = new Product(data);
    await product.save();

    res.status(200).json({
        msg: 'POST ROUTE',
        product,
    })
};

//PUT PRODUCT
const putProduct = async(req,res ) =>{

    const { id } = req.params;
    const { name, precio, description, category } = req.body;

    const product = await Product.findByIdAndUpdate( id, { name:name, precio:precio, description:description, category:category });

    res.status(200).json({
        msg: 'PUT ROUTE',
        product
    });
}

//DELETE PRODUCT
const deleteProduct = async(req,res) => {

    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, { status: false});

    res.status(200).json({
        msg : 'DELETE ROUTE',
        product
    });

}

module.exports = {
    getProducts,
    getProduct,
    postProduct,
    putProduct,
    deleteProduct
};