import React, { useRef, useEffect } from "react";
import { StyleSheet, ActivityIndicator, View } from "react-native";
import { NavigationContainer, NavigationContainerRef } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import MainTabNavigator from "@/navigation/MainTabNavigator";
import AuthStackNavigator from "@/navigation/AuthStackNavigator";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import { useTheme } from "@/hooks/useTheme";

function AppContent({ navRef }: { navRef: React.RefObject<NavigationContainerRef<any>> }) {
  const { isAuthenticated, isLoading } = useAuth();
  const { theme } = useTheme();
  const prevAuthState = useRef(isAuthenticated);

  useEffect(() => {
    if (prevAuthState.current !== isAuthenticated && navRef.current) {
      navRef.current.reset({
        index: 0,
        routes: [{ name: isAuthenticated ? "Main" : "Auth" }],
      });
      prevAuthState.current = isAuthenticated;
    }
  }, [isAuthenticated, navRef]);

  if (isLoading) {
    return (
      <View style={[styles.loading, { backgroundColor: theme.backgroundRoot }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return isAuthenticated ? (
    <DataProvider>
      <MainTabNavigator />
    </DataProvider>
  ) : (
    <AuthStackNavigator />
  );
}

export default function App() {
  const navRef = useRef<NavigationContainerRef<any>>(null);

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <GestureHandlerRootView style={styles.root}>
          <KeyboardProvider>
            <AuthProvider>
              <NavigationContainer ref={navRef}>
                <AppContent navRef={navRef} />
              </NavigationContainer>
            </AuthProvider>
            <StatusBar style="auto" />
          </KeyboardProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
