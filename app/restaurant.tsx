import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
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
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>

                <View style={styles.restaurantImage}>
                <NavBar />
                </View>
                
                <View style={styles.container}>
                    <Text style={styles.title}>NOM RESTAURANT</Text>
                    <FlatList
                        data={restaurants}
                        keyExtractor={(item) => item.key}
                        renderItem={({ item }) => (
                        <View style={styles.content}>
                            <View style={styles.content}>
                            <Text style={styles.content}>{item.name}</Text>
                            <View style={styles.content}>
                                <Text style={styles.content}>{item.stars}</Text>
                            </View>
                            </View>
                            <Text style={styles.content}>Frais de livraison: {item.frais_livraisons / 100}€</Text>
                        </View>
                        )}
                    />
                </View>
                







                <View style={styles.content}>
                    <Text>item.name)</Text>
                    <Text>(NOTE + NOMBRE DE NOTES + FRAIS DE LIVRAISON + POSITION)</Text>
                    <Text>(ADRESSE)</Text>
                    <Text>(HORAIRES)</Text>
                </View>

                <View style={styles.content}>
                    <Text>(NOURRITURE)</Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        marginBottom: 20,
      },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    restaurantImage: {
        height: 120,
        backgroundColor: 'gold', 
    },
});

export default Restaurant 