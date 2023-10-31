const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = express.Router()
const User = require('../models/userModel') // Import the User model

const secret = process.env.SECRET // Access the SECRET variable

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body

    // Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] })
    if (existingUser) {
      return res
        .status(409)
        .json({ error: 'User with the same username or email already exists' })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create a new user
    const newUser = new User({ username, email, password: hashedPassword })
    await newUser.save()

    res.status(201).json(newUser)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to register a user' })
  }
})

// User login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body

    // Find the user by username
    const user = await User.findOne({ username })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Compare the provided password with the hashed password
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid password' })
    }

    // Generate a JWT token for authentication
    const token = jwt.sign({ userId: user._id }, secret, {
      expiresIn: '15m'
    })

    res.json({ userId: user._id, username: user.username, token })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to login' })
  }
})

// Get user profile
router.get('/profile/:userId', async (req, res) => {
  try {
    const userId = req.params.userId

    // Find the user by ID and populate their posts
    const user = await User.findById(userId).populate('posts')
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch user profile' })
  }
})

module.exports = router
