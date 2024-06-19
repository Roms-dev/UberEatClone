// screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Image } from 'react-native';
import { firebase } from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import Icon from '@expo/vector-icons/FontAwesome';
import { Link } from 'expo-router';


const HomeScreen = () => {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [search, setSearch] = useState('');

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
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchBar}
          placeholder="Rechercher dans l'aide Uber Eats"
          value={search}
          onChangeText={setSearch}
        />
      </View>
      <FlatList
        data={restaurants.filter((item) => 
          item.name.toLowerCase().includes(search.toLowerCase())
        )} 
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <View>
            <Link href={`/restaurant/${item.key}`}>
              <View style={styles.restaurantImage}>
                <Image source={ item.img } />
              </View>
              <View style={styles.restaurantHeader}>
                <Text style={styles.restaurantName}>{item.name}</Text>
                <View style={styles.restaurantStarsContainer}>
                  <Text style={styles.restaurantStars}>{item.stars}</Text>
                </View>
              </View>
              <Text style={styles.fraisLivraisons}>Frais de livraison : {item.frais_livraisons / 100}€ • {item.temp_livraison} min</Text>
            </Link>
          </View>  
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#f8f8f8',
  },
  searchBar: {
    fontSize: 18,
    flex: 1,
    borderWidth: 0,
  },
  searchIcon: {
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  restaurantContainer: {
    marginBottom: 65,
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
  },
  restaurantImage: {
    height: 170,
    backgroundColor: '#ccc', 
    borderRadius: 25,
    marginBottom: 10,
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
  fraisLivraisons: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  separator: {
    height: 30,
  },
});

export default HomeScreen;
