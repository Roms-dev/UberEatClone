import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import {firebase} from '@react-native-firebase/firestore';

const HomeScreen = () => {
  const [restaurants, setRestaurants] = useState<any[]>([]);

  useEffect(() => {
    firebase.firestore()
      .collection('Restaurant')
      .onSnapshot(querysnapshot => {
        const restaurants: any[] = [];

        querysnapshot.forEach((documentSnapshot) => {
          restaurants.push({
            ... documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        setRestaurants(restaurants);
      });

    // Unsubscribe from events when no longer in use
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Restaurants Disponibles</Text>
      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <View style={styles.restaurantContainer}>
            <Text style={styles.restaurantName}>{item.name}</Text>
            <Text style={styles.restaurantStars}>{item.stars}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  restaurantContainer: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  restaurantStars: {
    fontSize: 14,
    color: '#666',
  },
});

export default HomeScreen;