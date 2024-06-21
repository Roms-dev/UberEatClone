// useUserSession.ts
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '@/components/UserSessionProvider';
import auth from '@react-native-firebase/auth';

export default function useUserSession() {
  const { userId, setUserId } = useContext(UserContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        setIsAuthenticated(true);
        setUserId(user.uid); // Mettre à jour l'ID d'utilisateur si nécessaire
      } else {
        setIsAuthenticated(false);
        setUserId(''); // Réinitialiser l'ID d'utilisateur si déconnecté
      }
    });

    return () => unsubscribe();
  }, []);

  return { userId, isAuthenticated, setUserId };
}
