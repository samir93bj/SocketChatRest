const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT,esAdminRole ,validarCampos } = require('../middlewares/');

const {  idProductExist,
        nameProductExist,
        idCategoryExist
    } = require('../helpers/db-validators'); 

const {
    getProducts,
    getProduct,
    postProduct,
    putProduct, 
    deleteProduct
    } = require('../controllers/products');


const router = new Router();

//ROUTE GET - PRODUCTS
router.get('/',  getProducts);

//ROUTE 
router.get('/:id',[
    check('id','Este, no es un ID correcto').isMongoId(),
    check('id').custom(idProductExist),
    validarCampos
],getProduct);

//ROUTE POST
router.post('/',[
    validarJWT,
    check('name', 'El nombre del producto es obligatorio').not().isEmpty(),
    check('name').custom(nameProductExist),
    check('category', 'La categoria es obligatoria').not().isEmpty(),
    check('category','No es un ID valido').isMongoId(),
    check('category').custom(idCategoryExist),
    validarCampos
], postProduct);

//ROUTE DELETE
router.delete('/:id',[
    validarJWT,
    check('id','Este, no es un ID correcto').isMongoId(),
    check('id').custom(idProductExist),
    esAdminRole,
    validarCampos
],deleteProduct);

//ROUTE PUT
router.put('/:id',[
    validarJWT,
    check('id','Este, no es un ID correcto').isMongoId(),
    check('id').custom(idProductExist),
    check('name', 'El nombre del producto es obligatorio').not().isEmpty(),
    check('name').custom(nameProductExist),
    check('category', 'La categoria es obligatoria').not().isEmpty(),
    check('category','No es un ID valido').isMongoId(),
    check('category').custom(idCategoryExist),
    validarCampos
],putProduct);

module.exports = router;