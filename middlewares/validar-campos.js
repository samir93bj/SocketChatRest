const { validationResult } = require('express-validator');

const validarCampos = (req, res, next) =>{
  
    const errors = validationResult(req);
     if(!errors.isEmpty()) {
        return res.status(400).json(errors);
        }
        next(); //Esta funcion del middleware le dice que no cayo en el error debe continuar con el siguiente middleware

    }

module.exports = {
    validarCampos,
}