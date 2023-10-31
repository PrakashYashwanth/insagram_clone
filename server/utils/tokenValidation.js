const jwt = require('jsonwebtoken')

const secret = process.env.SECRET // Access the SECRET variable

function verifyToken(req, res, next) {
  const token = req.header('Authorization')
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - No token provided' })
  }

  const jwtVal = token.split(' ')[1]

  jwt.verify(jwtVal, secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized - Invalid token' })
    }
    req.user = decoded
    next()
  })
}

module.exports = verifyToken
