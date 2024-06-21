import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{headerShown:false}} />
      <Stack.Screen name="restaurant/[restaurant]" options={{headerShown:false}} />
      <Stack.Screen name="pannier" options={{headerShown:false}} />
    </Stack>
  );
}