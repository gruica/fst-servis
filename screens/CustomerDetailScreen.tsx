import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { ScreenScrollView } from "../components/ScreenScrollView";
import { ThemedText } from "../components/ThemedText";
import { DeviceCard } from "../components/DeviceCard";
import { ServiceCard } from "../components/ServiceCard";
import { Button } from "../components/Button";
import { useTheme } from "../hooks/useTheme";
import { useData } from "../contexts/DataContext";
import { CustomersStackParamList } from "../navigation/CustomersStackNavigator";
import { Spacing, BorderRadius } from "../constants/theme";

type Props = {
  navigation: NativeStackNavigationProp<CustomersStackParamList, "CustomerDetail">;
  route: RouteProp<CustomersStackParamList, "CustomerDetail">;
};

export default function CustomerDetailScreen({ navigation, route }: Props) {
  const { theme } = useTheme();
  const { customers, devices, services } = useData();
  const { customerId } = route.params;

  const customer = customers.find(c => c.id === customerId);
  const customerDevices = devices.filter(d => d.customerId === customerId);
  const customerServices = services.filter(s => s.customerId === customerId);

  if (!customer) {
    return (
      <ScreenScrollView hasTransparentHeader={false}>
        <ThemedText>Klijent nije pronađen</ThemedText>
      </ScreenScrollView>
    );
  }

  return (
    <ScreenScrollView hasTransparentHeader={false}>
      <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
        <View style={styles.cardHeader}>
          <Feather name="user" size={24} color={theme.primary} />
          <ThemedText type="h3">{customer.name}</ThemedText>
        </View>

        <View style={styles.infoRow}>
          <Feather name="phone" size={18} color={theme.textSecondary} />
          <ThemedText type="body">{customer.phone}</ThemedText>
        </View>

        {customer.email ? (
          <View style={styles.infoRow}>
            <Feather name="mail" size={18} color={theme.textSecondary} />
            <ThemedText type="body">{customer.email}</ThemedText>
          </View>
        ) : null}

        <View style={styles.infoRow}>
          <Feather name="map-pin" size={18} color={theme.textSecondary} />
          <ThemedText type="body" style={styles.addressText}>{customer.address}</ThemedText>
        </View>

        <View style={styles.infoRow}>
          <Feather name="calendar" size={18} color={theme.textSecondary} />
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            Dodat: {customer.createdAt}
          </ThemedText>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText type="h4">Uređaji ({customerDevices.length})</ThemedText>
          <Pressable
            style={[styles.addSmallButton, { backgroundColor: theme.primary }]}
            onPress={() => navigation.navigate("NewDevice", { customerId })}
          >
            <Feather name="plus" size={18} color="#fff" />
          </Pressable>
        </View>

        {customerDevices.length > 0 ? (
          customerDevices.map(device => (
            <DeviceCard
              key={device.id}
              device={device}
              onPress={() => navigation.navigate("DeviceDetail", { deviceId: device.id })}
            />
          ))
        ) : (
          <ThemedText type="body" style={{ color: theme.textSecondary }}>
            Nema registrovanih uređaja
          </ThemedText>
        )}
      </View>

      <View style={styles.section}>
        <ThemedText type="h4" style={styles.sectionTitle}>
          Istorija servisa ({customerServices.length})
        </ThemedText>

        {customerServices.length > 0 ? (
          customerServices.slice(0, 5).map(service => {
            const device = devices.find(d => d.id === service.deviceId);
            return (
              <ServiceCard
                key={service.id}
                service={service}
                customerName={customer.name}
                deviceInfo={device ? `${device.brand} ${device.model}` : "Nepoznat uređaj"}
                onPress={() => {}}
                compact
              />
            );
          })
        ) : (
          <ThemedText type="body" style={{ color: theme.textSecondary }}>
            Nema servisa za ovog klijenta
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
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  addressText: {
    flex: 1,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  addSmallButton: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
});
