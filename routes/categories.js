const { Router } = require('express');
const { check } = require('express-validator');

const {validarJWT, esAdminRole ,validarCampos } = require('../middlewares/');

const {getCategories,
        postCategory,
        getCategory,
        putCategory,
        deleteCategory } = require('../controllers/categories');

const { idCategoryExist,
        nameCategoryExist } = require('../helpers/db-validators');

const router = new Router();

//ROUTE GET-Categories
router.get('/',
    getCategories
);

//ROUTE GET
router.get('/:id',[
    check('id','Este ID no es correcto').isMongoId(),
    check('id').custom(idCategoryExist),
    validarCampos
],getCategory);

//ROUTE POST
router.post('/',[
        validarJWT,
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('name').custom(nameCategoryExist),
        validarCampos
    ],postCategory
);

//ROUTE PUT
router.put('/:id',[
    validarJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('id','Este ID no es correcto').isMongoId(),
    check('id').custom(idCategoryExist),
    check('name').custom(nameCategoryExist),
    validarCampos
    ],putCategory
);

//ROUTE DELETE
router.delete('/:id',[
    validarJWT,
    check('id','Este ID no es correcto').isMongoId(),
    check('id').custom(idCategoryExist),
    esAdminRole,
    validarCampos
], deleteCategory);

module.exports = router;