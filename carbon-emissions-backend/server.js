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