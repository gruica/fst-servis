import React, { useState } from "react";
import { View, StyleSheet, TextInput, Image, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { Spacing, BorderRadius } from "@/constants/theme";
import { loginWithGoogle, loginWithFacebook, loginWithGithub, loginWithX, loginWithInstagram } from "@/utils/oauth";

export default function LoginScreen() {
  const { theme } = useTheme();
  const { login, loginWithOAuth } = useAuth();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'github' | 'x' | 'instagram') => {
    setIsLoading(true);
    try {
      let user = null;
      if (provider === 'google') user = await loginWithGoogle();
      else if (provider === 'facebook') user = await loginWithFacebook();
      else if (provider === 'github') user = await loginWithGithub();
      else if (provider === 'x') user = await loginWithX();
      else if (provider === 'instagram') user = await loginWithInstagram();

      if (user) {
        await loginWithOAuth(user);
      } else {
        Alert.alert("Greška", `Prijava preko ${provider} nije uspela`);
      }
    } catch (error) {
      Alert.alert("Greška", `Nije moguće prijaviti se preko ${provider}`);
    } finally {
      setIsLoading(false);
    }
  };

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

          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
            <ThemedText type="small" style={{ color: theme.textSecondary }}>Ili</ThemedText>
            <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
          </View>

          <View style={styles.socialLogins}>
            <Pressable
              style={[styles.socialButton, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}
              onPress={() => handleSocialLogin('google')}
              disabled={isLoading}
              title="Google"
            >
              <Feather name="mail" size={20} color="#DB4437" />
            </Pressable>
            <Pressable
              style={[styles.socialButton, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}
              onPress={() => handleSocialLogin('facebook')}
              disabled={isLoading}
              title="Facebook"
            >
              <Feather name="facebook" size={20} color="#1877F2" />
            </Pressable>
            <Pressable
              style={[styles.socialButton, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}
              onPress={() => handleSocialLogin('github')}
              disabled={isLoading}
              title="GitHub"
            >
              <Feather name="github" size={20} color={theme.text} />
            </Pressable>
            <Pressable
              style={[styles.socialButton, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}
              onPress={() => handleSocialLogin('x')}
              disabled={isLoading}
              title="X"
            >
              <Feather name="twitter" size={20} color="#000" />
            </Pressable>
            <Pressable
              style={[styles.socialButton, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}
              onPress={() => handleSocialLogin('instagram')}
              disabled={isLoading}
              title="Instagram"
            >
              <Feather name="camera" size={20} color="#E1306C" />
            </Pressable>
          </View>

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
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.xl,
    gap: Spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  socialLogins: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoInfo: {
    marginTop: Spacing["2xl"],
    alignItems: "center",
  },
  demoText: {
    marginTop: Spacing.xs,
  },
});
