import React from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function Suggestions() {
    const route = useRoute();
    const navigation = useNavigation();
    const { answers } = route.params;

    // Generate detailed suggestions based on answers
    const generateSuggestions = () => {
        let suggestionText = "Here’s a comprehensive report based on your answers. These suggestions can help you make significant changes to reduce your carbon footprint and live more sustainably:\n\n";

        // Transportation suggestions
        if (answers.transportation === 'Never') {
            suggestionText += "You currently don’t use public transportation, which is a major area where you can reduce your carbon emissions. Public transport is significantly more efficient than driving a car, especially for urban commuters. By switching to buses, trains, or trams, you can reduce your carbon footprint and also help decrease traffic congestion in your city. If possible, look into carpooling or using ride-sharing services, which can be more energy-efficient than driving alone. For short distances, walking or biking is not only environmentally friendly but also helps improve your health and saves money. If walking or cycling isn’t feasible due to location, explore electric scooters or bicycles as a low-emission alternative.\n\n";
        } else if (answers.transportation === 'Occasionally') {
            suggestionText += "You occasionally use public transport, which is a good step towards reducing your environmental impact. However, there are further steps you can take to reduce your carbon footprint. Try to make public transport your primary mode of travel, especially for commuting to work or running errands. This will help lower your reliance on personal vehicles, which are a major source of emissions. If public transport isn’t always available or convenient, consider switching to walking or biking for shorter trips. This will reduce your need for cars and will improve your physical health.\n\n";
        } else if (answers.transportation === 'Frequently') {
            suggestionText += "It’s commendable that you frequently use public transportation, which helps reduce carbon emissions significantly. To optimize this, consider evaluating your current travel options. Trains, especially electric ones, tend to be more efficient than buses, and if you’re taking the bus, try to use routes that are less crowded and run on clean energy sources. Another key suggestion is to explore more sustainable options such as electric vehicles (EVs) or hybrid cars, if driving is necessary. Look into green travel incentives in your area that might offer benefits for public transport use or using electric vehicles. Moreover, you can continue to prioritize walking or cycling for shorter trips to minimize emissions further.\n\n";
        }

        // Meat consumption suggestions
        if (answers.meatConsumption === 'Frequently') {
            suggestionText += "Eating meat frequently, particularly red meat, has a significant environmental impact, especially in terms of greenhouse gas emissions. Cattle farming, for example, produces large amounts of methane, a potent greenhouse gas. To reduce your carbon footprint, consider gradually cutting down on the amount of meat you consume. Start by trying meatless Mondays, where you commit to having plant-based meals once a week. You could also reduce your meat consumption by substituting beef or lamb with chicken, which has a lower environmental impact. Alternatively, look into plant-based substitutes like tofu, tempeh, or lentils, which are not only better for the environment but also packed with essential nutrients. Switching to sustainably sourced meat, like free-range chicken or grass-fed beef, can also be an option for reducing environmental harm.\n\n";
        } else if (answers.meatConsumption === 'Occasionally') {
            suggestionText += "It’s great that you’re already reducing your meat consumption. To make a more significant impact, consider exploring plant-based alternatives more often, such as beans, peas, and quinoa, which are excellent sources of protein and have a much lower environmental impact compared to meat. By planning meals that include these alternatives, you’ll further reduce your carbon footprint and enjoy a wider variety of nutrients. Additionally, when you do consume meat, consider sourcing it from sustainable farms that prioritize animal welfare and environmentally friendly practices. Even small changes can add up, and by reducing your meat intake, you’re already contributing positively to the planet’s health.\n\n";
        } else if (answers.meatConsumption === 'Rarely') {
            suggestionText += "It’s impressive that you consume very little meat. To make an even bigger impact, consider adopting a fully plant-based diet, or even focusing on a plant-rich diet. Many people are now shifting to veganism or vegetarianism to minimize their environmental impact, and it’s a decision that not only benefits the planet but can also improve your health. Plant-based diets are known to reduce the risk of heart disease, diabetes, and even some forms of cancer. You could experiment with new recipes, like lentil stews, veggie burgers, or quinoa bowls, and discover how satisfying and flavorful plant-based meals can be.\n\n";
        }

        // Recycling suggestions
        if (answers.recycling === 'Never') {
            suggestionText += "Recycling is a simple yet highly effective way to reduce waste and help protect the environment. Start by learning about your local recycling program and what materials they accept, such as plastic, paper, glass, and metal. Once you know what can be recycled, set up separate bins in your home to make the process easier. Consider switching to reusable bags, bottles, and containers to avoid creating more waste. You can also choose to buy products with less packaging or products made from recycled materials, which will help reduce the demand for new raw materials. Recycling will help save natural resources, reduce landfill waste, and cut down on the energy needed to produce new items.\n\n";
        } else if (answers.recycling === 'Rarely') {
            suggestionText += "Recycling is an important habit, and it’s great that you’re already doing it, even if only occasionally. To make it more consistent, consider setting up more clearly marked bins at home to separate recyclables from trash. Take the time to properly clean and sort recyclables before placing them in the bin, as contamination can lead to more waste being sent to landfills. Additionally, try to reduce single-use plastics in your daily life. Instead of buying bottled water, use a reusable water bottle, and choose food products with minimal packaging. As you increase your recycling efforts, consider researching upcycling projects, where you can repurpose materials into new products.\n\n";
        } else if (answers.recycling === 'Frequently') {
            suggestionText += "It’s fantastic that you recycle frequently. To enhance your efforts, consider reducing the amount of waste you generate in the first place. One way to do this is to focus on 'reducing' and 'reusing' before recycling. For example, instead of purchasing items with excessive packaging, choose items that come in recyclable or reusable packaging. Avoid using disposable plastics and opt for sustainable alternatives like bamboo or stainless steel. You can also support businesses that use environmentally friendly practices, such as compostable packaging and fair trade products.\n\n";
        }

        // Energy efficiency suggestions
        if (answers.energyEfficiency === 'No') {
            suggestionText += "Switching to energy-efficient appliances can significantly lower your energy usage and reduce your carbon footprint. Consider replacing incandescent light bulbs with LED bulbs, which use far less energy and last longer. If possible, look into Energy Star-rated appliances for your home, such as refrigerators, washing machines, and air conditioners. Additionally, be mindful of your energy consumption by unplugging devices when not in use, using power strips, and installing a programmable thermostat to regulate your home’s temperature. These simple steps can lead to both energy and cost savings, making your home more sustainable.\n\n";
        } else if (answers.energyEfficiency === 'Yes') {
            suggestionText += "You’re already using energy-efficient appliances, which is excellent! To take it further, consider making your home more sustainable by adding solar panels or other renewable energy sources. While this is an upfront investment, it can save you money on electricity bills in the long run. Additionally, ensure your home is well-insulated to reduce the need for heating or cooling. Smart thermostats can also help regulate your energy use by automatically adjusting your home’s temperature. Lastly, consider using energy-efficient home improvement options like double-glazed windows and low-energy lighting.\n\n";
        }

        // Electricity usage suggestions
        if (answers.electricityUsage === 'High') {
            suggestionText += "Your electricity usage is higher than average, but the good news is that you can make several improvements to reduce consumption. Start by conducting an energy audit of your home to identify areas where energy is being wasted, such as inefficient appliances or outdated insulation. Consider switching to LED bulbs, unplugging devices when not in use, and using smart meters to monitor your consumption. Additionally, avoid using large energy-draining devices during peak hours, and invest in energy-efficient appliances to lower your overall usage. Small changes can lead to big savings on your electricity bill and a reduction in your carbon footprint.\n\n";
        } else if (answers.electricityUsage === 'Moderate') {
            suggestionText += "Your electricity usage is moderate, which means there’s room for improvement. Consider switching to energy-efficient lighting and appliances to further lower your consumption. Install a programmable thermostat to optimize heating and cooling in your home, and use power strips to easily turn off multiple devices at once when they’re not in use. Another useful tip is to take advantage of natural light during the day and minimize the use of artificial lighting. Lastly, consider exploring renewable energy options, such as solar panels or wind energy, to power your home more sustainably.\n\n";
        } else if (answers.electricityUsage === 'Low') {
            suggestionText += "It’s impressive that your electricity usage is low! You’re already contributing positively to the environment. To further optimize your energy usage, consider installing smart home devices that can help you track and reduce consumption even more. Continue to focus on using energy-efficient appliances, and ensure that your home is well-insulated to minimize heat loss. Also, consider integrating renewable energy sources, such as solar or wind, into your home’s energy mix. This can make your home even more sustainable and eco-friendly.\n\n";
        }

        return suggestionText;
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Suggestions to Reduce Your Carbon Footprint</Text>
            <Text style={styles.suggestionsText}>{generateSuggestions()}</Text>
            <Button title="Back to Home" onPress={() => navigation.navigate('Home')} />
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
    suggestionsText: {
        fontSize: 16,
        color: '#00796B',
        lineHeight: 24,
        marginVertical: 10,
    },
});
