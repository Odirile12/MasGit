const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post('/api/auth/signup', (req, res) => {
  console.log('Signup attempt:', req.body);
  
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required'
    });
  }
  
  res.json({
    success: true,
    message: 'User created successfully',
    user: {
      id: Math.floor(Math.random() * 1000),
      username: username,
      email: email,
      token: 'dummy-jwt-token-' + Date.now()
    }
  });
});

app.post('/api/auth/signin', (req, res) => {
  console.log('Signin attempt:', req.body);
  
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }
  
  res.json({
    success: true,
    message: 'Login successful',
    user: {
      id: 123,
      username: email.split('@')[0],
      email: email,
      token: 'dummy-jwt-token-' + Date.now()
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});