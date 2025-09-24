import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { useAuthStore } from "@/store/authStore";

export const unstable_settings = {
  initialRouteName: "(auth)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const { isAuthenticated } = useAuthStore();

  return (
    <>
      <StatusBar style={styles.statusBarStyle} />
      <Stack screenOptions={styles.stackScreenOptions}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="(tabs)" options={styles.tabsScreenOptions} />
            <Stack.Screen 
              name="task/[id]" 
              options={styles.taskScreenOptions} 
            />
            <Stack.Screen 
              name="schedule/[id]" 
              options={styles.scheduleScreenOptions} 
            />
            <Stack.Screen 
              name="chat/[id]" 
              options={styles.chatScreenOptions} 
            />
            <Stack.Screen 
              name="notifications" 
              options={styles.notificationsScreenOptions} 
            />
            <Stack.Screen 
              name="profile" 
              options={styles.profileScreenOptions} 
            />
            <Stack.Screen 
              name="create-task" 
              options={styles.createTaskScreenOptions} 
            />
            <Stack.Screen 
              name="modal" 
              options={styles.modalScreenOptions} 
            />
          </>
        ) : (
          <Stack.Screen name="(auth)" options={styles.authScreenOptions} />
        )}
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  stackScreenOptions: {
    headerShown: false,
  },
  authScreenOptions: {
    headerShown: false,
  },
  tabsScreenOptions: {
    headerShown: false,
  },
  taskScreenOptions: {
    headerShown: true,
    title: "Task Details",
    headerBackTitle: "Back",
  },
  scheduleScreenOptions: {
    headerShown: true,
    title: "Schedule Details",
    headerBackTitle: "Back",
  },
  chatScreenOptions: {
    headerShown: true,
    title: "Chat",
    headerBackTitle: "Back",
  },
  notificationsScreenOptions: {
    headerShown: true,
    title: "Notifications",
    headerBackTitle: "Back",
  },
  profileScreenOptions: {
    headerShown: true,
    title: "Profile",
    headerBackTitle: "Back",
  },
  createTaskScreenOptions: {
    headerShown: true,
    title: "Create Task",
    headerBackTitle: "Back",
  },
  modalScreenOptions: {
    headerShown: true,
    title: "Modal",
    headerBackTitle: "Back",
    presentation: "modal",
  },
  statusBarStyle: "auto" as const,
});