import React, { useState } from "react";
import auth from '@react-native-firebase/auth';

export const UserContext = React.createContext<UserContextData>({
  userId: null,
  email: null,
  setUserId: () => {},
  setEmail: () => {},
  login: () => Promise.resolve(),
  changeEmail: () => Promise.resolve(),
  changePassword: () => Promise.resolve(),
  logout: () => {},
});

interface UserContextData {
  userId: string | null;
  email: string | null;
  setUserId: (id: string) => void;
  setEmail: (email: string) => void;
  login: (email: string, password: string) => Promise<void>;
  changeEmail: (newEmail: string) => Promise<void>;
  changePassword: (newPassword: string) => Promise<void>;
  logout: () => void;
}

const UserSessionProvider: React.FC = (props) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
      if (user) {
        const { uid, email } = user;
        setUserId(uid);
        setEmail(email);
      }
    } catch (error) {
      throw error;
    }
  };

  const changeEmail = async (newEmail: string) => {
    const user = auth().currentUser;
    if (user) {
      try {
        await user.updateEmail(newEmail);
        setEmail(newEmail);
      } catch (error) {
        throw error;
      }
    }
  };

  const changePassword = async (newPassword: string) => {
    const user = auth().currentUser;
    if (user) {
      try {
        await user.updatePassword(newPassword);
      } catch (error) {
        throw error;
      }
    }
  };

  const logout = () => {
    auth().signOut();
    setUserId(null);
    setEmail(null);
  };

  return (
    <UserContext.Provider value={{ userId, email, setUserId, setEmail, login, changeEmail, changePassword, logout }} {...props} />
  );
};

export default UserSessionProvider;
