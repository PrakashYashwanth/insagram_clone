const jwt = require('jsonwebtoken')

const secret = process.env.SECRET // Access the SECRET variable

function verifyToken(req, res, next) {
  const token = req.header('Authorization')
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - No token provided' })
  }

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized - Invalid token' })
    }

    req.user = decoded
    next()
  })
}

module.exports = verifyToken
