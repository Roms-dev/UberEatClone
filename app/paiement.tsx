import ImageContainer from "@/components/ImageContainer";
import NavBar from "@/components/NavBar";
import { firebase } from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";
import { View, SafeAreaView, ScrollView, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import useUserSession from '@/hooks/useUserSession';
import { router } from "expo-router";

const Paiement = () => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView>
                <View style={styles.container}>
                    <Text style={styles.title}>Page de paiement</Text>
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
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
    }
});

export default Paiement;
