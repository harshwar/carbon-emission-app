const express =require('express');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const cors=require('cors');
require('dotenv').config();

console.log('MongoDB URI:', process.env.MONGO_URI);

const app = express();

app.use(cors());
app.use(bodyParser.json());

//conn
const uri = process.env.MONGO_URI;
if (!uri) {
  console.error('Error: MONGO_URI is not defined in .env');
  process.exit(1);
}

mongoose.connect(uri)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

//scheme
const  vehicleSchema= new mongoose.Schema({
    type:String,
    emissionFactor:Number,
});

const Vehicle =mongoose.model('Vehicle',vehicleSchema);

module.exports={mongoose,Vehicle};

//api
app.get('/vehicles', async (req, res)=>{
    const vehicles = await Vehicle.find();
    res.json(vehicles);
});

app.post('/calculate', async (req, res)=>{
    const {vehicleType,distance}=req.body;
    const vehicle = await Vehicle.findOne({type:vehicleType});
    if(!vehicle){
        return res.status(404).json({message: 'Vehicle Not Found'});
    }
    const emission =vehicle.emissionFactor*distance;
    res.json({emission});
});

const PORT=process.env.PORT || 3000;
app.listen(PORT,()=>console.log(`Server started on port ${PORT}`));


// Add this to your server.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// User model for storing user information
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

// Signup Route
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already in use' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during sign-up:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ success: true, token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
});