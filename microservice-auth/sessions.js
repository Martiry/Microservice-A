const fs = require('fs');
const path = require('path');

const SESSIONS_FILE = path.join(__dirname, 'sessions.json');

// Helper: read sessions from file safely
function readSessions() {
  try {
    const data = fs.readFileSync(SESSIONS_FILE, 'utf8');
    return JSON.parse(data || '{}');
  } catch (err) {
    // If file doesn't exist or is invalid, start fresh
    return {};
  }
}

// Helper: write sessions to file safely
function writeSessions(sessions) {
  fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2), 'utf8');
}

// Set a session for a username with token and expiry timestamp
function setSession(username, { token, expiresIn }) {
  const sessions = readSessions();

  sessions[username] = {
    token,
    expiresAt: Date.now() + expiresIn
  };

  writeSessions(sessions);
}

// Delete a session for a username
function deleteSession(username) {
  const sessions = readSessions();
  if (sessions[username]) {
    delete sessions[username];
    writeSessions(sessions);
  }
}

// Get all sessions (useful for validation)
function getSessions() {
  return readSessions();
}

module.exports = {
  setSession,
  deleteSession,
  getSessions,
};
