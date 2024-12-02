const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');
const axios = require('axios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Importing the JWT library
const User = require('./models/User');  // Import User model from models/User.js

require('dotenv').config();

console.log('MongoDB URI:', process.env.MONGO_URI);

const app = express();

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
const uri = process.env.MONGO_URI;
if (!uri) {
  console.error('Error: MONGO_URI is not defined in .env');
  process.exit(1);
}

mongoose.connect(uri)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Schema for Vehicle
const vehicleSchema = new mongoose.Schema({
  type: String,
  emissionFactor: Number,
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

// API for vehicles
app.get('/vehicles', async (req, res) => {
  console.log('Fetching all vehicles');
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
    console.log('Fetched vehicles:', vehicles);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ message: 'Error fetching vehicles' });
  }
});

app.post('/calculate', async (req, res) => {
  console.log('Received request for emission calculation:', req.body);
  const { vehicleType, distance } = req.body;

  try {
    const vehicle = await Vehicle.findOne({ type: vehicleType });
    if (!vehicle) {
      console.log('Vehicle not found:', vehicleType);
      return res.status(404).json({ message: 'Vehicle Not Found' });
    }

    const emission = vehicle.emissionFactor * distance;
    console.log(`Emission calculated: ${emission}`);
    res.json({ emission });
  } catch (error) {
    console.error('Error calculating emission:', error);
    res.status(500).json({ message: 'Error calculating emission' });
  }
});

// Signup Route with JWT
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  console.log('Received signup request:', req.body);

  if (!username || !email || !password) {
    console.log('Missing fields in signup request:', { username, email, password });
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists with email:', email);
      return res.status(400).json({ message: 'Email is already in use' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully');

    // Save new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    console.log('User registered successfully:', newUser);

    // Generate JWT Token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1h', // Set the expiration time for the token
    });
    console.log('JWT generated for user:', newUser.username);

    // Return the token to the client
    res.status(201).json({ success: true, message: 'User registered successfully', token });
  } catch (error) {
    console.error('Error during sign-up:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Dialogflow setup
const sessionClient = new dialogflow.SessionsClient({
  keyFilename: process.env.DIALOGFLOW_KEYFILE, // path to the Dialogflow service account JSON
});

const projectId = process.env.DIALOGFLOW_PROJECT_ID; // Your Dialogflow project ID
const sessionId = uuid.v4(); // Generate a unique session ID for each conversation

const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

const sendToDialogflow = async (message) => {
  console.log('Sending message to Dialogflow:', message);

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: message,
        languageCode: 'en-US',
      },
    },
  };

  try {
    const [response] = await sessionClient.detectIntent(request);
    const result = response.queryResult;
    console.log('Dialogflow response:', result.fulfillmentText);
    return result.fulfillmentText; // Dialogflow's response message
  } catch (error) {
    console.error('Dialogflow API Error:', error);
    return 'Sorry, there was an issue processing your request.';
  }
};

// Chat API
app.post('/chat', async (req, res) => {
  const { message } = req.body;

  console.log('Received chat message:', message);

  if (!message) {
    return res.status(400).json({ message: 'Message is required' });
  }

  const dialogflowResponse = await sendToDialogflow(message);
  console.log('Dialogflow replied:', dialogflowResponse);
  res.json({ reply: dialogflowResponse });
});

// Fetch live news about carbon footprint and environment
app.get('/news', async (req, res) => {
  const apiKey = process.env.NEWS_API_KEY;
  const url = `https://newsapi.org/v2/everything?q=carbon%20footprint%20environment&apiKey=${apiKey}`;

  console.log('Fetching news about carbon footprint and environment from News API');

  try {
    const response = await axios.get(url);
    const articles = response.data.articles;
    console.log('Fetched news articles:', articles);
    res.json(articles);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ message: 'Error fetching news' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

const authRoutes = require('./routes/authRoutes'); // Adjust path as necessary
app.use(authRoutes);

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Get the token from the Authorization header

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use the JWT_SECRET from .env
        req.user = decoded; // Attach the user data to the request object
        next(); // Call the next middleware or route handler
    } catch (error) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

// Save Quiz Answers for the logged-in user
app.post('/saveQuiz', verifyToken, async (req, res) => {
  const { transportation, meatConsumption, recycling, energyEfficiency, electricityUsage } = req.body;

  if (!transportation || !meatConsumption || !recycling || !energyEfficiency || !electricityUsage) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Find the logged-in user by the userId attached to the request after JWT verification
    const user = await User.findById(req.user.userId); // Fix to use req.user.userId
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's quiz answers
    user.quizAnswers = {
      transportation,
      meatConsumption,
      recycling,
      energyEfficiency,
      electricityUsage,
    };

    // Save the updated user data
    await user.save();

    res.json({ success: true, message: 'Quiz answers saved successfully' });
  } catch (error) {
    console.error('Error saving quiz data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
