import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

export default function Login({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      console.log('Attempting login with username:', username);

      // Making the POST request
      const response = await axios.post('http://192.168.0.220:3000/api/login', {
        username,
        password,
      });

      console.log('Login response:', response.data); // Debugging response

      const { success, message, userId } = response.data;

      if (success) {
        console.log('Login successful for user:', username);
        Alert.alert('Success', message, [
          { text: 'OK', onPress: () => navigation.navigate('Home', { userId }) },
        ]);
      } else {
        console.log('Login failed for user:', username);
        Alert.alert('Error', message);
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        // If error response exists, print response error details
        console.log('Error response from backend:', error.response.data);
      } else if (error.request) {
        // If no response is received from backend
        console.log('No response received from backend:', error.request);
      } else {
        // Any other errors
        console.log('Error in setting up request:', error.message);
      }
      Alert.alert('Error', 'An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Login'}</Text>
      </TouchableOpacity>
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
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
