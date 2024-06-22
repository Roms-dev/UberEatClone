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
        setUserId(user.uid);
      } else {
        setIsAuthenticated(false);
        setUserId('');
      }
    });

    return () => unsubscribe();
  }, []);

  return { userId, isAuthenticated, setUserId };
}
