import ImageContainer from "@/components/ImageContainer";
import NavBar from "@/components/NavBar";
import { firebase } from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";
import { View, SafeAreaView, ScrollView, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import useUserSession from '@/hooks/useUserSession';
import { router } from "expo-router";

const Panier = () => {
    const { userId } = useUserSession();
    const [cart, setCart] = useState<any[]>([]);
    const [cartRestaurant, setCartRestaurant] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const paiement = () => {
        router.push('/paiement');
    };

    const calculateTotalPrice = () => {
        let totalPrice = 0;
        cart.forEach(item => {
            totalPrice += item.prix;
        });
        return totalPrice;
    };

    useEffect(() => {
        if (userId) {
            const unsubscribe = firebase.firestore()
                .collection('Panier')
                .doc(userId)
                .onSnapshot(querySnapshot => {
                    const data = querySnapshot.data();
                    console.log("Fetched data from Firestore:", data);
                    if (data && data.plats) {
                        console.log("Plats data:", data.plats);
                        setCart(data.plats);
                        setCartRestaurant(data.restaurantName);
                    } else {
                        setCart([]);
                    }
                    setLoading(false);
                });

            return () => unsubscribe();
        } else {
            setLoading(false);
        }
    }, [userId]);

    console.log("Cart state:", cart);

    if (loading) {
        return (
            <SafeAreaView style={styles.loaderContainer}>
                <Text>Chargement...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView>
                <ImageContainer />
                <NavBar />
    
                <View style={styles.container}>
                    <Text style={styles.itemRestaurantName}>{cartRestaurant}</Text>
                    {cart.length > 0 ? (
                        cart.map((item, index) => (
                            <View key={index} style={styles.cartItem}>
                                <Image
                                    style={styles.image}
                                    source={{ uri: item.url }}
                                />
                                <View style={styles.infoContainer}>
                                    <Text style={styles.itemName}>{item.platName}</Text>
                                    <Text style={styles.itemPrice}>{(item.prix / 100).toFixed(2)}€</Text>
                                    <Text style={styles.itemPrice}>Quantité : 1</Text>
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.emptyCartText}>Votre panier est vide.</Text>
                    )}
                    <Text style={styles.itemName}>Prix total : {(calculateTotalPrice() / 100).toFixed(2)}€</Text>
                    <TouchableOpacity style={styles.orderButton} onPress={paiement}>
                    <Text style={styles.orderButtonText}>Valider la commande</Text>
                    </TouchableOpacity>
                </View>
                
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        padding: 10,
        paddingBottom: 120,
    },
    cartItem: {
        flexDirection: 'row',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderColor: 'grey',
        paddingBottom: 10,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginRight: 10,
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    itemRestaurantName: {
        fontSize: 28,
        fontWeight: 'bold',
        padding: 5,
        marginBottom: 5,
    },
    itemName: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    itemPrice: {
        fontSize: 18,
        color: 'grey',
    },
    emptyCartText: {
        textAlign: 'center',
        fontSize: 16,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    orderButton: {
        backgroundColor: '#162328',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    orderButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});


export default Panier;
