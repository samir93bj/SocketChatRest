const  validarcampos  = require('../middlewares/validar-campos');
const  validajwt  = require('../middlewares/valida-jwt');
const  validarroles  = require('../middlewares/validar_roles');

module.exports = {
    ...validarcampos, 
    ...validajwt,
    ...validarroles
}