const mongoose = require('mongoose');
const crypto = require('crypto');

const passwordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  site: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    trim: true,
    default: ''
  },
  category: {
    type: String,
    trim: true,
    default: 'General'
  },
  url: {
    type: String,
    trim: true,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Encrypt password before saving
passwordSchema.pre('save', function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    // Simple encryption (in production, use a more secure method)
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(process.env.JWT_SECRET || 'fallback_key', 'salt', 32);
    const iv = crypto.randomBytes(16);
    
    const cipher = crypto.createCipher(algorithm, key);
    let encrypted = cipher.update(this.password, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    this.password = encrypted;
    next();
  } catch (error) {
    next(error);
  }
});

// Method to decrypt password
passwordSchema.methods.decryptPassword = function() {
  try {
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(process.env.JWT_SECRET || 'fallback_key', 'salt', 32);
    
    const decipher = crypto.createDecipher(algorithm, key);
    let decrypted = decipher.update(this.password, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

// Virtual for decrypted password (for API responses)
passwordSchema.virtual('decryptedPassword').get(function() {
  return this.decryptPassword();
});

// Ensure virtual fields are serialized
passwordSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Password', passwordSchema); 