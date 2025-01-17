const { Schema, model } = require('mongoose');

// Define the schema for the User model
const UserSchema = Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

module.exports = model('User', UserSchema);