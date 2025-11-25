import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

interface CameraScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

export function CameraScanner({ onClose }: CameraScannerProps) {
  const { theme } = useTheme();

  return (
    <ThemedView style={[styles.container, styles.permissionContainer]}>
      <View style={styles.permissionContent}>
        <Feather name="camera-off" size={64} color={theme.textSecondary} />
        <ThemedText type="h3" style={styles.permissionTitle}>
          Skeniranje nije dostupno
        </ThemedText>
        <ThemedText type="body" style={[styles.permissionText, { color: theme.textSecondary }]}>
          QR skeniranje je dostupno samo na mobilnim uređajima. Koristite Expo Go aplikaciju za ovu funkcionalnost.
        </ThemedText>
        <Pressable onPress={onClose} style={[styles.permissionButton, { backgroundColor: theme.primary }]}>
          <ThemedText type="body" style={styles.permissionButtonText}>
            Nazad
          </ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  permissionContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing["2xl"],
  },
  permissionContent: {
    alignItems: "center",
    maxWidth: 300,
  },
  permissionTitle: {
    marginTop: Spacing.xl,
    textAlign: "center",
  },
  permissionText: {
    marginTop: Spacing.md,
    textAlign: "center",
    lineHeight: 22,
  },
  permissionButton: {
    marginTop: Spacing["2xl"],
    paddingHorizontal: Spacing["2xl"],
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  permissionButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
