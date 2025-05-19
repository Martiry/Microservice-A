# Microservice Auth - Communication Contract

## Overview

This microservice provides authentication endpoints to log users in, log out, and validate sessions with token-based authentication. It uses JSON over HTTP and expects requests/responses in JSON format.

---

## How to Request
To log in a user, send a POST request to /api/login with a JSON body that includes a username, password, and an optional rememberMe flag (true or false).
To log out, send a POST request to /api/logout with a valid Authorization header (Bearer <token>).
To validate a "remember me" session, send a POST request to /api/remember-me with a JSON body containing the token.

***Example Call (Login)***
---
```js
const axios = require('axios');

const loginPayload = {
  username: 'testuser',
  password: 'password123',
  rememberMe: true
};

const response = await axios.post('http://localhost:3000/api/login', loginPayload);
console.log(response.data); // { status: 'success', message: 'Login successful', token, expiresIn }
```
---
## How to Receive
To receive data from the microservice, read the JSON response returned by your request. For login, the microservice will respond with a token and expiresIn. For logout and remember-me validation, it will respond with status messages.

***Example Call (RememberMe)***
---
```js
const rememberPayload = {
  token: 'abc123token'
};

const response = await axios.post('http://localhost:3000/api/remember-me', rememberPayload);
console.log(response.data); 
// Example: { status: 'success', message: 'Session valid', username: 'testuser', expiresIn: 604800000 }
```

---
# UML Sequence Diagram
![uml](https://github.com/user-attachments/assets/ef05b4c9-cfbf-4808-b82a-220c03c0eee3)
