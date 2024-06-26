import UserSessionProvider from "@/components/UserSessionProvider";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <UserSessionProvider>
      <Stack>
        <Stack.Screen name="index" options={{headerShown:false}} />
        <Stack.Screen name="restaurant/[restaurant]" options={{headerShown:false}} />
        <Stack.Screen name="login" options={{headerShown:false}} />
        <Stack.Screen name="register" options={{headerShown:false}} />
        <Stack.Screen name="panier" options={{headerShown:false}} />
        <Stack.Screen name="account_settings" options={{ headerShown: false }} />
        <Stack.Screen name="paiement" options={{ headerShown: false }} />
      </Stack>
  </UserSessionProvider>
    
  );
}