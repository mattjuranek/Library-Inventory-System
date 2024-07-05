require('dotenv').config()
const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('./User')

app.use(express.json())

app.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findOne({ username: req.user.name });
        if (!user) return res.sendStatus(404);
        res.json({ username: user.username });
    } catch (error) {
        res.status(500).send('Error fetching user profile');
    }
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

app.listen(5001)
