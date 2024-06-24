import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, Pressable } from 'react-native';
import { firebase } from '@react-native-firebase/firestore';
import { Link, useRouter } from 'expo-router';
import Icon from '@expo/vector-icons/FontAwesome';
import { Image } from 'expo-image';
import useUserSession from '@/hooks/useUserSession';
import * as Location from "expo-location";

const HomeScreen = () => {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [address, setAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [location, setLocation] = useState<any>(null);
  const [locationAddress, setLocationAddress] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setErrorMessage("Permission not granted");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      // Geocoding with OpenCage API
      const { latitude, longitude } = location.coords;
      const apiKey = '6d33fe48ce624bfda7db14c2bde9fa40'; // Replace with your OpenCage API key
      try {
        const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?key=${apiKey}&q=${latitude}+${longitude}&pretty=1`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data); // Pour voir ce que vous avez récupéré dans la console
        if (data.results && data.results.length > 0) {
          setLocationAddress(data.results[0].formatted);
        } else {
          setErrorMessage('No address found');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        setErrorMessage('Failed to fetch address');
      }
      
    })();
  }, []);

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
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        {location ? (
          <View style={styles.locationContainer}>
            {locationAddress && <Text style={styles.locationText}>Adresse: {locationAddress}</Text>}
          </View>
        ) : errorMessage ? (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        ) : (
          <Text style={styles.loadingMessage}>Chargement de la localisation...</Text>
        )}
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
  locationContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  locationText: {
    fontSize: 16,
    color: '#333',
  },
  errorMessage: {
    fontSize: 16,
    color: 'red',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  loadingMessage: {
    fontSize: 16,
    color: '#333',
    paddingHorizontal: 20,
    paddingVertical: 10,
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
