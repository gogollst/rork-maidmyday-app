import React from "react";
import { Tabs } from "expo-router";
import { 
  Home, 
  Calendar, 
  CheckSquare, 
  MessageSquare, 
  Settings 
} from "lucide-react-native";
import { colors } from "@/constants/colors";
import { useNotificationStore } from "@/store/notificationStore";
import { useChatStore } from "@/store/chatStore";

export default function TabLayout() {
  const { notifications } = useNotificationStore();
  const { conversations } = useChatStore();
  
  // Calculate unread notifications
  const unreadNotifications = notifications.filter(n => !n.read).length;
  
  // Calculate unread messages
  const unreadMessages = conversations.reduce(
    (total, conv) => total + conv.unreadCount,
    0
  );

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray[500],
        tabBarStyle: {
          borderTopColor: colors.gray[200],
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTitleStyle: {
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} />
          ),
          tabBarLabel: "Home",
        }}
      />
      <Tabs.Screen
        name="schedules"
        options={{
          title: "Weekly Plans",
          tabBarIcon: ({ color, size }) => (
            <Calendar size={size} color={color} />
          ),
          tabBarLabel: "Plans",
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: "Tasks",
          tabBarIcon: ({ color, size }) => (
            <CheckSquare size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color, size }) => (
            <MessageSquare size={size} color={color} />
          ),
          tabBarBadge: unreadMessages > 0 ? unreadMessages : undefined,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Settings size={size} color={color} />
          ),
          tabBarBadge: unreadNotifications > 0 ? unreadNotifications : undefined,
        }}
      />
    </Tabs>
  );
}