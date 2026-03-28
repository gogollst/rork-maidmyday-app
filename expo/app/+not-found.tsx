import { Link, Stack, useRouter } from "expo-router";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { typography } from "@/constants/typography";

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: "Page Not Found",
          headerShown: true,
          headerBackTitle: "Back",
          headerLeft: () => (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.canGoBack() ? router.back() : router.replace("/")}
            >
              <ArrowLeft size={24} color={colors.primary} />
            </TouchableOpacity>
          ),
        }} 
      />
      <View style={styles.container}>
        <Text style={[typography.h2, styles.title]}>This screen doesn't exist.</Text>
        <Text style={[typography.body, styles.description]}>
          The page you're looking for could not be found.
        </Text>

        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    textAlign: "center",
    color: colors.gray[600],
    marginBottom: 32,
  },
  link: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  linkText: {
    fontSize: 16,
    color: colors.card,
    fontWeight: "600",
  },
  backButton: {
    padding: 4,
  },
});
