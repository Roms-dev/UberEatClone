import React, { useContext, useState } from 'react';
import { View, Text, Button, TextInput, Alert, StyleSheet } from 'react-native';
import { UserContext } from '@/components/UserSessionProvider';
import { router } from 'expo-router';

const AccountSettingsScreen = () => {
  const { email, changeEmail, changePassword, logout } = useContext(UserContext);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleChangeEmail = () => {
    if (newEmail) {
      changeEmail(newEmail)
        .then(() => {
          Alert.alert('Email changé avec succès');
          setNewEmail('');
        })
        .catch(error => {
          Alert.alert('Erreur', error.message);
        });
    } else {
      Alert.alert('Veuillez entrer un nouvel email');
    }
  };

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
    <View style={styles.container}>
      <Text style={styles.text}>Bienvenue, {email}</Text>
      <TextInput
        style={styles.input}
        placeholder="Nouveau Email"
        value={newEmail}
        onChangeText={setNewEmail}
      />
      <Button title="Changer d'Email" onPress={handleChangeEmail} />
      <TextInput
        style={styles.input}
        placeholder="Nouveau Mot de Passe"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <Button title="Changer de Mot de Passe" onPress={handleChangePassword} />
      <Button title="Se Déconnecter" onPress={handleLogout} />
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
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 5,
  },
});

export default AccountSettingsScreen;
