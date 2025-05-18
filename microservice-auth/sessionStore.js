const fs = require('fs');
const path = require('path');

const SESSION_FILE = path.join(__dirname, 'sessions.json');

function loadSessions() {
  if (!fs.existsSync(SESSION_FILE)) return {};
  const data = fs.readFileSync(SESSION_FILE);
  return JSON.parse(data);
}

function saveSessions(sessions) {
  fs.writeFileSync(SESSION_FILE, JSON.stringify(sessions, null, 2));
}

module.exports = { loadSessions, saveSessions };
