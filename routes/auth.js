const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/valida-jwt');

const { loginController, googleSignin, renovarToken } = require('../controllers/auth');

const router = new Router();

//Route
router.post('/login',[
    check('email','El correo es obligatorio').isEmail(),
    check('password','La contraseña es obligatorio').not().isEmpty(),
    validarCampos
], loginController);

//Route 
router.post('/google',[
    check('id_token','El token es obligatorio').not().isEmpty(),
    validarCampos
], googleSignin);

router.post('/',validarJWT, renovarToken);

module.exports = router;  
