const { getSessions } = require('./sessions'); // adjust path if needed

function validateToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ status: 'fail', message: 'No token provided or malformed' });
  }

  const token = authHeader.split(' ')[1];

  console.log('🔐 Incoming Authorization Header:', authHeader);
  console.log('🔐 Extracted token:', token);

  const sessions = getSessions();
  console.log('🔐 Sessions object:', sessions);

  const now = Date.now();
  const username = Object.keys(sessions).find(user => {
    const session = sessions[user];
    console.log(`🔍 Checking user: ${user}, token: ${session.token}, expiresAt: ${session.expiresAt}`);
    return session.token === token && session.expiresAt > now;
  });

  console.log('✅ Token belongs to:', username);

  if (!username) {
    return res.status(401).json({ status: 'fail', message: 'Invalid or expired token' });
  }

  req.username = username;
  next();
}

module.exports = { validateToken };
