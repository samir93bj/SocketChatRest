const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const {allowedColecction} = require('../helpers/db-validators');

const {uploadFile, uploadFilePut, getFile,uploadFilePutCloudinary} = require('../controllers/uploads');

const { validarArchivoSubir } = require('../middlewares/validarArchivo');


const router = new Router();

router.post('/', 
validarArchivoSubir,
    uploadFile);

router.put('/:collection/:id',[
    validarArchivoSubir,
    check('id', 'El id es obligatorio').not().isEmpty(),
    check('id','El id ingresado no es correcto').isMongoId(),
    check('collection').custom(c => allowedColecction(c, ['users','products'])),
    validarCampos
    ],
    uploadFilePutCloudinary);

router.get('/:collection/:id',
[
    check('id', 'El id es obligatorio').not().isEmpty(),
    check('id','El id ingresado no es correcto').isMongoId(),
    check('collection').custom(c => allowedColecction(c, ['users','products'])),
    validarCampos
],
    getFile);

module.exports = router;  