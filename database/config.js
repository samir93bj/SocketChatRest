// getting-started.js

const mongoose = require('mongoose');

const dbConnection = async() => {

    try {
        await mongoose.connect(process.env.MONGO_CNN);

        console.log('Connect successfully')
    } catch (error) {
        console.error(error);
        throw new Error('Error en la conexion DB');
    }
}

module.exports = {
    dbConnection
};
