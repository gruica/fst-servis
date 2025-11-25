import React, { useState } from "react";
import { View, StyleSheet, TextInput, Image, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { Spacing, BorderRadius } from "@/constants/theme";

export default function LoginScreen() {
  const { theme } = useTheme();
  const { login } = useAuth();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Greška", "Unesite email i lozinku");
      return;
    }

    setIsLoading(true);
    const success = await login(email.trim(), password);
    setIsLoading(false);

    if (!success) {
      Alert.alert("Greška", "Pogrešan email ili lozinka");
    }
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top + Spacing["3xl"], paddingBottom: insets.bottom + Spacing.xl }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <Image
            source={require("../assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <ThemedText type="h1" style={styles.title}>FST Servis</ThemedText>
          <ThemedText type="body" style={[styles.subtitle, { color: theme.textSecondary }]}>
            Upravljanje servisima bele tehnike
          </ThemedText>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <ThemedText type="small" style={[styles.label, { color: theme.textSecondary }]}>
              Email
            </ThemedText>
            <TextInput
              style={[styles.input, { backgroundColor: theme.backgroundDefault, color: theme.text, borderColor: theme.border }]}
              value={email}
              onChangeText={setEmail}
              placeholder="admin@fst.me"
              placeholderTextColor={theme.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <ThemedText type="small" style={[styles.label, { color: theme.textSecondary }]}>
              Lozinka
            </ThemedText>
            <TextInput
              style={[styles.input, { backgroundColor: theme.backgroundDefault, color: theme.text, borderColor: theme.border }]}
              value={password}
              onChangeText={setPassword}
              placeholder="Unesite lozinku"
              placeholderTextColor={theme.textSecondary}
              secureTextEntry
            />
          </View>

          <Button onPress={handleLogin} disabled={isLoading} style={styles.button}>
            {isLoading ? <ActivityIndicator color="#fff" /> : "Prijavi se"}
          </Button>

          <View style={styles.demoInfo}>
            <ThemedText type="small" style={[styles.demoText, { color: theme.textSecondary }]}>
              Demo nalozi:
            </ThemedText>
            <ThemedText type="small" style={[styles.demoText, { color: theme.textSecondary }]}>
              admin@fst.me / admin123
            </ThemedText>
            <ThemedText type="small" style={[styles.demoText, { color: theme.textSecondary }]}>
              serviser@fst.me / serviser123
            </ThemedText>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: Spacing["4xl"],
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: Spacing.xl,
  },
  title: {
    marginBottom: Spacing.sm,
  },
  subtitle: {
    textAlign: "center",
  },
  form: {
    paddingHorizontal: Spacing["2xl"],
  },
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  label: {
    marginBottom: Spacing.xs,
    marginLeft: Spacing.xs,
  },
  input: {
    height: Spacing.inputHeight,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.lg,
    fontSize: 16,
    borderWidth: 1,
  },
  button: {
    marginTop: Spacing.xl,
  },
  demoInfo: {
    marginTop: Spacing["3xl"],
    alignItems: "center",
  },
  demoText: {
    marginTop: Spacing.xs,
  },
});
