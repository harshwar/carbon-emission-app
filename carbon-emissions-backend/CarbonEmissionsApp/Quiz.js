import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput, Picker, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Quiz() {
    const [answers, setAnswers] = useState({
        transportation: '',
        meatConsumption: '',
        recycling: '',
        energyEfficiency: '',
        electricityUsage: '',
    });

    const navigation = useNavigation();

    // Handle changes in the inputs
    const handleInputChange = (name, value) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [name]: value,
        }));
    };

    const handleSubmit = () => {
        navigation.navigate('Suggestions', { answers });
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
