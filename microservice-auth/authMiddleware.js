// authMiddleware.js
const sessions = require('./sessions'); // We'll create this shortly to share session data

function validateToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ status: 'fail', message: 'No token provided' });
  }

  // Check if token exists in sessions (reverse lookup)
  const username = Object.keys(sessions).find(user => sessions[user] === token);

  if (!username) {
    return res.status(401).json({ status: 'fail', message: 'Invalid or expired token' });
  }

  // Attach username to request for further use
  req.username = username;

  next();
}

module.exports = { validateToken };
