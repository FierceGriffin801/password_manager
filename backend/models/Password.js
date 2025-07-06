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
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  version: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

// Encrypt password before saving
passwordSchema.pre('save', function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(process.env.JWT_SECRET || 'fallback_key', 'salt', 32);
    const iv = crypto.randomBytes(16);
    
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(this.password, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Store IV with encrypted data
    this.password = iv.toString('hex') + ':' + encrypted;

    // LOGGING
    console.log('ENCRYPTED:', this.password, 'KEY:', process.env.JWT_SECRET);

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
    
    // Split IV and encrypted data
    const parts = this.password.split(':');
    if (parts.length !== 2) {
      throw new Error('Invalid encrypted data format');
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    
    // LOGGING
    console.log('DECRYPT FUNCTION: this.password =', this.password);
    console.log('DECRYPTING:', this.password, 'KEY:', process.env.JWT_SECRET);

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
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