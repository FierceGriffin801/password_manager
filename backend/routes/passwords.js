const express = require('express');
const { body, validationResult } = require('express-validator');
const Password = require('../models/Password');
const auth = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// @route   GET /api/passwords
// @desc    Get all passwords for the authenticated user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const passwords = await Password.find({ user: req.user._id })
      .select('-password') // Don't send encrypted password
      .sort({ createdAt: -1 });

    // Decrypt passwords for response
    const decryptedPasswords = passwords.map(pwd => ({
      ...pwd.toObject(),
      decryptedPassword: pwd.decryptPassword()
    }));

    res.json(decryptedPasswords);
  } catch (error) {
    console.error('Get passwords error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/passwords
// @desc    Create a new password entry
// @access  Private
router.post('/', [
  body('site')
    .notEmpty()
    .withMessage('Site name is required')
    .trim()
    .escape(),
  body('username')
    .notEmpty()
    .withMessage('Username is required')
    .trim()
    .escape(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  body('notes')
    .optional()
    .trim()
    .escape(),
  body('category')
    .optional()
    .trim()
    .escape(),
  body('url')
    .optional()
    .isURL()
    .withMessage('Please enter a valid URL')
    .trim()
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { site, username, password, notes, category, url } = req.body;

    const newPassword = new Password({
      user: req.user._id,
      site,
      username,
      password,
      notes: notes || '',
      category: category || 'General',
      url: url || ''
    });

    await newPassword.save();

    // Return the created password with decrypted password
    const createdPassword = {
      ...newPassword.toObject(),
      decryptedPassword: newPassword.decryptPassword()
    };

    res.status(201).json(createdPassword);
  } catch (error) {
    console.error('Create password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/passwords/:id
// @desc    Update a password entry
// @access  Private
router.put('/:id', [
  body('site')
    .optional()
    .notEmpty()
    .withMessage('Site name cannot be empty')
    .trim()
    .escape(),
  body('username')
    .optional()
    .notEmpty()
    .withMessage('Username cannot be empty')
    .trim()
    .escape(),
  body('password')
    .optional()
    .notEmpty()
    .withMessage('Password cannot be empty'),
  body('notes')
    .optional()
    .trim()
    .escape(),
  body('category')
    .optional()
    .trim()
    .escape(),
  body('url')
    .optional()
    .isURL()
    .withMessage('Please enter a valid URL')
    .trim()
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { id } = req.params;
    const updateData = req.body;

    // Find password and ensure it belongs to the user
    const password = await Password.findOne({ 
      _id: id, 
      user: req.user._id 
    });

    if (!password) {
      return res.status(404).json({ message: 'Password not found' });
    }

    // Update fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        password[key] = updateData[key];
      }
    });

    password.updatedAt = new Date();
    await password.save();

    // Return updated password with decrypted password
    const updatedPassword = {
      ...password.toObject(),
      decryptedPassword: password.decryptPassword()
    };

    res.json(updatedPassword);
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/passwords/:id
// @desc    Delete a password entry
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const password = await Password.findOneAndDelete({ 
      _id: id, 
      user: req.user._id 
    });

    if (!password) {
      return res.status(404).json({ message: 'Password not found' });
    }

    res.json({ message: 'Password deleted successfully' });
  } catch (error) {
    console.error('Delete password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/passwords/:id
// @desc    Get a specific password entry
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const password = await Password.findOne({ 
      _id: id, 
      user: req.user._id 
    });

    if (!password) {
      return res.status(404).json({ message: 'Password not found' });
    }

    // Return password with decrypted password
    const passwordWithDecrypted = {
      ...password.toObject(),
      decryptedPassword: password.decryptPassword()
    };

    res.json(passwordWithDecrypted);
  } catch (error) {
    console.error('Get password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 