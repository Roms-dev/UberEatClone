import { firebase } from '@react-native-firebase/firestore';
import { Link, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, StyleSheet, Text, SafeAreaView, ActivityIndicator, Image, Pressable } from 'react-native';

const PlatContainer = () => {

    const truncateIngredients = (ingredients, maxLength) => {
        const allIngredients = ingredients.join(', ');
        if (allIngredients.length <= maxLength) {
            return allIngredients;
        }
        return allIngredients.substring(0, maxLength) + '...';
    };

    const { restaurant: restaurantId } = useLocalSearchParams();
    const [plats, setPlats] = useState<{ key: string, name: string, prix: number, url: string, ingredients: string[] }[]>([]);
    // const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     const unsubscribe = firebase.firestore()
    //         .collection('Restaurant')
    //         .doc(restaurantId as string)
    //         .collection('Plats')
    //         .onSnapshot(querysnapshot => {
    //             const plats: any[] = [];
    //             querysnapshot.forEach((documentSnapshot) => {
    //                 plats.push({
    //                     ...documentSnapshot.data(),
    //                     key: documentSnapshot.id,
    //                 });
    //             });
    //             setPlats(plats);
    //             setLoading(false);
    //         });
    //     return () => unsubscribe();
    // }, [restaurantId]);

    // if (loading) {
    //     return (
    //         <SafeAreaView style={styles.loaderContainer}>
    //             <ActivityIndicator size="large" color="green" />
    //         </SafeAreaView>
    //     );
    // }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {plats.map((item) => (
                <Link key={item.key} href={`/restaurant/${restaurantId}/${item.key}`} asChild style={styles.foodContainer}>
                    <Pressable>
                        <View style={styles.row}>
                            <View style={styles.column1}>
                                <Text style={styles.littleTitle}>{item.name}</Text>
                                <Text style={styles.price}>{item.prix ? (item.prix / 100).toFixed(2) : ''}€</Text>
                                {item.ingredients != null && (
                                    <Text>{truncateIngredients(item.ingredients, 60)}</Text>
                                )}
                            </View>
                            <View style={styles.column2}>
                                <Image
                                    style={styles.image}
                                    source={{ uri: item.url }}
                                    contentFit="cover"
                                />
                            </View>
                        </View>
                    </Pressable>
                </Link>
            ))}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    foodContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: 'grey',
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
        marginTop: 10,
        marginBottom: 5,
        marginRight: 15,
        borderRadius: 10,
    },
    image: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: '#0553',
        borderRadius: 10,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 10,
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
});

export default PlatContainer;
