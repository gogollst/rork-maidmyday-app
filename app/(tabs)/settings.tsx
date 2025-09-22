import React from "react";
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Switch } from "react-native";
import { useRouter } from "expo-router";
import { 
  User, 
  Bell, 
  Moon, 
  Shield, 
  HelpCircle, 
  LogOut 
} from "lucide-react-native";
import { colors } from "@/constants/colors";
import { typography } from "@/constants/typography";
import { SettingsItem } from "@/components/SettingsItem";
import { useAuthStore } from "@/store/authStore";
import { useNotificationStore } from "@/store/notificationStore";

export default function SettingsScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { notifications } = useNotificationStore();
  const [darkMode, setDarkMode] = React.useState(false);
  
  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.profileSection}>
        <Image
          source={{ uri: user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" }}
          style={styles.profileImage}
        />
        <Text style={typography.h2}>{user?.name}</Text>
        <Text style={[typography.body, styles.emailText]}>{user?.email}</Text>
        <TouchableOpacity
          style={styles.editProfileButton}
          onPress={() => router.push("/profile")}
        >
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.settingsSection}>
        <Text style={[typography.h3, styles.sectionTitle]}>Preferences</Text>
        
        <SettingsItem
          title="Notifications"
          icon={<Bell size={20} color={colors.primary} />}
          onPress={() => router.push("/notifications")}
          rightElement={
            unreadNotifications > 0 ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadNotifications}</Text>
              </View>
            ) : null
          }
        />
        
        <SettingsItem
          title="Dark Mode"
          icon={<Moon size={20} color={colors.primary} />}
          rightElement={
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: colors.gray[300], true: colors.primary + "80" }}
              thumbColor={darkMode ? colors.primary : colors.gray[100]}
            />
          }
          showChevron={false}
        />
      </View>

      <View style={styles.settingsSection}>
        <Text style={[typography.h3, styles.sectionTitle]}>Support</Text>
        
        <SettingsItem
          title="Privacy Policy"
          icon={<Shield size={20} color={colors.primary} />}
          onPress={() => {
            // In a real app, this would navigate to the privacy policy
            alert("Privacy Policy would be shown here");
          }}
        />
        
        <SettingsItem
          title="Help & Support"
          icon={<HelpCircle size={20} color={colors.primary} />}
          onPress={() => {
            // In a real app, this would navigate to help & support
            alert("Help & Support would be shown here");
          }}
        />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <LogOut size={20} color={colors.error} />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      <Text style={styles.versionText}>Version 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 16,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  emailText: {
    color: colors.gray[600],
    marginTop: 4,
  },
  editProfileButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  editProfileText: {
    color: colors.primary,
    fontWeight: "500",
  },
  settingsSection: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  badge: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
    marginRight: 8,
  },
  badgeText: {
    color: colors.card,
    fontSize: 12,
    fontWeight: "600",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.error + "10", // 10% opacity
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  logoutText: {
    color: colors.error,
    fontWeight: "600",
    marginLeft: 8,
  },
  versionText: {
    textAlign: "center",
    color: colors.gray[500],
    marginBottom: 16,
  },
});