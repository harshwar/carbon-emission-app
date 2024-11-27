import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

export default function App() {
  const [vehicleType, setVehicleType] = useState('');
  const [distance, setDistance] = useState('');
  const [emission, setEmission] = useState(null);

  const calculateEmission = async () => {
    if (!vehicleType || !distance) {
      Alert.alert('Error', 'Please provide both vehicle type and distance');
      return;
    }

    try {

      const response = await axios.post('http://localhost:3000/calculate', {
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
    <View style={styles.container}>
      <Text style={styles.title}>Carbon Emissions Calculator</Text>

      <Text style={styles.label}>Vehicle Type:</Text>
      <TextInput
        style={styles.input}
        value={vehicleType}
        onChangeText={setVehicleType}
        placeholder="Enter vehicle type"
      />

      <Text style={styles.label}>Distance (km):</Text>
      <TextInput
        style={styles.input}
        value={distance}
        onChangeText={setDistance}
        placeholder="Enter distance"
        keyboardType="numeric"
      />

      <Button title="Calculate" onPress={calculateEmission} />

      {emission !== null && (
        <Text style={styles.result}>Carbon Emission: {emission} kg CO₂</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginTop: 10,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 5,
    paddingLeft: 10,
  },
  result: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
});
