import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, Pressable } from 'react-native';
import { firebase } from '@react-native-firebase/firestore';
import { Link, useRouter } from 'expo-router';
import Icon from '@expo/vector-icons/FontAwesome';
import { Image } from 'expo-image';
import useUserSession from '@/hooks/useUserSession';
import * as Location from "expo-location"

const HomeScreen = () => {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [address, setAddress] = useState('');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [location, setLocation] = useState<any>(null)

  useEffect(() => {
  ;(async () => { 
    const { status } = await Location.requestBackgroundPermissionsAsync()

    if (status != 'granted') {
        setErrorMessage("ermission granted")
        return
    }

    const location = await Location.getCurrentPositionAsync()
    setLocation(location)
  })();
}, [])

  const { isAuthenticated } = useUserSession();
  const router = useRouter();


  useEffect(() => {
    const unsubscribe = firebase.firestore()
      .collection('Restaurant')
      .onSnapshot(querySnapshot => {
        const restaurants: any[] = [];
        querySnapshot.forEach((documentSnapshot) => {
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
        <TextInput
          style={styles.navBarAddress}
          placeholder="Saisissez votre adresse"
          value={address}
          onChangeText={address => setAddress(address)}
        />        
        <TouchableOpacity onPress={() => router.push('/panier')}>
          <Icon name="shopping-cart" size={24} color="#000" />
        </TouchableOpacity>
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
          // <TouchableOpacity style={styles.restaurantContainer} onPress={() => router.push(`/restaurant/${item.key}`)}>

            <Link href={`/restaurant/${item.key}`} asChild style={styles.restaurantContainer}>

            <Pressable>
              <View style={styles.restaurantWrapper}>
                <Image
                  style={styles.image}
                  source={item.img}
                  contentFit="cover"
                />
                <View style={styles.restaurantHeader}>
                  <Text style={styles.restaurantName}>{item.name}</Text>
                  <View style={styles.restaurantStarsContainer}>
                    <Text style={styles.restaurantStars}>{item.stars}</Text>
                  </View>
                </View>
                <Text style={styles.fraisLivraisons}>
                  Frais de livraison : {item.frais_livraisons / 100}€ • {item.temp_livraison} min
                </Text>
              </View>
            </Pressable>
            </Link>
          // </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      <View style={styles.navBarBottom}>
        <TouchableOpacity style={styles.navBarItem} onPress={() => router.push('/')}>
          <Icon name="home" size={24} color="#000" />
          <Text style={styles.navBarText}>Accueil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBarItem} onPress={() => router.push(isAuthenticated ? '/account_settings' : '/login')}>
          <Icon name="user" size={24} color="#000" />
          <Text style={styles.navBarText}>{isAuthenticated ? 'Paramètres' : 'Compte'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
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
    backgroundColor: '#f',
  },
  searchBar: {
    fontSize: 18,
    flex: 1,
    borderWidth: 0,
  },
  searchIcon: {
    marginRight: 10,
  },
  restaurantWrapper: {
    flex: 1,
  },
  restaurantContainer: {
    width: '100%',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 25,
  },
  restaurantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  restaurantName: {
    fontSize: 24,
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
    width: '100%',
    height: 170,
    borderRadius: 10,
    marginBottom: 10,
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
