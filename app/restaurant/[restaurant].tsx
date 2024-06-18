import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import { firebase } from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';
import { router, Link, useLocalSearchParams } from 'expo-router';
import { red } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';


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
            <View>
                <Icon name="arrow-back" size={30} color='black' onPress={() => { router.back() }} />
            </View>

            <View>
            </View>

            <View>
                <TouchableOpacity onPress={toggleHeartColor}>
                    <Icon name="heart" size={30} color={heartColor} />
                </TouchableOpacity>
            </View>

            <View>
                <Icon name="search" size={30} color="black" />
            </View>

            <View>
                <TouchableOpacity onPress={togglePointsColor}>
                    <Icon name="ellipsis-horizontal" size={30} color={pointsColor} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const Restaurant = () => {

    const { restaurant: restaurantId } = useLocalSearchParams()

    const [restaurant, setRestaurant] = useState<null | { name: string, stars: number, number_of_notes: number, frais_livraisons: string, distance: string, address: string }>();

    const [plats, setPlats] = useState<{key:string, name: string, prix:string, ingredients:array }[]>([]);

    useEffect(() => {
        const unsubscribe = firebase.firestore()
            .collection('Restaurant')
            .doc(restaurantId as string)
            .onSnapshot(querysnapshot => {
                console.log(querysnapshot.data())
                setRestaurant(querysnapshot.data());
            });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const unsubscribe = firebase.firestore()
            .collection('Restaurant')
            .doc(restaurantId as string)
            .collection('Plats')
            .onSnapshot(querysnapshot => {

                const plats: any[] = [];
                    querysnapshot.forEach((documentSnapshot) => {
                        plats.push({
                   ...documentSnapshot.data(),
                  key: documentSnapshot.id,
                  });
             });
                setPlats(plats);
            });
        return () => unsubscribe();
    }, []);

    if (restaurant == null) return null

    return (
        <SafeAreaView>
            <ScrollView>

                <View style={styles.restaurantImage}>
                    <NavBar />
                </View>

                <View>

                    <View style={styles.informationContainer}>
                        <Text style={styles.title}>{restaurant.name}</Text>

                        <Text style={styles.content}>{restaurant.stars} ★ (+{restaurant.number_of_notes}) • Frais de livraison : {restaurant.frais_livraisons / 100}€</Text>

                        <Text style={styles.content}>Distance: {restaurant.distance / 100} KM</Text>

                        <Text style={styles.content}>
                            <Icon name="location-outline" size={16} color="black" />
                            {restaurant.address}
                        </Text>

                        <Text style={styles.content}>Appuyer pour consulter les horaires, les informations, etc.</Text>
                    </View>


                <View style={styles.buttonContainer}>
                    <View style={styles.buttonRow}>
                        <View style={styles.buttonColumn1}>
                            <View style={styles.buttonRow}>
                                <View style={styles.buttonColumn1bis}>
                                    <Text style={styles.Livraison}>
                                        Livraison
                                    </Text>
                                </View>
                                <View style={styles.buttonColumn2bis}>
                                    <Text  style={styles.AEmporter}>
                                    A Emporter
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.buttonColumn2}>
                            <Text  style={styles.CommandeGroupee}>
                                <Icon name="person-add" size={16} color="black" /> Commande groupée
                            </Text>
                        </View>
                    </View>
                </View>


                <FlatList
                data={plats}
                keyExtractor={(item) => item.key}
                renderItem={({ item }) => (
                    <View style={styles.foodContainer}>
                        <View style={styles.row}>

                            <View style={styles.column1}>

                                <Text style={styles.littleTitle}>{item.name}</Text>

                                <Text style={styles.price}>{item.prix / 100}€</Text>

                                <Text>ingrédients</Text>

                            </View>

                            <View style={styles.column2}>
                                <Text>(IMAGE)</Text>
                            </View>
                        </View>
                    </View>
                    )}
                />


                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    informationContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    foodContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: 'grey',
    },
    photoContainer: {
        backgroundColor: 'black',
        borderRadius: 5,
    },
    buttonContainer: {
        margin: 5,
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
    CommandeGroupee: {
        fontSize: 12,
    },
    Livraison: {
        fontSize: 12,
    },
    AEmporter : {
        fontSize: 12,
        color: 'grey',
    },
    littleTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    price: {
        fontSize: 16,
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
    buttonRow: {
        flexDirection: 'row',
    },
    row: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    buttonColumn1: {
        flex: 1,
        padding: 5,
        marginTop: 10,
        marginBottom: 5,
        marginLeft: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        backgroundColor: 'lightgrey',
    },
    buttonColumn2: {
        flex: 1,
        padding: 5,
        marginTop: 10,
        marginBottom: 5,
        marginLeft: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        backgroundColor: 'lightgrey',
    },
    buttonColumn1bis: {
        flex: 1,
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        backgroundColor: 'white',
    },
    buttonColumn2bis: {
        flex: 1,
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        backgroundColor: 'lightgrey',
    },
    column1: {
        flex: 2,
        padding: 10,
        marginTop: 10,
        marginBottom: 5,
        marginLeft: 5,
    },
    column2: {
        flex: 1,
        backgroundColor: 'red',
        padding: 10,
        marginTop: 10,
        marginBottom: 5,
        marginRight: 15,
        borderRadius: 10,
    },
});

export default Restaurant 