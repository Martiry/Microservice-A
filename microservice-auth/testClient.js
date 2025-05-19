const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

const testUser1 = {
  username: 'testuser',
  password: 'password123',
  rememberMe: true
};

const testUser2 = {
  username: 'user2',
  password: 'wrongpassword',
  rememberMe: true
};

const testUser2Correct = {
  username: 'user2',
  password: 'password2',
  rememberMe: true
};

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testAuthFlow() {
  try {
    console.log('1️⃣ Logging in testUser1...');
    const loginRes1 = await axios.post(`${BASE_URL}/login`, testUser1);
    console.log('✅ testUser1 Login Response:', loginRes1.data);
    const token1 = loginRes1.data.token;

    await delay(1500);

    console.log('2️⃣ Validating testUser1 with remember-me token...');
    const rememberRes1 = await axios.post(`${BASE_URL}/remember-me`, { token: token1 });
    console.log('✅ testUser1 Remember Me Validated:', rememberRes1.data);

    await delay(1000);

    console.log('3️⃣ Attempting login with user2 (expect fail)...');
    try {
      await axios.post(`${BASE_URL}/login`, testUser2);
      console.log('❌ ERROR: user2 login succeeded unexpectedly with wrong password');
    } catch (err) {
      console.log('✅ user2 Login Failed as expected:', err.response.data);
    }

    await delay(1000);

    console.log('4️⃣ Logging out testUser1...');
    const logoutRes1 = await axios.post(`${BASE_URL}/logout`, {}, { headers: { Authorization: `Bearer ${token1}` } });
    console.log('✅ testUser1 Logout Response:', logoutRes1.data);


    await delay(1000);

    console.log('5️⃣ Validating testUser1 token after logout (should fail)...');
    try {
      await axios.post(`${BASE_URL}/remember-me`, { token: token1 });
      console.log('❌ ERROR: testUser1 session still valid after logout');
    } catch (err) {
      console.log('✅ testUser1 Remember Me Failed as expected:', err.response.data);
    }

    await delay(1000);

    console.log('6️⃣ Logging in user2 with correct password...');
    const loginRes2 = await axios.post(`${BASE_URL}/login`, testUser2Correct);
    console.log('✅ user2 Login Response:', loginRes2.data);
    const token2 = loginRes2.data.token;

    await delay(1000);

    console.log('7️⃣ Validating user2 with remember-me token...');
    const rememberRes2 = await axios.post(`${BASE_URL}/remember-me`, { token: token2 });
    console.log('✅ user2 Remember Me Validated:', rememberRes2.data);

  } catch (error) {
    if (error.response) {
      console.error('❌ Request Error:', error.response.data);
    } else {
      console.error('❌ Network/Error:', error.message);
    }
  }
}

testAuthFlow();