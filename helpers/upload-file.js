const path = require('path');
const { v4: uuidv4 } = require('uuid');

const subirArchivo = (files, extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'], folder = '') => {

    return new Promise((resolve, reject) => {
        const { file } = files;

        //OBTENEMOS EXTENSION DEL ARCHIVO
        const nombreCortado = file.name.split('.');
        const extensionArchivo = nombreCortado[nombreCortado.length - 1];
    
        //VALIDAMOS EXTENSION RECIBIDA
        if (!extensionesValidas.includes(extensionArchivo)){

            return reject(`La extension ${extensionArchivo} no es valida, las extensiones validas son: ${extensionesValidas}`);
        }
    
    
        const nameTemp = uuidv4()+'.'+extensionArchivo;
        const uploadPath = path.join( __dirname , '../uploads/',folder, nameTemp);
    
        file.mv(uploadPath, (err)=> {
            if (err) {
                return reject(err);
            }
            resolve(nameTemp);
        });
        
    });
 
   

}

module.exports = {
    subirArchivo
}