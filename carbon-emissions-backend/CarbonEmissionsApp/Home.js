import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

export default function Home() {
  const [vehicleType, setVehicleType] = useState('');
  const [distance, setDistance] = useState('');
  const [emission, setEmission] = useState(null);

  const navigation = useNavigation();

  const calculateEmission = async () => {
    if (!vehicleType || !distance) {
      Alert.alert('Error', 'Please select a vehicle type and enter a distance');
      return;
    }

    try {
      const response = await axios.post('http://192.168.0.220:3000/calculate', {
        vehicleType,
        distance: parseFloat(distance),
      });

      setEmission(response.data.emission);
    } catch (error) {
      console.error('Error calculating emission:', error);
      Alert.alert('Error', 'Could not calculate emission. Please try again.');
    }
  };

  return (
      <ImageBackground
          source={require('./assets/BG.jpg')} // Background image path
          style={styles.background}
      >
        <View style={styles.overlay}>
          <View style={styles.container}>
            <Text style={styles.title}>Carbon Emissions Calculator</Text>

            <Text style={styles.label}>Vehicle Type:</Text>
            <Picker
                selectedValue={vehicleType}
                onValueChange={(itemValue) => setVehicleType(itemValue)}
                style={styles.picker}
            >
              <Picker.Item label="Select vehicle type" value="" />
              <Picker.Item label="Car" value="Car" />
              <Picker.Item label="Bus" value="Bus" />
              <Picker.Item label="Bike" value="Bike" />
              <Picker.Item label="Truck" value="Truck" />
            </Picker>

            <Text style={styles.label}>Distance (km):</Text>
            <TextInput
                style={styles.input}
                value={distance}
                onChangeText={setDistance}
                placeholder="Enter distance"
                keyboardType="numeric"
            />

            <TouchableOpacity style={styles.calculateButton} onPress={calculateEmission}>
              <Text style={styles.calculateButtonText}>Calculate</Text>
            </TouchableOpacity>

            {emission !== null && (
                <Text style={styles.result}>Carbon Emission: {emission} kg CO₂</Text>
            )}

            <View style={styles.navigationButtons}>
              <TouchableOpacity
                  style={styles.navigationButton}
                  onPress={() => navigation.navigate('Chat')}
              >
                <Text style={styles.navigationButtonText}>Go to Chat</Text>
              </TouchableOpacity>

              <TouchableOpacity
                  style={styles.navigationButton}
                  onPress={() => navigation.navigate('News')}
              >
                <Text style={styles.navigationButtonText}>Go to News</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay for contrast
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 20,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#00796B',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 18,
    color: '#00796B',
    marginTop: 10,
  },
  picker: {
    width: '100%',
    height: 50,
    borderColor: '#00796B',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: '#ffffff',
    paddingLeft: 10,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#00796B',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 10,
    paddingLeft: 10,
    backgroundColor: '#ffffff',
  },
  calculateButton: {
    backgroundColor: '#00796B',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
  },
  calculateButtonText: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
  },
  result: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00796B',
    marginTop: 30,
  },
  navigationButtons: {
    marginTop: 30,
    width: '100%',
    alignItems: 'center',
  },
  navigationButton: {
    backgroundColor: '#004D40',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
  },
  navigationButtonText: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
  },
});
