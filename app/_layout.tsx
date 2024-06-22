import UserSessionProvider from "@/components/UserSessionProvider";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <UserSessionProvider >
      <Stack>
        <Stack.Screen name="index" options={{headerShown:false}} />
        <Stack.Screen name="restaurant/[restaurant]" options={{headerShown:false}} />
        <Stack.Screen name="login"  />
        <Stack.Screen name="register" />
        <Stack.Screen name="pannier" options={{headerShown:false}} />
      </Stack>
  </UserSessionProvider>
    
  );
}