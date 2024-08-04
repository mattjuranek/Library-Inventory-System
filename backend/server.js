require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./db')
const User = require('./User')
const Book = require('./Book')
const Movie = require('./Movie')
const Event = require('./Event')
const Admin = require('./Admin')
const Employee = require('./Employee')
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
  const { username, password, role } = req.body
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
      const admin = await Admin.findOne({ username })
      const employee = await Employee.findOne({ username })
      
      let account, role
      if(admin){
        account = admin
        role ='admin'
      }else if(employee){
        account = employee
        role = 'employee'
      }else{
        account = user
        role = 'user'
      }

      if (!account) {
        return res.status(400).send('Cannot find user')
      }
  
      // Compare password with hashed password
      const isMatch = await bcrypt.compare(password, account.password)
      if (!isMatch) {
        return res.status(401).send('Invalid credentials')
      }

      const accessToken = jwt.sign({ username: account.username, role}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' })
      const refreshToken = jwt.sign({ username: account.username, role}, process.env.REFRESH_TOKEN_SECRET)
      refreshTokens.push(refreshToken)
  
      res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'Strict' })
      res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'Strict' })
      res.json({ accessToken, refreshToken})
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

app.post('/events', async (req, res) => {
  const { title, description, image, time, date } = req.body;
  console.log('Event to add:', title);
  try {
    const existingEvent = await Event.findOne({ title, date });
    console.log('Check for existing event:', existingEvent);
    if (existingEvent) {
      return res.status(400).json({ message: 'Event already exists' });
    }

    const newEvent = new Event({ title, description, image, time, date });
    const savedEvent = await newEvent.save();
    console.log('New event added:', savedEvent);
    res.status(201).json({ message: 'Event added', event: savedEvent });
  } catch (err) {
    console.error('Error adding event:', err.message, err.stack);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.get('/catalog', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

//Add admin account from existing admin account
app.post('/admin', async(req,res)=>{
  const{username, password} = req.body
  console.log("Username to register as admin: ", username);

  try{
    //check if admin account already exists
    const existingAdmin = await Admin.findOne({username})
    console.log('Check for existing admin:', existingAdmin)
    if(existingAdmin){
      return res.status(400).json({message: 'Admin account already exists'})
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    //create new admin and save to database
    const newAdmin = new Admin({username, password: hashedPassword})
    const savedAdmin = await newAdmin.save()
    console.log("New admin registered:", savedAdmin)
    res.status(201).json({message: "Admin account added successfully"})
  }catch(err){
    console.error("Error registering admin:", err.message)
    res.status(500).json({message: "Server Error", error: err.message})
  }
})

//Add employee account from existing admin account 
app.post('/employee', async(req,res)=>{
  const{username, password} = req.body
  console.log("Username to register as employee: ", username)

  try{
    //check if employee account with that usernam already exists
    const existingEmployee = await Employee.findOne({username})
    console.log("Checking for existing employee: ", existingEmployee)
    if(existingEmployee){
      return res.status(400).json({message: 'Employee account already exists'})
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    //create new employee account and save to employee database
    const newEmployee = new Employee({username, password: hashedPassword})
    const savedEmployee = await newEmployee.save()
    console.log("New Employee registered: ", savedEmployee)
    res.status(201).json({message: "Employee account added successfully"})
  }catch(err){
    consol.error("Error registering employee:", err.message)
    res.status(500).json({message: "Server Error", error: err.message})
  }
})

//add member account from employee or admin account
app.post('/user', async(req,res)=>{
  const{username, password} = req.body
  console.log("Username to register as member: ", username)

  try{
    //check if employee account with that usernam already exists
    const existingUser = await User.findOne({username})
    console.log("Checking for existing employee: ", existingUser)
    if(existingUser){
      return res.status(400).json({message: 'Member account already exists'})
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    //create new employee account and save to employee database
    const newUser = new User({username, password: hashedPassword})
    const savedUser = await newUser.save()
    console.log("New user registered: ", savedUser)
    res.status(201).json({message: "User account added successfully"})
  }catch(err){
    consol.error("Error registering user:", err.message)
    res.status(500).json({message: "Server Error", error: err.message})
  }
})

//delete user and employee but not admin
app.delete('/member/:username', async (req, res) => {
  const { username } = req.params

  try {
    // check for and delete user account from database
    const deletedUser = await User.findOneAndDelete({ username })
    if (deletedUser) {
      return res.json({ message: 'User deleted successfully' })
    }

    // check if employee account
    const existingEmployee = await Employee.findOneAndDelete({ username })
    if (existingEmployee) {
      return res.json({ message: 'Employee deleted successfully' });
    }

    // check if admin account
    const existingAdmin = await Admin.findOne({ username })
    if (existingAdmin) {
      return res.status(403).json({ message: 'Unable to delete admin accounts!' });
    }

    res.status(404).json({ message: 'Account not found' })
  } catch (err) {
    console.error('Error deleting account:', err.message)
    res.status(500).json({ message: 'Server error' })
  }
})


//remove book
app.delete('/books', async (req, res) => {
  const { title, author } = req.body
  console.log('Book to remove:', title)

  try {
    const deletedBook = await Book.findOneAndDelete({ title, author })
    console.log('Check for existing book:', deletedBook)

    if (!deletedBook) {
      return res.status(404).json({ message: 'Book not found' })
    }

    console.log('Book removed:', deletedBook)
    res.json({ message: 'Book removed successfully', book: deletedBook })
  } catch (err) {
    console.error('Error removing book:', err.message)
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})


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

// Add new book to catalog
app.post('/books', async (req, res) => {
  const { title, author, location, genre, description, quantity } = req.body;
  console.log('Book to add:', title);
  try {
    const existingBook = await Book.findOne({ title, author });
    console.log('Check for existing book:', existingBook);
    if (existingBook) {
      return res.status(400).json({ message: 'Book already exists' });
    }

    const newBook = new Book({ title, author, location, genre, description, quantity });
    const savedBook = await newBook.save();
    console.log('New book added:', savedBook);
    res.status(201).json({ message: 'Book added', book: savedBook });
  } catch (err) {
    console.error('Error adding book:', err.message, err.stack);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.get('/books/search', async (req, res) => {
  const { title, author, location, genre, quantity } = req.query;
  let filter = {};

  if (title) {
    filter.title = { $regex: title, $options: 'i' };
  }
  if (author) {
    filter.author = { $regex: author, $options: 'i' };
  }
  if (location) {
    filter.location = { $regex: location, $options: 'i' };
  }
  if (genre) {
    filter.genre = { $regex: genre, $options: 'i' };
  }
  if (quantity) {
    filter.quantity = { $gte: parseInt(quantity, 10) };
  }

  try {
    const books = await Book.find(filter);
    res.json(books);
  } catch (err) {
    console.error('Error searching books:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.put('/books', async (req, res) => {
  const { title, author, newTitle, newAuthor, location, genre, description, quantity, status } = req.body;

  if (!newTitle && !newAuthor && !location && !genre && !description && !quantity && !status) {
    return res.status(400).json({ message: 'Please input information to update!' });
  }

  const updateFields = {};
  if (newTitle) updateFields.title = newTitle;
  if (newAuthor) updateFields.author = newAuthor;
  if (location) updateFields.location = location;
  if (genre) updateFields.genre = genre;
  if (description) updateFields.description = description;
  if (quantity) updateFields.quantity = quantity;
  if (status) updateFields.status = status;

  try {
    const updatedBook = await Book.findOneAndUpdate(
      { title, author },
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json({ message: 'Book updated successfully', book: updatedBook });
  } catch (err) {
    console.error('Error updating book:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.post('/movies', async (req, res) => {
  const { title, author, location, genre, description, quantity } = req.body;
  console.log('Movie to add:', title);
  try {
    const existingMovie = await Movie.findOne({ title, author });
    console.log('Check for existing movie:', existingMovie);
    if (existingMovie) {
      return res.status(400).json({ message: 'Movie already exists' });
    }

    const newMovie = new Movie({ title, author, location, genre, description, quantity });
    const savedMovie = await newMovie.save();
    console.log('New movie added:', savedMovie);
    res.status(201).json({ message: 'Movie added', movie: savedMovie });
  } catch (err) {
    console.error('Error adding movie:', err.message, err.stack);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

//remove movie
app.delete('/movies', async (req, res) => {
  const { title, author} = req.body;
  console.log('Movie to remove:', title)

  try {
    const deletedMovie = await Movie.findOneAndDelete({ title, author })
    console.log('Check for existing movie:', deletedMovie)

    if (!deletedMovie) {
      return res.status(404).json({ message: 'Movie not found' })
    }

    console.log('Movie removed:', deletedMovie)
    res.status(201).json({ message: 'Movie removed successfully', movie: deletedMovie })
  } catch (err) {
    console.error('Error removing movie:', err.message)
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

app.get('/movies/search', async (req, res) => {
  const { title, author, location, genre, quantity } = req.query;
  let filter = {};

  if (title) {
    filter.title = { $regex: title, $options: 'i' };
  }
  if (author) {
    filter.author = { $regex: author, $options: 'i' };
  }
  if (location) {
    filter.location = { $regex: location, $options: 'i' };
  }
  if (genre) {
    filter.genre = { $regex: genre, $options: 'i' };
  }
  if (quantity) {
    filter.quantity = { $gte: parseInt(quantity, 10) };
  }

  try {
    const movies = await Movie.find(filter);
    res.json(movies);
  } catch (err) {
    console.error('Error searching movies:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// update movie details
app.put('/movies', async (req, res) => {
  const { title, author, newTitle, newAuthor, location, genre, description, quantity } = req.body;

  if (!newTitle && !newAuthor && !location && !genre && !description && !quantity) {
    return res.status(400).json({ message: 'Please input information to update!' });
  }

  const updateFields = {};
  if (newTitle) updateFields.title = newTitle;
  if (newAuthor) updateFields.author = newAuthor;
  if (location) updateFields.location = location;
  if (genre) updateFields.genre = genre;
  if (description) updateFields.description = description;
  if (quantity) updateFields.quantity = quantity;

  try {
    const updatedMovie = await Movie.findOneAndUpdate(
      { title, author },
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedMovie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.status(200).json({ message: 'Movie updated successfully', movie: updatedMovie });
  } catch (err) {
    console.error('Error updating movie:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


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