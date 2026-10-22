const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, verifyToken } = require('../middleware/auth');
const dataStore = require('../services/dataStore');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'employee', department = 'General' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const existingUser = await dataStore.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'A user with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await dataStore.createUser({
      name,
      email,
      password: hashedPassword,
      role: role === 'admin' ? 'admin' : 'employee',
      department
    });

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...userWithoutPass } = user;
    res.status(201).json({
      message: 'Registration successful',
      token,
      user: userWithoutPass
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error during registration.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await dataStore.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials. User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password. Please check your credentials.' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...userWithoutPass } = user;
    res.json({
      message: 'Login successful',
      token,
      user: userWithoutPass
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error during login.' });
  }
});

// GET /api/auth/me
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await dataStore.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    const { password, ...userWithoutPass } = user;
    res.json({ user: userWithoutPass });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch current user profile.' });
  }
});

// GET /api/auth/users
router.get('/users', verifyToken, async (req, res) => {
  try {
    const users = await dataStore.getAllUsers();
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user directory.' });
  }
});

module.exports = router;
