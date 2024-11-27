const mongoose = require('mongoose');
require('dotenv').config();
const { Vehicle } = require('./server');  // Ensure the path to your server file is correct

const seedVehicles = async () => {
  // List of vehicles to seed
  const vehicles = [
    { type: 'Car', emissionFactor: 0.05 },
    { type: 'Truck', emissionFactor: 0.1 },
    { type: 'Bike', emissionFactor: 0.02 },
    { type: 'Bus', emissionFactor: 0.15 },
    { type: 'Train', emissionFactor: 0.15 }
  ];

  try {
    await Vehicle.deleteMany({});

    await Vehicle.insertMany(vehicles);

    console.log('Vehicles seeded successfully');
  } catch (err) {
    console.error('Error seeding vehicles:', err);
  }
};

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    seedVehicles();
  })
  .catch((err) => console.log('MongoDB connection error:', err));
