const express = require('express');
const router = express.Router();
const Register = require('../models/registerModel'); 

router.post('/', async (req, res) => {
    try {
        const newUser = new Register(req.body); 
        await newUser.save(); 
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to register user.' });
    }
});

module.exports = router;