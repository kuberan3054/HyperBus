const express = require('express');
const Register = require('../models/registerModel'); 
const router = express.Router();

router.post('/', async (req, res) => {
    const id  = req.body;

    try {
        const student = await Register.findOne({ id });

        if (!student) {
            return res.status(401).json({ message: 'No such student' });
        }
        if (password !== student.password) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        return res.status(200).json({ name : student.name});
        
    } catch (error) {
        console.error('Login error:', error); 
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;