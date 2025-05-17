const fs = require('fs');
const path = require('path');
const asyncHandler = require('express-async-handler');

let sessions = {};

function loadUsers() {
  const data = fs.readFileSync(path.join(__dirname, 'users.json'));
  return JSON.parse(data);
}

const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const users = loadUsers();
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    const token = Math.random().toString(36).substring(2);
    sessions[username] = token;
    res.json({ status: "success", message: "Login successful", token });
  } else {
    res.status(401).json({ status: "fail", message: "Invalid credentials" });
  }
});

const logout = asyncHandler(async (req, res) => {
  const { username } = req.body;
  if (sessions[username]) {
    delete sessions[username];
    res.json({ status: "success", message: "Logout successful" });
  } else {
    res.status(400).json({ status: "fail", message: "User not logged in" });
  }
});

module.exports = { login, logout };