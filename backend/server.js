require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./db')
const User = require('./User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const app = express()

connectDB()

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))

app.use(bodyParser.json())
app.use(cookieParser())

let refreshTokens = []

// Register new user
app.post('/register', async (req, res) => {
  const { username, password } = req.body
  console.log('Username to register:', username)
  try {
    // Check if user already exists database
    const existingUser = await User.findOne({ username })
    console.log('Check for existing user:', existingUser)
    if (existingUser) {
      return res.status(400).send('User already exists')
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user and save to database
    const newUser = new User({ username, password: hashedPassword })
    const savedUser = await newUser.save()
    console.log('New user registered:', savedUser)
    res.status(201).send('User registered')
  } 
  catch (err) {
    console.error('Error registering user:', err.message)
    res.status(500).send('Server error')
  }
})

// Login existing user
app.post('/login', async (req, res) => {
    const { username, password } = req.body
    try {
      // Search for user
      const user = await User.findOne({ username })
      if (!user) {
        return res.status(400).send('Cannot find user')
      }
  
      // Compare password with hashed password
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return res.status(401).send('Invalid credentials')
      }
  
      const accessToken = jwt.sign({ username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' })
      const refreshToken = jwt.sign({ username: user.username }, process.env.REFRESH_TOKEN_SECRET)
      refreshTokens.push(refreshToken)
  
      res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'Strict' })
      res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'Strict' })
      res.json({ accessToken, refreshToken })
    } 
    catch (err) {
      console.error('Error logging in user:', err.message)
      res.status(500).send('Server error')
    }
  })
  

// Get user profile
app.get('/profile', (req, res) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) return res.sendStatus(401)
  
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    console.log("User data:", user)
    res.json(user)
  })
})

// Get calendar page
app.get('/calendar', (req, res) => {
  return nextApp.render(req, res, '/calendar', req.query)
})

app.get('/catalog', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Generate new access token
app.post('/token', (req, res) => {
  const { token } = req.body
  if (!token) return res.sendStatus(401)
  if (!refreshTokens.includes(token)) return res.sendStatus(403)
  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    const accessToken = generateAccessToken({ name: user.name })
    res.json({ accessToken })
  })
})

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' })
}

// Logout user
app.delete('/logout', (req, res) => {
  const { token } = req.body
  if (!token) return res.sendStatus(400)
  refreshTokens = refreshTokens.filter(t => t !== token)
  res.sendStatus(204)
})

const PORT = process.env.PORT || 4000

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// Shutdown
const shutdown = () => {
  server.close(() => {
    console.log('Process shut down')
    process.exit(0)
  })
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)