import React, { useContext, useState } from 'react';
import { View, Text, Button, TextInput, Alert, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
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
    <SafeAreaView>
      <ScrollView contentContainerStyle={{ paddingBottom: 150 }}>
        <NavBar />
        <View style={styles.container}>
          <Text style={styles.title}>Paramètres</Text>
          <TextInput
            style={styles.input}
            placeholder="Nouveau Mot de Passe"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <Button title="Changer de Mot de Passe" onPress={handleChangePassword} color="#162328" />
          <View style={styles.logoutButton}>
            <Button title="Se Déconnecter" onPress={handleLogout} color="#bf2f38" />
          </View>
        </View>
      </ScrollView>
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
  logoutButton: {
    marginTop: 20,
    width: '100%',
  },
});

export default AccountSettingsScreen;
