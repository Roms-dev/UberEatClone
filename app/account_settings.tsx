import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { UserContext } from '@/components/UserSessionProvider';
import { useRouter } from 'expo-router';
import NavBar from '@/components/NavBar';

const AccountSettingsScreen = () => {
  const { changePassword, logout } = useContext(UserContext);
  const [newPassword, setNewPassword] = useState('');
  const router = useRouter();

  const handleChangePassword = () => {
    if (newPassword) {
      changePassword(newPassword)
        .then(() => {
          Alert.alert('Mot de passe changé avec succès');
          setNewPassword('');
        })
        .catch(error => {
          Alert.alert('Erreur', error.message);
        });
    } else {
      Alert.alert('Veuillez entrer un nouveau mot de passe');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavBar />
      <View style={styles.container}>
        <Text style={styles.title}>Paramètres</Text>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nouveau Mot de Passe"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
              <Text style={styles.buttonText}>Changer de Mot de Passe</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <View style={styles.logoutButton}>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#bf2f38' }]} onPress={handleLogout}>
            <Text style={styles.buttonText}>Se Déconnecter</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#149234',
    fontWeight: 'bold',
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
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
    backgroundColor: '#162328',
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    padding: 8,
  },
  logoutButton: {
    marginVertical: 20,
    width: '100%',
  },
});

export default AccountSettingsScreen;
