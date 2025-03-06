const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const VerificationToken = require('../models/verificationToken');
const crypto = require('crypto'); // ✅ Make sure this line is present!
const userModel = require('../models/user');

const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex'); // ✅ Generate a 32-byte token
};



const register = async (req, res) => {
  try {
    let { email, fullname, password } = req.body;

    if (!email || !fullname || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    email = email.toLowerCase(); // Normalize email

    let existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let user = await userModel.create({ email, fullname, password: hashedPassword });

    // Generate verification token
    const token = generateVerificationToken();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // Token expires in 15 minutes

    // Save the token in the database
    await VerificationToken.create({ userId: user._id, token, expiresAt });

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Check your email for verification.',
      verificationToken: token, // Send token for testing
      expiresAt,
      user: { id: user._id, email: user.email, fullname: user.fullname },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};


const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    let user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ 
      success: true, 
      message: 'Login successful', 
      token, 
      user: { id: user._id, email: user.email, fullname: user.fullname } 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};


const logout = (req, res) => {
  res.cookie('token', '', { expires: new Date(0), httpOnly: true }); // Clear the cookie
  res.status(200).json({ success: true, message: 'User logged out successfully' });
};


module.exports = {generateVerificationToken,  register, login, logout };
