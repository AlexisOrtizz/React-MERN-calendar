const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        await mongoose.connect( process.env.DB_CNN );
        console.info('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
        throw new Error('Failed to connect to MongoDB');
    }
};

module.exports = {
    dbConnection
};