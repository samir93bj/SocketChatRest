const { Router } = require('express');
const { check } = require('express-validator');

/*
const {
  validarcampos, 
  validajwt,
  validarroles
} = require('../middlewares');
*/

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/valida-jwt');
const { esAdminRole } = require('../middlewares/validar_roles');


const {usuariosGet ,
      usuariosPost,
      usuariosPut,
      usuariosDelete,
      usuariosPatch} = require('../controllers/users');

const { esRoleValido , mailExistente, idExistente } = require('../helpers/db-validators');

const router = new Router();

//Route GET
router.get('/', usuariosGet);

//Route PUT
router.put('/:id',[
    check('id','No es un ID valido').isMongoId(),
    check('id').custom(idExistente),
    check('rol').custom(esRoleValido),
    validarCampos
  ] ,usuariosPut);
 

//Route Post
router.post('/',
  //Middleware para end point
      [
      check('name','El nombre es obligatorio').not().isEmpty(),
      check('password','El password debe de ser mas de 6 letras').isLength({min:6}),
      check('email', 'El correo no es válido').isEmail(),
      check('email').custom(mailExistente),
      //Verificamos el rol contra la DB
      check('rol').custom(esRoleValido),
      validarCampos
  ], usuariosPost);


//Route Delete
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id','No es un ID valido').isMongoId(),
    check('id').custom(idExistente),
    validarCampos
], usuariosDelete
);

//Route Patach
router.patch('/', usuariosPatch);

module.exports = router; 