const {response} = require('express');
const Category = require('../models/category');

//GET CATEGORIES
const getCategories = async (req, res = response) => {

        const {limit = 5, desde = 0} = req.query;

        const [total, categories] = await Promise.all([
            Category.countDocuments({status : true}),
            Category.find({status : true})
                    .skip(Number(desde))
                    .limit(Number(limit))
        ]);

        res.status(200).json({
            msg: 'GET - Categories API - Controller',
            total,
            limit,
            desde,
            categories
        });
}

//GET CATEGORY -- populate
const getCategory = async (req, res = response) => {

    const { id } = req.params;
    const category = await Category.findById(id).populate('user').find({status : true});

    if ( category == 0){
       return res.status(404).json({
            msg: 'La categoria no existe o esta deshabilitada'
        });
    }

    res.status(201).json({
        msg: 'Action successfully',
        category
    });
}

//POST CATEGORY
const postCategory = async (req, res = response) => {

    const name = req.body.name.toUpperCase();

    const usuario = req.uid;

    const data ={
        name,
        user : usuario._id
    }

    const category = new Category(data);
    await category.save();

    res.status(201).json({
        category
    })
    }

//PUT CATEGORY - PRIVADO - CUALQUIER TOKEN VALIDO
const putCategory = async (req, res = response) => {

    const name  = req.body.name.toUpperCase();
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(id, {name: name});

    res.status(201).json({
        msg: 'PUT - ok',
        name,
        category
    })

}


//DELETE CATEGORY - STATUS FALSE - SOLO ADMIN
const deleteCategory = async (req , res = response) => {
    const user = req.uid;
    const { id } = req.params;

    const category = await Category.findByIdAndUpdate(id, {status: false});

    res.status(201).json({
        msg: 'DELETE - ok',
        category,
        user
    })
}


module.exports = {
    getCategories,
    getCategory,
    postCategory,
    putCategory,
    deleteCategory
};
