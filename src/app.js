const dotenv = require('dotenv');
dotenv.config();
console.log("🔍 MONGO_URI from .env:", process.env.MONGO_URI);


const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const authenticateToken = require('./middlewares/auth');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect to DB
connectDB();

// Routes
app.use('/api/auth', authRoutes);

// Protected Route
app.get('/protected', authenticateToken, (req, res) => {
  res.send(`Hello, ${req.user.email}. You have accessed a protected route.`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
