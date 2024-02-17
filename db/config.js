const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CNN, {});
        console.log('Base de datos conectada');
    } catch (e) {
        throw new Error('Error al conectar la base de datos ', e)
    }
}

module.exports = {
    dbConnection
}