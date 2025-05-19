const fs = require('fs');
const path = require('path');
const asyncHandler = require('express-async-handler');
const { setSession, deleteSession, getSessions } = require('./sessions');

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

    setSession(username, { token, expiresIn });

    res.json({ status: "success", message: "Login successful", token, expiresIn });
  } else {
    res.status(401).json({ status: "fail", message: "Invalid credentials" });
  }
});

const logout = asyncHandler(async (req, res) => {
  const username = req.username; // from middleware
  const sessions = getSessions();

  console.log('🔐 Logging out:', username);
  console.log('📂 Current sessions before logout:', sessions);

  if (sessions[username]) {
    deleteSession(username);
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

  const sessions = getSessions();
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
