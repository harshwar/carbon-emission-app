// Chat.js

import React, { useState } from 'react';
import { View, TextInput, Button, Text, FlatList, StyleSheet } from 'react-native';

export default function Chat() {
  const [userMessage, setUserMessage] = useState('');
  const [messages, setMessages] = useState([]);

  // Function to send message to your server
  const sendMessage = async () => {
    if (userMessage.trim() === '') return;

    // Add the user's message to the messages list
    setMessages([...messages, { text: userMessage, sender: 'user' }]);
    setUserMessage('');

    try {
      const response = await fetch('http://192.168.0.221:3000/chat', {  // Replace with your server URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      const botReply = data.reply;

      // Add bot's reply to the messages list
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: botReply, sender: 'bot' },
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View style={item.sender === 'user' ? styles.userMessage : styles.botMessage}>
            <Text>{item.text}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <TextInput
        style={styles.input}
        placeholder="Type your message..."
        value={userMessage}
        onChangeText={setUserMessage}
      />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'flex-end',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECECEC',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ccc',
    marginTop: 10,
    padding: 10,
  },
});
