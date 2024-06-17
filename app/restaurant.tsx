import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import { firebase } from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';
import { router, Link } from 'expo-router';
    

const NavBar = () => {
    const [heartColor, setHeartColor] = useState('black');
    const [pointsColor, setPointsColor] = useState('black');

    const toggleHeartColor = () => {
        setHeartColor(prevColor => (prevColor === 'black' ? 'green' : 'black'));
    };

    const togglePointsColor = () => {
        setPointsColor(prevColor => (prevColor === 'black' ? 'white' : 'black'));
    };
        return (
            <View style={styles.navBar}>

            <Icon name="arrow-back" size={30} color='black' onPress={()=>{router.back()}} />

            <TouchableOpacity onPress={toggleHeartColor}>
                <Icon name="heart" size={30} color={heartColor} />
            </TouchableOpacity>

            <Icon name="search" size={30} color="black" />

            <TouchableOpacity onPress={togglePointsColor}>
                <Icon name="ellipsis-horizontal" size={30} color={pointsColor} />
            </TouchableOpacity>
        </View>
        );
};

const Restaurant = () => {



    //Fonctionne pas ici

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
        <SafeAreaView>
            <ScrollView>

                <View style={styles.restaurantImage}>
                <NavBar />
                </View>
                
                    <FlatList
                        data={restaurants}
                        keyExtractor={(item) => item.key}
                        renderItem={({ item }) => (
                        <View style={styles.content}>

                            <View style={styles.informationContainer}>
                                <Text style={styles.title}>{item.name}</Text>
                                
                                <Text style={styles.content}>{item.stars} ★ (+{item.number_of_notes}) • Frais de livraison : {item.frais_livraisons / 100}€</Text>
                                
                                <Text style={styles.content}>Distance: {item.distance / 100} KM</Text>

                                <Text style={styles.content}>
                                    <Icon name="location-outline" size={16} color="black" />
                                    {item.adresse}blablabla
                                </Text>
                                
                                <Text style={styles.content}>Appuyer pour consulter les horaires, les informations, etc.</Text>
                            </View>



                            <View style={styles.foodContainer}>
                                <View style={styles.row}>
                                    <View style={styles.column1}>
                                        <Text>nom + prix + note + nombre d'avis + ingrédients</Text>
                                    </View>
                                    <View style={styles.column2}>
                                    <Text>(IMAGE)</Text>
                                    </View>
                                </View>
                            </View>
                            


                        </View>
                        )}/>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    informationContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'lightblue'
    },
    foodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'pink',
    },
    photoContainer: {
        backgroundColor: 'black',
        borderRadius: 5,
    },
    navBar: {
        height: 100,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    navBarText: {
        color: 'white',
        fontSize: 18,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 2,
      },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 16,
    },
    restaurantImage: {
        height: 120,
        backgroundColor: 'gold', 
    },
    row: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    column1: {
        flex: 2,
        backgroundColor: 'pink',
        padding: 10,
        marginTop: 10,
        marginBottom: 5,
        marginLeft: 5,
    },
    column2: {
        flex: 1,
        backgroundColor: 'purple',
        padding: 10,
        marginTop: 10,
        marginBottom: 5,
        marginRight: 5,
    },
});

export default Restaurant 