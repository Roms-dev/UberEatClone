import { Image } from 'expo-image';
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import NavBar from '@/components/NavBar';


const LoginScreen = () => {
  return (
    <View style={styles.container}>
        <Image
                style={styles.image}
                source={{uri: 'https://tse3.mm.bing.net/th?id=OIP.wd2TqQZ0tAIUOyCWjcWZkgAAAA&pid=Api&P=0&h=180'}}
                contentFit="contain"
        />
      <Text style={styles.title}>Login</Text>
      <TextInput style={styles.input} placeholder="Email" />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry />
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
        <Link href="/register">
            <Text style={styles.signupText}>Vous n'avez pas de comptes? Inscrivez-vous</Text>
        </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 150,  
    height: 150, 
    marginBottom: 20,
    borderRadius: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#149234',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 5,
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#162328',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  signupText: {
    marginTop: 20,
    color: '#149234',
    fontSize: 16,
    fontWeight: 'bold',

  },
});

export default LoginScreen;