const http = require('http');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Otp = require('../models/otpModel');

function makeRequest(urlPath, method, data) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: urlPath,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function testFullAuthFlow() {
  await mongoose.connect(process.env.MONGO_URI);

  console.log('--- 1. Testing Signup (/api/signup) ---');
  const testEmail = `testuser_${Date.now()}@example.com`;
  const signupRes = await makeRequest('/api/signup', 'POST', {
    fullName: 'Integration Test User',
    email: testEmail,
    password: 'Password123!',
    confirmPassword: 'Password123!'
  });
  console.log('Signup Status:', signupRes.status);
  console.log('Signup Result:', signupRes.data);

  console.log('\n--- 2. Testing Login (/api/login) ---');
  const loginRes = await makeRequest('/api/login', 'POST', {
    email: testEmail,
    password: 'Password123!'
  });
  console.log('Login Status:', loginRes.status);
  console.log('Login Result:', loginRes.data);

  console.log('\n--- 3. Testing Forgot Password (/api/forgot-password) ---');
  const forgotRes = await makeRequest('/api/forgot-password', 'POST', {
    email: testEmail
  });
  console.log('Forgot Password Status:', forgotRes.status);
  console.log('Forgot Password Result:', forgotRes.data);

  // Retrieve generated OTP from MongoDB to verify
  const otpRecord = await Otp.findOne({ email: testEmail });
  console.log('\nSaved OTP in MongoDB:', otpRecord ? otpRecord.otp : 'NOT FOUND');

  if (otpRecord) {
    console.log('\n--- 4. Testing Verify OTP (/api/verify-otp) ---');
    const verifyRes = await makeRequest('/api/verify-otp', 'POST', {
      email: testEmail,
      otp: otpRecord.otp
    });
    console.log('Verify OTP Status:', verifyRes.status);
    console.log('Verify OTP Result:', verifyRes.data);

    console.log('\n--- 5. Testing Reset Password (/api/reset-password) ---');
    const resetRes = await makeRequest('/api/reset-password', 'POST', {
      email: testEmail,
      newPassword: 'NewPassword456!',
      confirmPassword: 'NewPassword456!'
    });
    console.log('Reset Password Status:', resetRes.status);
    console.log('Reset Password Result:', resetRes.data);

    console.log('\n--- 6. Testing Login with New Password (/api/login) ---');
    const newLoginRes = await makeRequest('/api/login', 'POST', {
      email: testEmail,
      password: 'NewPassword456!'
    });
    console.log('New Login Status:', newLoginRes.status);
    console.log('New Login Result:', newLoginRes.data);
  }

  await mongoose.disconnect();
}

testFullAuthFlow().catch(err => {
  console.error(err);
  process.exit(1);
});
