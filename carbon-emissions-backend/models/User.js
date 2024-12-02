const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'Password must be at least 8 characters long'],
  },
   quizAnswers: {
    transportation: String,
    meatConsumption: String,
    recycling: String,
    energyEfficiency: String,
    electricityUsage: String,
  },
});

// Hash password before saving it
userSchema.pre('save', async function (next) {
  console.log('Pre-save hook triggered');

  if (!this.isModified('password')) {
    console.log('Password not modified, skipping hash');
    return next();
  }

  try {
    console.log('Hashing password...');
    this.password = await bcrypt.hash(this.password, 10);
    console.log('Password hashed successfully');
    next();
  } catch (error) {
    console.error('Error hashing password:', error);
    next(error); // Pass the error to the next middleware
  }
});

const User = mongoose.model('User', userSchema);

console.log('User model created successfully');
module.exports = User;
