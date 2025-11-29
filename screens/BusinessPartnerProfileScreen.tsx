import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from "../components/ThemedText";
import { ThemedView } from "../components/ThemedView";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../contexts/AuthContext";
import { BUSINESS_PARTNER_CAPABILITIES, BUSINESS_PARTNER_RESTRICTIONS } from "../utils/permissions";
import { Spacing } from "../constants/theme";

export default function BusinessPartnerProfileScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  if (user?.role !== 'business_partner') {
    return (
      <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
        <ThemedText>Samo poslovni partneri mogu pristupiti ovoj strani.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + Spacing.xl }]}
      contentContainerStyle={styles.content}
    >
      <ThemedView style={[styles.headerCard, { backgroundColor: theme.primary }]}>
        <ThemedText type="h2" style={styles.headerTitle}>{user.companyName || user.name}</ThemedText>
        <ThemedText style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
          Poslovni Partner
        </ThemedText>
      </ThemedView>

      <View style={styles.section}>
        <ThemedText type="h3" style={styles.sectionTitle}>Vaše Mogućnosti</ThemedText>
        {Object.entries(BUSINESS_PARTNER_CAPABILITIES).map(([key, capability]) => (
          <ThemedView key={key} style={[styles.capabilityCard, { backgroundColor: theme.backgroundDefault }]}>
            <ThemedText type="h4" style={styles.capabilityTitle}>{capability.title}</ThemedText>
            {capability.features.map((feature, idx) => (
              <View key={idx} style={styles.featureRow}>
                <ThemedText style={[styles.featureBullet, { color: theme.primary }]}>• </ThemedText>
                <ThemedText style={styles.featureText}>{feature}</ThemedText>
              </View>
            ))}
          </ThemedView>
        ))}
      </View>

      <View style={styles.section}>
        <ThemedText type="h3" style={[styles.sectionTitle, { color: '#F87171' }]}>Ograničenja</ThemedText>
        <ThemedView style={[styles.restrictionCard, { backgroundColor: theme.backgroundDefault, borderColor: '#FECACA', borderWidth: 1 }]}>
          {BUSINESS_PARTNER_RESTRICTIONS.map((restriction, idx) => (
            <View key={idx} style={styles.featureRow}>
              <ThemedText style={[styles.featureBullet, { color: '#F87171' }]}>✕ </ThemedText>
              <ThemedText style={styles.featureText}>{restriction}</ThemedText>
            </View>
          ))}
        </ThemedView>
      </View>

      <View style={styles.section}>
        <ThemedText type="h3" style={styles.sectionTitle}>Informacije o Nalogu</ThemedText>
        <ThemedView style={[styles.infoCard, { backgroundColor: theme.backgroundDefault }]}>
          <View style={styles.infoRow}>
            <ThemedText style={[styles.infoLabel, { color: theme.textSecondary }]}>Ime:</ThemedText>
            <ThemedText style={styles.infoValue}>{user.name}</ThemedText>
          </View>
          <View style={[styles.infoRow, styles.infoDivider]}>
            <ThemedText style={[styles.infoLabel, { color: theme.textSecondary }]}>Email:</ThemedText>
            <ThemedText style={styles.infoValue}>{user.email}</ThemedText>
          </View>
          {user.phone && (
            <View style={[styles.infoRow, styles.infoDivider]}>
              <ThemedText style={[styles.infoLabel, { color: theme.textSecondary }]}>Telefon:</ThemedText>
              <ThemedText style={styles.infoValue}>{user.phone}</ThemedText>
            </View>
          )}
          {user.companyName && (
            <View style={styles.infoRow}>
              <ThemedText style={[styles.infoLabel, { color: theme.textSecondary }]}>Kompanija:</ThemedText>
              <ThemedText style={styles.infoValue}>{user.companyName}</ThemedText>
            </View>
          )}
        </ThemedView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
  },
  headerCard: {
    marginBottom: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: 12,
  },
  headerTitle: {
    color: '#fff',
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  capabilityCard: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
    borderRadius: 12,
  },
  capabilityTitle: {
    marginBottom: Spacing.sm,
    fontSize: 15,
  },
  featureRow: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
    alignItems: 'flex-start',
  },
  featureBullet: {
    marginRight: Spacing.sm,
    fontSize: 16,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
  },
  restrictionCard: {
    padding: Spacing.md,
    borderRadius: 12,
  },
  infoCard: {
    padding: Spacing.md,
    borderRadius: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  infoDivider: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    paddingTop: Spacing.md,
    marginTop: Spacing.md,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
});
