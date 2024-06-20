import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import { firebase } from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';
import { router, Link, useLocalSearchParams } from 'expo-router';
import { red } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';
import { Image } from 'expo-image';


const NavBar = () => {
    const [heartColor, setHeartColor] = useState('white');
    const [pointsColor, setPointsColor] = useState('white');

    const toggleHeartColor = () => {
        setHeartColor(prevColor => (prevColor === 'white' ? 'green' : 'white'));
    };

    const togglePointsColor = () => {
        setPointsColor(prevColor => (prevColor === 'white' ? 'black' : 'white'));
    };
    return (
        <View style={styles.navBar}>
            <View>
                <Icon style={styles.iconContainer} name="arrow-back" size={30} color='white' onPress={() => { router.back() }} />
            </View>

            <View>
            </View>

            <View>
                <TouchableOpacity onPress={toggleHeartColor}>
                    <Icon style={styles.iconContainer} name="heart" size={30} color={heartColor} />
                </TouchableOpacity>
            </View>

            <View>
                <Icon style={styles.iconContainer} name="search" size={30} color="white" />
            </View>

            <View>
                <TouchableOpacity onPress={togglePointsColor}>
                    <Icon style={styles.iconContainer} name="ellipsis-horizontal" size={30} color={pointsColor} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const Restaurant = () => {

    const truncateIngredients = (ingredients, maxLength) => {
        const allIngredients = ingredients.join(', ');
        if (allIngredients.length <= maxLength) {
            return allIngredients;
        }
        return allIngredients.substring(0, maxLength) + '...';
    };

    const { restaurant: restaurantId } = useLocalSearchParams()

    const [restaurant, setRestaurant] = useState<null | { name: string, stars: number, number_of_notes: number, img: string, frais_livraisons: string, distance: string, address: string }>();

    const [plats, setPlats] = useState<{ key: string, name: string, prix: number, url: string, ingredients: string[] }[]>([]);

    // const [isModalVisible, setModalVisible] = useState(false);

    // const toggleModal = () => {
    //     setModalVisible(!isModalVisible);
    // };

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
                    <Image
                        style={styles.imageRestaurant}
                        source={restaurant.img}
                        contentFit="cover"
                    />

                </View>
                <NavBar />

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
                                        <Text style={styles.AEmporter}>
                                            A Emporter
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.buttonColumn2}>
                                <Text style={styles.CommandeGroupee}>
                                    <Icon name="person-add" size={16} color="black" /> Commande groupée
                                </Text>
                            </View>
                        </View>
                        <Text style={styles.subTitle}>Nos plats à emporter</Text>
                    </View>

                    {plats.map((item) => (
                        <Link href={`/restaurant/${restaurantId}/${item.key}`} asChild style={styles.foodContainer}>
                            <Pressable>

                            <View style={styles.row}>

                                <View style={styles.column1}>

                                    <Text style={styles.littleTitle}>{item.name}</Text>

                                    <Text style={styles.price}>{item.prix ? (item.prix / 100).toFixed(2) : ''}€</Text>

                                    {item.ingredients != null && (
                                        <Text>{truncateIngredients(item.ingredients, 60)}</Text> // Ajustez la longueur maximale ici

                                    )}

                                </View>

                                <View style={styles.column2}>
                                    <Image
                                        style={styles.image}
                                        source={item.url}
                                        contentFit="cover"
                                    />
                                </View>
                            </View>

                            </Pressable>
                        </Link>
                    ))}
                    {/* <FlatList
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
                                <Image
                                style={styles.image}
                                source={item.url}
                                contentFit="cover"
                                />
                            </View>
                        </View>
                    </View>
                    )}
                /> */}


                </View>
            </ScrollView>

            {/* <Modal
                transparent={true}
                visible={isModalVisible}
                animationType="slide"
                onRequestClose={toggleModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text>Menu Options</Text>
                        <TouchableOpacity onPress={toggleModal}>
                            <Text>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal> */}

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
    buttonContainer: {
        margin: 5,
    },
    iconContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 25,
        padding: 5,
    },
    navBar: {
        width: '100%',
        height: 100,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        position: 'absolute',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    subTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 10,
        marginTop: 5,
    },
    CommandeGroupee: {
        fontSize: 12,
    },
    Livraison: {
        fontSize: 12,
    },
    AEmporter: {
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
        height: 150,
        backgroundColor: 'gold',
        position: 'relative',
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
        maxWidth: '75%',
    },
    column2: {
        flex: 1,
        backgroundColor: 'red',
        marginTop: 10,
        marginBottom: 5,
        marginRight: 15,
        borderRadius: 10,
    },
    image: {
        flex: 1,
        width: '100%',
        backgroundColor: '#0553',
        borderRadius: 10,
    },
    imageRestaurant: {
        flex: 1,
        width: '100%',
    },
    // modalContainer: {
    //     flex: 1,
    //     justifyContent: 'flex-end',
    //     backgroundColor: 'rgba(0, 0, 0, 0.5)',
    // },
    // modalContent: {
    //     backgroundColor: 'white',
    //     padding: 20,
    //     borderTopLeftRadius: 20,
    //     borderTopRightRadius: 20,
    //     minHeight: '50%',
    // },
});

export default Restaurant 