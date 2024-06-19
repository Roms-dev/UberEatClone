// screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { firebase } from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import Icon from '@expo/vector-icons/FontAwesome';
import { Link } from 'expo-router';
import { Image } from 'expo-image';


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
     <View style={styles.navBar}>
        <Text style={styles.navBarAddress}>22, allée alan turing</Text>
        <Icon name="shopping-cart" size={24} color="#000" />
      </View>
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
              <View style={styles.restaurantContainer}>
                <View>
                  <View style={styles.restaurantImage}>
                    <Image
                      style={styles.image}
                      source={item.img}
                      contentFit="cover"
                    />
                  </View>

                  <View style={styles.restaurantHeader}>
                    <Text style={styles.restaurantName}>{item.name}</Text>
                    <View style={styles.restaurantStarsContainer}>
                      <Text style={styles.restaurantStars}>{item.stars}</Text>
                    </View>
                  </View>
                  <Text style={styles.fraisLivraisons}>Frais de livraison : {item.frais_livraisons / 100}€ • {item.temp_livraison} min</Text>
                </View>
              </View>
            </Link>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      <View style={styles.navBarBottom}>
        <TouchableOpacity style={styles.navBarItem}>
          <Icon name="home" size={24} color="#000" />
          <Text style={styles.navBarText}>Accueil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBarItem}>
          <Icon name="user" size={24} color="#000" />
          <Text style={styles.navBarText}>Compte</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  navBarAddress: {
    fontSize: 18,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 10,
    margin: 20,
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
    margin: 20,
  },
  link: {
    marginHorizontal: 20,
  },
  restaurantContainer: {
    width: '100%',
    padding: 15,
    // backgroundColor: '#f8f8f8',
    backgroundColor: '#fff000',
    borderRadius: 5,
  },
  restaurantImage: {
    height: 170,
    backgroundColor: '#ccc',
    borderRadius: 10,
    marginBottom: 10,
  },
  restaurantContent: {
    flex: 1,
  },
  restaurantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
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
    fontWeight: 'bold',
  },
  fraisLivraisons: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  separator: {
    height: 30,
  },
  image: {
    flex: 1,
    width: '100%',
    borderRadius: 10,
  },
  navBarBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  navBarItem: {
    alignItems: 'center',
  },
  navBarText: {
    fontSize: 12,
    marginTop: 5,
  },
});

export default HomeScreen;
