import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Quiz() {
    const [answers, setAnswers] = useState({
        transportation: '',
        meatConsumption: '',
        recycling: '',
        energyEfficiency: '',
        electricityUsage: '',
    });

    const navigation = useNavigation();

    const getToken = async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            return token;
        } catch (error) {
            console.error('Error retrieving token:', error);
            return null;
        }
    };

    const handleInputChange = (name, value) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        const token = await getToken();
        if (!token) {
            alert('You need to log in first');
            return;
        }

        // Validation to check if all answers are filled
        if (Object.values(answers).includes('')) {
            alert('Please fill all the fields before submitting');
            return;
        }

        const requestBody = { answers };

        try {
            const response = await fetch('http://192.168.0.220:3000/saveQuiz', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(requestBody),
            });

            const text = await response.text();
            if (response.ok) {
                const data = JSON.parse(text);
                if (data.success) {
                    navigation.navigate('Suggestions', { answers });
                } else {
                    alert('Error saving quiz data');
                }
            } else {
                alert('Error saving quiz data');
            }
        } catch (error) {
            console.error('Error with fetch request:', error);
            alert('Network error or request failed');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Carbon Footprint Quiz</Text>

            <Text style={styles.question}>1. How often do you use public transportation?</Text>
            <Picker
                selectedValue={answers.transportation}
                style={styles.picker}
                onValueChange={(itemValue) => handleInputChange('transportation', itemValue)}>
                <Picker.Item label="Never" value="Never" />
                <Picker.Item label="Occasionally" value="Occasionally" />
                <Picker.Item label="Frequently" value="Frequently" />
            </Picker>

            <Text style={styles.question}>2. How often do you consume meat?</Text>
            <Picker
                selectedValue={answers.meatConsumption}
                style={styles.picker}
                onValueChange={(itemValue) => handleInputChange('meatConsumption', itemValue)}>
                <Picker.Item label="Never" value="Never" />
                <Picker.Item label="Occasionally" value="Occasionally" />
                <Picker.Item label="Frequently" value="Frequently" />
            </Picker>

            <Text style={styles.question}>3. How often do you recycle?</Text>
            <Picker
                selectedValue={answers.recycling}
                style={styles.picker}
                onValueChange={(itemValue) => handleInputChange('recycling', itemValue)}>
                <Picker.Item label="Never" value="Never" />
                <Picker.Item label="Rarely" value="Rarely" />
                <Picker.Item label="Frequently" value="Frequently" />
            </Picker>

            <Text style={styles.question}>4. Are you using energy-efficient appliances?</Text>
            <Picker
                selectedValue={answers.energyEfficiency}
                style={styles.picker}
                onValueChange={(itemValue) => handleInputChange('energyEfficiency', itemValue)}>
                <Picker.Item label="No" value="No" />
                <Picker.Item label="Yes" value="Yes" />
            </Picker>

            <Text style={styles.question}>5. What is your average electricity usage?</Text>
            <Picker
                selectedValue={answers.electricityUsage}
                style={styles.picker}
                onValueChange={(itemValue) => handleInputChange('electricityUsage', itemValue)}>
                <Picker.Item label="Low" value="Low" />
                <Picker.Item label="Moderate" value="Moderate" />
                <Picker.Item label="High" value="High" />
            </Picker>

            <Button title="Submit" onPress={handleSubmit} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f4f4f9',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    question: {
        fontSize: 18,
        marginBottom: 10,
        color: '#00796B',
    },
    picker: {
        height: 50,
        marginBottom: 20,
    },
});
