import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { firebase } from '@react-native-firebase/firestore';
import { router, useLocalSearchParams } from 'expo-router';
// import { Image } from 'expo-image';
import NavBar from '@/components/NavBar';
import ImageContainer from '@/components/ImageContainer';
import useUserSession from '@/hooks/useUserSession';
import Restaurant from '.';

const Plat = () => {
    const { restaurant: restaurantId, plat: platId } = useLocalSearchParams();
    const [restaurant, setRestaurant] = useState<null | { name: string, stars: number, number_of_notes: number, img: string, frais_livraisons: string, distance: string, address: string }>();
    const [plat, setPlat] = useState<{ key: string, name: string, prix: number, url: string, ingredients: string[] } | null>(null);
    const [loading, setLoading] = useState(true);
    const [showAddToCartButton, setShowAddToCartButton] = useState(true);
    const [cart, setCart] = useState<{ key?: string, name?: string, prix?: number, url?: string, ingredients?: string[] }[]>([]);
    const { userId } = useUserSession();

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
            .collection(`Restaurant/${restaurantId}/Plats`)
            .doc(platId as string)
            .onSnapshot(querysnapshot => {
                const data = querysnapshot.data();
                if (data) {
                    setPlat({ ...data, key: querysnapshot.id });
                }
                setLoading(false);
            });

        return () => unsubscribe();
    }, [platId]);

    useEffect(() => {
        if (userId) {
            const cartRef = firebase.firestore().collection('Panier').doc(userId);
    
            const unsubscribe = cartRef.onSnapshot(querySnapshot => {
                const data = querySnapshot.data();
                if (data && data.plats) {
                    setCart(data.plats);
                } else {
                    setCart([]);
                }
            });
    
            return () => unsubscribe();
        }
    }, [userId]);

    // const handleAddToCart = () => {
    //     if (!userId) return
    //     if (plat) {
    //         setCart([...cart, plat]);
    //         setShowAddToCartButton(false);

    //         firebase.firestore()
    //         .collection(`Panier`)
    //         .doc(userId)
    //         .set({
    //             userId,
    //             restaurantId,
    //             plats: [plat],
    //         })
    //     }
    // };

    const handleAddToCart = async () => {
        if (plat && userId) {
            setCart([...cart, plat]);
            setShowAddToCartButton(false);

            const panierRef = firebase.firestore().collection('Panier').doc(userId);

            try {
                await panierRef.set({
                    userId,
                    restaurantId,
                    restaurantName: restaurant?.name || '',
                }, { merge: true });

                await panierRef.update({
                    plats: firebase.firestore.FieldValue.arrayUnion({
                        platId,
                        platName: plat.name,
                        prix: plat.prix,
                        url: plat.url,
                        ingredients: plat.ingredients,
                    })
                });

            } catch (error) {
                console.error("Erreur de mise à jour du panier : ", error);
            }
        }
    };

    const handleViewCart = () => {
        router.push('/panier');
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </SafeAreaView>
        );
    }

    if (!plat) {
        return (
            <SafeAreaView style={styles.loaderContainer}>
                <Text>Plat non disponible</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView>
            <ScrollView contentContainerStyle={{ paddingBottom: 150 }}>
                <ImageContainer imageUrl={plat.url} />
                <NavBar />

                <View>
                    <View style={styles.informationContainer}>
                        <Text style={styles.littleTitle}>{plat.name}</Text>
                        <Text style={styles.price}>{plat.prix ? (plat.prix / 100).toFixed(2) : ''}€</Text>
                        {plat.ingredients && (
                            <Text>{plat.ingredients.join(', ')}</Text>
                        )}
                    </View>
                </View>
            {showAddToCartButton ? (
                <TouchableOpacity
                    style={[styles.orderButton, !userId && styles.disabledButton]}
                    onPress={handleAddToCart}
                    disabled={!userId}
                >
                    <Text style={styles.orderButtonText}>
                        {userId ? `Ajouter au panier • ${plat.prix ? (plat.prix / 100).toFixed(2) : ''}€` : 'Vous devez être connecté'}
                    </Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity style={styles.orderButton} onPress={handleViewCart}>
                    <Text style={styles.orderButtonText}>Voir le panier ({cart.length} {cart.length === 1 ? 'article' : 'articles'})</Text>
                </TouchableOpacity>
            )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    iconContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 25,
        padding: 5,
    },
    informationContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: 10,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    littleTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    price: {
        fontSize: 20,
        marginBottom: 2,
        color: 'grey',
    },
    orderButton: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: '#162328',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    orderButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
});

export default Plat;
