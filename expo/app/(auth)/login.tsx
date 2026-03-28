import React, { useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Link, useRouter } from "expo-router";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { colors } from "@/constants/colors";
import { typography } from "@/constants/typography";
import { useAuthStore } from "@/store/authStore";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();

  const validateForm = () => {
    let isValid = true;
    
    // Reset errors
    setEmailError("");
    setPasswordError("");
    clearError();
    
    // Validate email
    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    }
    
    // Validate password
    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    }
    
    return isValid;
  };

  const handleLogin = async () => {
    if (validateForm()) {
      await login(email, password);
    }
  };

  // For demo purposes, provide a quick login option
  const handleDemoLogin = async () => {
    setEmail("john@example.com");
    setPassword("password");
    await login("john@example.com", "password");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {router.canGoBack() && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        )}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>MaidMyDay</Text>
        </View>
        
        <View style={styles.formContainer}>
          <Text style={typography.h2}>Welcome Back</Text>
          <Text style={[typography.body, styles.subtitle]}>
            Sign in to continue managing your household staff
          </Text>
          
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={emailError}
            containerStyle={styles.inputContainer}
          />
          
          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            isPassword
            error={passwordError}
            containerStyle={styles.inputContainer}
          />
          
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
          
          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={isLoading}
            style={styles.button}
          />
          
          <Button
            title="Demo Login"
            onPress={handleDemoLogin}
            variant="outline"
            style={styles.demoButton}
          />
          
          <View style={styles.registerContainer}>
            <Text style={typography.body}>Don't have an account? </Text>
            <Link href="/register" asChild>
              <TouchableOpacity>
                <Text style={styles.registerText}>Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  backButton: {
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "500",
  },
  logoText: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.primary,
  },
  formContainer: {
    flex: 1,
  },
  subtitle: {
    color: colors.gray[600],
    marginTop: 8,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "500",
  },
  button: {
    marginBottom: 16,
  },
  demoButton: {
    marginBottom: 24,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  registerText: {
    color: colors.primary,
    fontWeight: "600",
  },
  errorContainer: {
    backgroundColor: colors.error + "20", // 20% opacity
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
  },
});