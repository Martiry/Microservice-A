const express = require('express');
const bodyParser = require('body-parser');
const { login, logout, rememberMe } = require('./authController');
const { validateToken } = require('./authMiddleware');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.post('/api/login', login);
app.post('/api/logout', validateToken, logout);
app.post('/api/remember-me', rememberMe)

app.listen(PORT, () => {
  console.log(`Auth microservice running on http://localhost:${PORT}`);
});
