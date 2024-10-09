const mongoose = require('mongoose');

const registerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phoneNumber1: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    admin: { type: String,  }
});

const Register = mongoose.model('Register', registerSchema);

module.exports = Register;