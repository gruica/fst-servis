import React from "react";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { RouteProp } from "@react-navigation/native";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useData } from "@/contexts/DataContext";
import { CustomersStackParamList } from "@/navigation/CustomersStackNavigator";
import { DEVICE_TYPE_LABELS } from "@/types";
import { Spacing, BorderRadius } from "@/constants/theme";

type Props = {
  route: RouteProp<CustomersStackParamList, "DeviceDetail">;
};

export default function DeviceDetailScreen({ route }: Props) {
  const { theme } = useTheme();
  const { devices, customers, services } = useData();
  const { deviceId } = route.params;

  const device = devices.find(d => d.id === deviceId);
  const customer = device ? customers.find(c => c.id === device.customerId) : null;
  const deviceServices = services.filter(s => s.deviceId === deviceId);

  if (!device) {
    return (
      <ScreenScrollView>
        <ThemedText>Uređaj nije pronađen</ThemedText>
      </ScreenScrollView>
    );
  }

  return (
    <ScreenScrollView>
      <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
        <View style={styles.cardHeader}>
          <Feather name="box" size={24} color={theme.primary} />
          <View>
            <ThemedText type="h3">{device.brand} {device.model}</ThemedText>
            <ThemedText type="body" style={{ color: theme.textSecondary }}>
              {DEVICE_TYPE_LABELS[device.type]}
            </ThemedText>
          </View>
        </View>

        {device.serialNumber ? (
          <View style={styles.infoRow}>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>Serijski broj:</ThemedText>
            <ThemedText type="body">{device.serialNumber}</ThemedText>
          </View>
        ) : null}

        {device.purchaseDate ? (
          <View style={styles.infoRow}>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>Datum kupovine:</ThemedText>
            <ThemedText type="body">{device.purchaseDate}</ThemedText>
          </View>
        ) : null}

        {device.warrantyEnd ? (
          <View style={styles.infoRow}>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>Garancija do:</ThemedText>
            <ThemedText type="body">{device.warrantyEnd}</ThemedText>
          </View>
        ) : null}

        {customer ? (
          <View style={[styles.ownerSection, { borderTopColor: theme.border }]}>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>Vlasnik:</ThemedText>
            <ThemedText type="body">{customer.name}</ThemedText>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>{customer.phone}</ThemedText>
          </View>
        ) : null}
      </View>

      <View style={styles.section}>
        <ThemedText type="h4" style={styles.sectionTitle}>
          Istorija servisa ({deviceServices.length})
        </ThemedText>

        {deviceServices.length > 0 ? (
          deviceServices.map(service => (
            <View key={service.id} style={[styles.serviceItem, { backgroundColor: theme.backgroundDefault }]}>
              <View style={styles.serviceHeader}>
                <ThemedText type="body" style={{ fontWeight: "600" }}>
                  #{service.id.slice(-4)}
                </ThemedText>
                <ThemedText type="small" style={{ color: theme.textSecondary }}>
                  {service.createdAt}
                </ThemedText>
              </View>
              <ThemedText type="body" numberOfLines={2}>{service.description}</ThemedText>
              <ThemedText
                type="small"
                style={{
                  color: service.status === "completed" ? theme.success :
                    service.status === "in_progress" ? theme.primary :
                    service.status === "cancelled" ? theme.error : theme.warning,
                  marginTop: Spacing.xs,
                }}
              >
                {service.status === "completed" ? "Završeno" :
                  service.status === "in_progress" ? "U toku" :
                  service.status === "cancelled" ? "Otkazano" : "Na čekanju"}
              </ThemedText>
            </View>
          ))
        ) : (
          <ThemedText type="body" style={{ color: theme.textSecondary }}>
            Nema servisa za ovaj uređaj
          </ThemedText>
        )}
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.cardPadding,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.xl,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  infoRow: {
    marginBottom: Spacing.sm,
  },
  ownerSection: {
    marginTop: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  serviceItem: {
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.sm,
  },
  serviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.xs,
  },
});
