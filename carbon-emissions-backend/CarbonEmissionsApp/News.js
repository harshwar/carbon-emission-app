import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Modal, Linking } from 'react-native';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`http://192.168.0.220:3000/news`);
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }
        const data = await response.json();
        setNews(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleReadMore = (newsItem) => {
    setSelectedNews(newsItem);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedNews(null);
  };

  if (loading) {
    return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#28a745" />
          <Text style={styles.loadingText}>Fetching the latest updates...</Text>
        </View>
    );
  }

  if (error) {
    return (
        <View style={styles.center}>
          <Text style={styles.error}>{error}</Text>
        </View>
    );
  }

  return (
      <View style={styles.container}>
        <Text style={styles.header}>Environmental News</Text>
        {news.length > 0 ? (
            <FlatList
                data={news}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.newsItem}>
                      <Text style={styles.newsTitle}>{item.title}</Text>
                      <Text style={styles.newsDescription}>{item.description}</Text>
                      <TouchableOpacity onPress={() => handleReadMore(item)}>
                        <Text style={styles.readMore}>See Details</Text>
                      </TouchableOpacity>
                    </View>
                )}
            />
        ) : (
            <Text>No updates available</Text>
        )}

        {/* Modal for detailed news */}
        <Modal
            transparent={true}
            visible={modalVisible}
            animationType="fade"
            onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>{selectedNews?.title}</Text>
              <Text style={styles.modalContent}>{selectedNews?.description}</Text>
              <TouchableOpacity
                  onPress={() => Linking.openURL(selectedNews?.url)}
              >
                <Text style={styles.readMore}>Read the full article</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={closeModal}>
                <Text style={styles.modalClose}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#e0f7e0', // Light green background
    borderRadius: 10,
    elevation: 2,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#388e3c', // Dark green header
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'serif', // Adding a more traditional font style
  },
  newsItem: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#8bc34a', // Light green shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#8bc34a', // Light green border for a more vibrant effect
  },
  newsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c6e2f', // Dark green for title
    marginBottom: 5,
    fontFamily: 'serif',
  },
  newsDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 5,
    lineHeight: 20,
    fontFamily: 'Arial',
  },
  readMore: {
    fontSize: 15,
    fontWeight: '500',
    color: '#28a745', // Green button color
    marginTop: 8,
    textDecorationLine: 'underline', // Underline for better visibility
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: '#e74c3c', // Red for errors
    fontSize: 16,
    textAlign: 'center',
  },
  loadingText: {
    color: '#28a745',
    fontSize: 18,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dark overlay with a slight Indian vibe
  },
  modalContainer: {
    width: '85%',
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#388e3c', // Dark green for title
    marginBottom: 12,
    fontFamily: 'serif',
  },
  modalContent: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 20,
    lineHeight: 22,
    fontFamily: 'Arial',
  },
  modalClose: {
    fontSize: 16,
    fontWeight: '500',
    color: '#e74c3c', // Red for close button
    textAlign: 'center',
  },
});

export default News;
