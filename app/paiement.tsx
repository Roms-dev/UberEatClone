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
                <Text>test</Text>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
});


export default Paiement;
