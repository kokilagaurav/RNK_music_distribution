const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/signup', async (req, res) => {
    try {
        const { email } = req.body;
        console.log('Signup attempt for email:', email);

        const userExists = await User.findOne({ email: email.toLowerCase() });
        
        if (userExists) {
            console.log('User already exists with email:', email);
            return res.status(400).json({ message: 'An account with this email already exists' });
        }

        // Create new user with lowercase email
        const userData = {
            ...req.body,
            email: email.toLowerCase()
        };

        const user = await User.create(userData);
        console.log('New user created:', user._id);

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        res.status(201).json({ token, message: 'Account created successfully' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Server error during signup', error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt for email:', email);

        const user = await User.findOne({ email: email.toLowerCase() });
        
        if (!user) {
            console.log('No user found with email:', email);
            return res.status(400).json({ message: 'No account found with this email' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Invalid password for email:', email);
            return res.status(400).json({ message: 'Invalid password' });
        }

        console.log('Successful login for user:', user._id);
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        res.json({ token, message: 'Login successful' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login', error: error.message });
    }
});

// Test route to check existing users
router.get('/check-email/:email', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email.toLowerCase() });
        res.json({ exists: !!user });
    } catch (error) {
        res.status(500).json({ message: 'Error checking email' });
    }
});

module.exports = router;
