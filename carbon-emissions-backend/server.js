const express =require('express');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const cors=require('cors');
const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');
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



// Dialogflow setup
const sessionClient = new dialogflow.SessionsClient({
  keyFilename: process.env.DIALOGFLOW_KEYFILE, // path to the Dialogflow service account JSON
});

const projectId = process.env.DIALOGFLOW_PROJECT_ID; // Your Dialogflow project ID
const sessionId = uuid.v4(); // Generate a unique session ID for each conversation

const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

// Send message to Dialogflow and receive response
const sendToDialogflow = async (message) => {
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
    return result.fulfillmentText; // Dialogflow's response message
  } catch (error) {
    console.error('Dialogflow API Error:', error);
    return 'Sorry, there was an issue processing your request.';
  }
};

// API Routes
app.post('/chat', async (req, res) => {
  const { message } = req.body; // Expect a message from the frontend

  if (!message) {
    return res.status(400).json({ message: 'Message is required' });
  }

  const dialogflowResponse = await sendToDialogflow(message);
  res.json({ reply: dialogflowResponse });
});




