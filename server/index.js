const express = require('express') // Import Express

require('dotenv').config() // Load environment variables from .env

// Import your Swagger configuration
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json') // Provide the path to your YAML file

const mongoose = require('mongoose') // Import Mongoose
const morgan = require('morgan') // Import Morgan
const cors = require('cors') // Import CORS
const app = express()
const port = process.env.PORT || 3000 // Use the provided port or 3000 by default

// Serve Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// Connect to MongoDB (replace with your MongoDB connection string)
mongoose
  // If MongoDB is configured with IPV6 we can use below approach
  // .connect("mongodb://localhost:27017", {
  // In my system, MongoDB is configured to IPV4 hence using below approach to connect
  .connect('mongodb://127.0.0.1:27017/instagramclone', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error)
  })

// Use Morgan middleware for request logging (with the 'dev' format)
app.use(morgan('dev'))

// Enable CORS (you can configure it to allow specific origins)
app.use(cors())

// Parse JSON requests
app.use(express.json())

// Parse URL-encoded requests
app.use(express.urlencoded({ extended: true }))

// Import user and post routes
const userRoutes = require('./routes/users')
const postRoutes = require('./routes/posts')

// Use the user and post routes
app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)

app.get('/', (req, res) => {
  // Health check
  res.send('Hello, World!')
})

// Error handling middleware
app.use((err, req, res, next) => {
  // Handle and log the error
  console.error(err)

  // Determine the response status code based on the error
  let statusCode = 500
  if (err.status) {
    statusCode = err.status
  }

  // Respond with an appropriate error message
  res.status(statusCode).json({ error: err.message })
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
