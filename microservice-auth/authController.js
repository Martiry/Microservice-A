const fs = require('fs');
const path = require('path');
const asyncHandler = require('express-async-handler');

const SESSION_FILE = path.join(__dirname, 'sessions.json');

let sessions = {};
function loadSessions() {
  if (fs.existsSync(SESSION_FILE)) {
    try {
      const data = fs.readFileSync(SESSION_FILE);
      sessions = JSON.parse(data);
    } catch (err) {
      console.error('Failed to load sessions.json, starting with empty sessions:', err);
      sessions = {};
    }
  }
}

function saveSessions() {
  fs.writeFileSync(SESSION_FILE, JSON.stringify(sessions, null, 2));
}

loadSessions();

function loadUsers() {
  const data = fs.readFileSync(path.join(__dirname, 'users.json'));
  return JSON.parse(data);
}

const login = asyncHandler(async (req, res) => {
  const { username, password, rememberMe } = req.body;
  const users = loadUsers();
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    const token = Math.random().toString(36).substring(2);
    const expiresIn = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000; // 7 days vs 1 hour

    sessions[username] = {
      token,
      expiresAt: Date.now() + expiresIn,
    };
    saveSessions();

    res.json({ status: "success", message: "Login successful", token, expiresIn });
  } else {
    res.status(401).json({ status: "fail", message: "Invalid credentials" });
  }
});

const logout = asyncHandler(async (req, res) => {
  const { username } = req.body;
  if (sessions[username]) {
    delete sessions[username];
    saveSessions();
    res.json({ status: "success", message: "Logout successful" });
  } else {
    res.status(400).json({ status: "fail", message: "User not logged in" });
  }
});

const rememberMe = asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ status: "fail", message: "Token is required" });
  }

  const now = Date.now();
  const username = Object.keys(sessions).find(
    user => sessions[user].token === token && sessions[user].expiresAt > now
  );

  if (username) {
    const expiresIn = sessions[username].expiresAt - now;
    res.json({ status: "success", message: "Session valid", username, expiresIn });
  } else {
    res.status(401).json({ status: "fail", message: "Invalid or expired session" });
  }
});

module.exports = { login, logout, rememberMe };
