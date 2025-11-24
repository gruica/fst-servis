import React from "react";
import { View, StyleSheet, Alert, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { DEVICE_TYPE_LABELS } from "@/types";
import { Spacing, BorderRadius } from "@/constants/theme";

export default function ProfileScreen() {
  const { theme } = useTheme();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      "Odjava",
      "Da li ste sigurni da želite da se odjavite?",
      [
        { text: "Odustani", style: "cancel" },
        { text: "Odjavi se", style: "destructive", onPress: logout },
      ]
    );
  };

  if (!user) return null;

  return (
    <ScreenScrollView>
      <View style={[styles.profileCard, { backgroundColor: theme.backgroundDefault }]}>
        <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
          <ThemedText type="h1" style={{ color: "#fff" }}>
            {user.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
          </ThemedText>
        </View>
        <ThemedText type="h3">{user.name}</ThemedText>
        <ThemedText type="body" style={{ color: theme.textSecondary }}>
          {user.role === "admin" ? "Administrator" : "Serviser"}
        </ThemedText>
      </View>

      <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
        <ThemedText type="h4" style={styles.cardTitle}>Kontakt informacije</ThemedText>

        <View style={styles.infoRow}>
          <Feather name="mail" size={20} color={theme.textSecondary} />
          <ThemedText type="body">{user.email}</ThemedText>
        </View>

        {user.phone ? (
          <View style={styles.infoRow}>
            <Feather name="phone" size={20} color={theme.textSecondary} />
            <ThemedText type="body">{user.phone}</ThemedText>
          </View>
        ) : null}
      </View>

      {user.specialties && user.specialties.length > 0 ? (
        <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
          <ThemedText type="h4" style={styles.cardTitle}>Specijalnosti</ThemedText>
          <View style={styles.specialtiesContainer}>
            {user.specialties.map(spec => (
              <View key={spec} style={[styles.specialtyChip, { backgroundColor: theme.backgroundSecondary }]}>
                <ThemedText type="small">{DEVICE_TYPE_LABELS[spec]}</ThemedText>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
        <ThemedText type="h4" style={styles.cardTitle}>Podešavanja</ThemedText>

        <Pressable style={styles.menuItem}>
          <Feather name="bell" size={20} color={theme.text} />
          <ThemedText type="body" style={styles.menuLabel}>Notifikacije</ThemedText>
          <Feather name="chevron-right" size={20} color={theme.textSecondary} />
        </Pressable>

        <Pressable style={styles.menuItem}>
          <Feather name="moon" size={20} color={theme.text} />
          <ThemedText type="body" style={styles.menuLabel}>Tamna tema</ThemedText>
          <Feather name="chevron-right" size={20} color={theme.textSecondary} />
        </Pressable>

        <Pressable style={styles.menuItem}>
          <Feather name="help-circle" size={20} color={theme.text} />
          <ThemedText type="body" style={styles.menuLabel}>Pomoć</ThemedText>
          <Feather name="chevron-right" size={20} color={theme.textSecondary} />
        </Pressable>
      </View>

      <Button onPress={handleLogout} style={[styles.logoutButton, { backgroundColor: theme.error }]}>
        Odjavi se
      </Button>

      <ThemedText type="small" style={[styles.version, { color: theme.textSecondary }]}>
        FST Servis v1.0.0
      </ThemedText>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    padding: Spacing["2xl"],
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  card: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.lg,
  },
  cardTitle: {
    marginBottom: Spacing.lg,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  specialtiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  specialtyChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
  },
  menuLabel: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  logoutButton: {
    marginTop: Spacing.lg,
  },
  version: {
    textAlign: "center",
    marginTop: Spacing["2xl"],
    marginBottom: Spacing.xl,
  },
});
