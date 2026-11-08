const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');
const memoryStore = require('../utils/memoryStore');
const { JWT_SECRET, JWT_EXPIRE } = require('../config/env');

// Helper to sign JWT token
const signToken = (id, role, email) => {
  return jwt.sign({ id, role, email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, phone, password, role, preferredLanguage, state, age, occupation, annualIncome, isFarmer } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, email address, and password.',
      });
    }

    if (mongoose.connection.readyState === 1) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email address already exists. Please login.',
        });
      }

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        phone: phone || '',
        password,
        role: role || 'citizen',
        preferredLanguage: preferredLanguage || 'mr',
        state: state || 'Maharashtra',
        age: age ? Number(age) : null,
        occupation: occupation || '',
        annualIncome: annualIncome ? Number(annualIncome) : null,
        isFarmer: Boolean(isFarmer),
      });

      const token = signToken(user._id, user.role, user.email);

      res.status(201).json({
        success: true,
        message: 'Account created successfully.',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          preferredLanguage: user.preferredLanguage,
          state: user.state,
          isFarmer: user.isFarmer,
        },
      });
    } else {
      // Memory Store fallback
      const existing = memoryStore.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email address already exists. Please login.',
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = {
        _id: `user_${Date.now()}`,
        name,
        email: email.toLowerCase(),
        phone: phone || '',
        password: hashedPassword,
        role: role || 'citizen',
        preferredLanguage: preferredLanguage || 'mr',
        state: state || 'Maharashtra',
        age: age ? Number(age) : null,
        occupation: occupation || '',
        annualIncome: annualIncome ? Number(annualIncome) : null,
        isFarmer: Boolean(isFarmer),
        createdAt: new Date(),
      };

      memoryStore.users.push(newUser);
      const token = signToken(newUser._id, newUser.role, newUser.email);

      res.status(201).json({
        success: true,
        message: 'Account created successfully (local store).',
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          role: newUser.role,
          preferredLanguage: newUser.preferredLanguage,
          state: newUser.state,
          isFarmer: newUser.isFarmer,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password to log in.',
      });
    }

    let user;
    if (mongoose.connection.readyState === 1) {
      user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    } else {
      user = memoryStore.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your email and password.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your email and password.',
      });
    }

    const token = signToken(user._id, user.role, user.email);

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        preferredLanguage: user.preferredLanguage,
        state: user.state,
        isFarmer: user.isFarmer,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, preferredLanguage, state, age, occupation, annualIncome, isFarmer } = req.body;

    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      if (name) user.name = name;
      if (phone !== undefined) user.phone = phone;
      if (preferredLanguage) user.preferredLanguage = preferredLanguage;
      if (state) user.state = state;
      if (age !== undefined) user.age = Number(age);
      if (occupation !== undefined) user.occupation = occupation;
      if (annualIncome !== undefined) user.annualIncome = Number(annualIncome);
      if (isFarmer !== undefined) user.isFarmer = Boolean(isFarmer);

      await user.save();

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        user,
      });
    } else {
      const user = memoryStore.users.find((u) => u._id === req.user._id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      if (name) user.name = name;
      if (phone !== undefined) user.phone = phone;
      if (preferredLanguage) user.preferredLanguage = preferredLanguage;
      if (state) user.state = state;
      if (age !== undefined) user.age = Number(age);
      if (occupation !== undefined) user.occupation = occupation;
      if (annualIncome !== undefined) user.annualIncome = Number(annualIncome);
      if (isFarmer !== undefined) user.isFarmer = Boolean(isFarmer);

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        user,
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe, updateProfile };
