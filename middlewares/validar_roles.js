const { response } = require("express");

const esAdminRole = (req, res = response, next) => {
   // console.log(req.uid);

    if( !req.uid ){

        return res.status(500).send({
            msg: 'Se requiere validar el token primero.'
        })
    }
        const { rol, name } = req.uid;

        if(rol !== 'ADMIN_ROLE'){
            return res.status(401).send({
                msg: `${name} no es administrador - No puede hacer esto`
        }) 
        }

    next();
}

module.exports = {
    esAdminRole
}