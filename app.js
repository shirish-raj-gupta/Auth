const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const userModel = require('./models/user');
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Registration Route
app.get('/register', (req, res) => {
  res.send('Register Yourself First');
});

app.post('/register', async (req, res) => {
  try {
    let { username, password, phone, email } = req.body;

    // Validation
    if (!username || !password || !phone || !email) {
      return res.status(400).send('All fields are required');
    }

    let existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).send('User already exists');
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    let user = await userModel.create({
      username,
      email,
      phone,
      password: hashedPassword,
    });
    
    res.status(201).send('User registered successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Login Route
app.get('/login', (req, res) => {
  res.send('Login Yourself First');
});

app.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).send('Email and password are required');
    }
    
    let user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).send('Invalid email or password');
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Invalid email or password');
    }

    res.send('You can login!!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});