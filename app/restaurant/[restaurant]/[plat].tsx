import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { firebase } from '@react-native-firebase/firestore';
import { router, useLocalSearchParams } from 'expo-router';
// import { Image } from 'expo-image';
import NavBar from '@/components/NavBar';
import ImageContainer from '@/components/ImageContainer';

const Plat = () => {
    const { restaurant: restaurantId, plat: platId } = useLocalSearchParams();
    const [plat, setPlat] = useState<{ key: string, name: string, prix: number, url: string, ingredients: string[] } | null>(null);
    const [loading, setLoading] = useState(true);
    const [showAddToCartButton, setShowAddToCartButton] = useState(true);
    const [cart, setCart] = useState<{ key?: string, name?: string, prix?: number, url?: string, ingredients?: string[] }[]>([]);

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

    const handleAddToCart = () => {
        if (plat) {
            setCart([...cart, plat]);
            setShowAddToCartButton(false);
        }
    };

    const handleViewCart = () => {
        router.push('/pannier');
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
            <ImageContainer imageUrl = {plat.url} />
                {/* <View style={styles.platImage}>
                    {plat.url && (
                        <Image
                            style={styles.imagePlat}
                            source={plat.url}
                            contentFit="cover"
                        />
                    )}
                </View> */}
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
            </ScrollView>
            {showAddToCartButton ? (
                <TouchableOpacity style={styles.orderButton} onPress={handleAddToCart}>
                    <Text style={styles.orderButtonText}>Ajouter au panier • {plat.prix ? (plat.prix / 100).toFixed(2) : ''}€</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity style={styles.orderButton} onPress={handleViewCart}>
                    <Text style={styles.orderButtonText}>Voir le panier ({cart.length} {cart.length === 1 ? 'article' : 'articles'})</Text>
                </TouchableOpacity>
            )}
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
    // platImage: {
    //     height: 200,
    //     backgroundColor: 'gold',
    //     position: 'relative',
    // },
    // imagePlat: {
    //     flex: 1,
    //     width: '100%',
    // },
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
});

export default Plat;
