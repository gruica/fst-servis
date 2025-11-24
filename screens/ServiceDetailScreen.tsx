import React from "react";
import { View, StyleSheet, Alert, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { StatusBadge } from "@/components/StatusBadge";
import { PriorityBadge } from "@/components/PriorityBadge";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { useData } from "@/contexts/DataContext";
import { ServicesStackParamList } from "@/navigation/ServicesStackNavigator";
import { DEVICE_TYPE_LABELS, ServiceStatus } from "@/types";
import { Spacing, BorderRadius } from "@/constants/theme";

type Props = {
  navigation: NativeStackNavigationProp<ServicesStackParamList, "ServiceDetail">;
  route: RouteProp<ServicesStackParamList, "ServiceDetail">;
};

export default function ServiceDetailScreen({ navigation, route }: Props) {
  const { theme } = useTheme();
  const { services, customers, devices, updateService } = useData();
  const { serviceId } = route.params;

  const service = services.find(s => s.id === serviceId);
  const customer = service ? customers.find(c => c.id === service.customerId) : null;
  const device = service ? devices.find(d => d.id === service.deviceId) : null;

  if (!service) {
    return (
      <ScreenScrollView>
        <ThemedText>Servis nije pronađen</ThemedText>
      </ScreenScrollView>
    );
  }

  const handleStatusChange = (newStatus: ServiceStatus) => {
    Alert.alert(
      "Promeni status",
      `Da li želite da promenite status na "${newStatus === "completed" ? "Završeno" : newStatus === "in_progress" ? "U toku" : "Otkazano"}"?`,
      [
        { text: "Odustani", style: "cancel" },
        {
          text: "Da",
          onPress: async () => {
            await updateService({
              ...service,
              status: newStatus,
              completedDate: newStatus === "completed" ? new Date().toISOString().split("T")[0] : service.completedDate,
            });
          },
        },
      ]
    );
  };

  return (
    <ScreenScrollView>
      <View style={styles.headerSection}>
        <View style={styles.headerRow}>
          <ThemedText type="h3">Servis #{service.id.slice(-4)}</ThemedText>
          <StatusBadge status={service.status} />
        </View>
        <View style={styles.priorityRow}>
          <PriorityBadge priority={service.priority} />
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            Kreiran: {service.createdAt}
          </ThemedText>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
        <View style={styles.cardHeader}>
          <Feather name="user" size={20} color={theme.primary} />
          <ThemedText type="h4">Klijent</ThemedText>
        </View>
        {customer ? (
          <>
            <ThemedText type="body">{customer.name}</ThemedText>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>{customer.phone}</ThemedText>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>{customer.address}</ThemedText>
          </>
        ) : (
          <ThemedText type="body" style={{ color: theme.textSecondary }}>Nepoznat klijent</ThemedText>
        )}
      </View>

      <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
        <View style={styles.cardHeader}>
          <Feather name="box" size={20} color={theme.primary} />
          <ThemedText type="h4">Uređaj</ThemedText>
        </View>
        {device ? (
          <>
            <ThemedText type="body">{device.brand} {device.model}</ThemedText>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              {DEVICE_TYPE_LABELS[device.type]}
            </ThemedText>
            {device.serialNumber ? (
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                S/N: {device.serialNumber}
              </ThemedText>
            ) : null}
          </>
        ) : (
          <ThemedText type="body" style={{ color: theme.textSecondary }}>Nepoznat uređaj</ThemedText>
        )}
      </View>

      <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
        <View style={styles.cardHeader}>
          <Feather name="file-text" size={20} color={theme.primary} />
          <ThemedText type="h4">Opis problema</ThemedText>
        </View>
        <ThemedText type="body">{service.description}</ThemedText>
      </View>

      {service.diagnosis ? (
        <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
          <View style={styles.cardHeader}>
            <Feather name="search" size={20} color={theme.primary} />
            <ThemedText type="h4">Dijagnoza</ThemedText>
          </View>
          <ThemedText type="body">{service.diagnosis}</ThemedText>
        </View>
      ) : null}

      {service.solution ? (
        <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
          <View style={styles.cardHeader}>
            <Feather name="check-circle" size={20} color={theme.success} />
            <ThemedText type="h4">Rešenje</ThemedText>
          </View>
          <ThemedText type="body">{service.solution}</ThemedText>
        </View>
      ) : null}

      {service.cost ? (
        <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
          <View style={styles.cardHeader}>
            <Feather name="dollar-sign" size={20} color={theme.primary} />
            <ThemedText type="h4">Cena</ThemedText>
          </View>
          <ThemedText type="h3">{service.cost} EUR</ThemedText>
        </View>
      ) : null}

      {service.status !== "completed" && service.status !== "cancelled" ? (
        <View style={styles.actions}>
          {service.status === "pending" ? (
            <Button onPress={() => handleStatusChange("in_progress")} style={styles.actionButton}>
              Započni servis
            </Button>
          ) : null}
          {service.status === "in_progress" ? (
            <Button onPress={() => handleStatusChange("completed")} style={styles.actionButton}>
              Završi servis
            </Button>
          ) : null}
          <Pressable
            style={[styles.cancelButton, { borderColor: theme.error }]}
            onPress={() => handleStatusChange("cancelled")}
          >
            <ThemedText type="body" style={{ color: theme.error }}>Otkaži</ThemedText>
          </Pressable>
        </View>
      ) : null}
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  headerSection: {
    marginBottom: Spacing.xl,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  priorityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  card: {
    padding: Spacing.cardPadding,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.lg,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  actions: {
    marginTop: Spacing.xl,
    gap: Spacing.md,
  },
  actionButton: {
    marginBottom: 0,
  },
  cancelButton: {
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
});
