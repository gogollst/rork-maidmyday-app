import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "@/store/authStore";

export const unstable_settings = {
  initialRouteName: "(auth)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const { isAuthenticated } = useAuthStore();

  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen 
              name="task/[id]" 
              options={{ 
                headerShown: true,
                title: "Task Details",
                headerBackTitle: "Back",
              }} 
            />
            <Stack.Screen 
              name="schedule/[id]" 
              options={{ 
                headerShown: true,
                title: "Schedule Details",
                headerBackTitle: "Back",
              }} 
            />
            <Stack.Screen 
              name="chat/[id]" 
              options={{ 
                headerShown: true,
                title: "Chat",
                headerBackTitle: "Back",
              }} 
            />
            <Stack.Screen 
              name="notifications" 
              options={{ 
                headerShown: true,
                title: "Notifications",
                headerBackTitle: "Back",
              }} 
            />
            <Stack.Screen 
              name="profile" 
              options={{ 
                headerShown: true,
                title: "Profile",
                headerBackTitle: "Back",
              }} 
            />
          </>
        ) : (
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        )}
      </Stack>
    </>
  );
}