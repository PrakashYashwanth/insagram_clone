const express = require('express')
const router = express.Router()

// Import user and post routes
const userRoutes = require('./users')
const postRoutes = require('./posts')

// Use the user and post routes
router.use('/users', userRoutes)
router.use('/posts', postRoutes)

module.exports = router
