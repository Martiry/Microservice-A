const axios = require('axios');

async function testLogin() {
  try {
    const response = await axios.post('http://localhost:3000/api/login', {
      username: 'testuser',
      password: 'password123'
    }, {
      withCredentials: true
    });

    console.log('✅ Login Response:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('❌ Login Failed:', error.response.data);
    } else {
      console.error('❌ Error:', error.message);
    }
  }
}

async function testLogout() {
  try {
    const response = await axios.post('http://localhost:3000/api/logout', {}, {
      withCredentials: true
    });

    console.log('🚪 Logout Response:', response.data);
  } catch (error) {
    console.error('❌ Logout Error:', error.message);
  }
}



testLogin();
// You can chain logout later after login succeeds if you'd like
