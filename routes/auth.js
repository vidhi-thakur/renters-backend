const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const SECRET_KEY = process.env.JWT_SECRET;

router.post('/', (req, res) => {
    const { username, password } = req.body;

    // Hardcoded user 
    if (username === 'admin' && password === 'admin123') {
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '2h' });
        return res.json({ user_token: token, user_role: 'admin' });
    }

    res.status(401).json({ message: 'Invalid credentials' });
});

module.exports = router;
