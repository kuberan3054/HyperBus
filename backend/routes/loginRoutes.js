const express = require('express');
const Register = require('../models/registerModel'); 
const router = express.Router();

router.post('/', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const passenger = await Register.findOne({ email });

        if (!passenger) {
            return res.status(401).json({ message: 'No such passenger' });
        }
        if (password !== passenger.password) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        return res.status(200).json({ message: 'Login successful' , identity:passenger._id, admin:passenger.admin});
        
    } catch (error) {
        console.error('Login error:', error); 
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;