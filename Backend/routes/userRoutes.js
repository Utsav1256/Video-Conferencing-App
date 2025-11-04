const express = require('express');
const User = require('../Models/User');
const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const user = await User.create({ name, email, password });
        res.status(201).json({ message: 'User created successfully', user });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
