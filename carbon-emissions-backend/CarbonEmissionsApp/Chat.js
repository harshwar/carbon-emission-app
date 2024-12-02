import React, { useState } from 'react';
import { View, TextInput, Button, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

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
      const response = await fetch('http://192.168.0.220:3000/chat', {  // Replace with your server URL
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
                  <Text style={styles.messageText}>{item.text}</Text>
                </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            inverted
        />

        <View style={styles.inputContainer}>
          <TextInput
              style={styles.input}
              placeholder="Type your message..."
              value={userMessage}
              onChangeText={setUserMessage}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f7f7f7',  // Subtle light gray background
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: '#ddd',
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#4CAF50',  // Green button
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECECEC',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
});
