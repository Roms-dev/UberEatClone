// screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { firebase } from '@react-native-firebase/firestore';

const HomeScreen = () => {
  const [restaurants, setRestaurants] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = firebase.firestore()
      .collection('Restaurant')
      .onSnapshot(querysnapshot => {
        const restaurants: any[] = [];
        querysnapshot.forEach((documentSnapshot) => {
          restaurants.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        setRestaurants(restaurants);
      });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Restaurants Disponibles</Text>
      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <View style={styles.restaurantContainer}>
            <View style={styles.restaurantHeader}>
              <Text style={styles.restaurantName}>{item.name}</Text>
              <View style={styles.restaurantStarsContainer}>
                <Text style={styles.restaurantStars}>{item.stars}</Text>
              </View>
            </View>
            <Text style={styles.deliveryFee}>Frais de livraison: {item.frais_livraisons / 100}€</Text>
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
  restaurantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  restaurantStarsContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  restaurantStars: {
    fontSize: 14,
    fontWeight: "bold",
  },
  restaurantAddress: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  deliveryFee: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});

export default HomeScreen;
