import React, { useState, useLayoutEffect } from "react";
import { View, StyleSheet, TextInput, Alert, Pressable, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "../components/ThemedText";
import { ThemedView } from "../components/ThemedView";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import { ServicesStackParamList } from "../navigation/ServicesStackNavigator";
import { Priority, PRIORITY_LABELS, DEVICE_TYPE_LABELS } from "../types";
import { Spacing, BorderRadius } from "../constants/theme";

type Props = {
  navigation: NativeStackNavigationProp<ServicesStackParamList, "NewService">;
  route: RouteProp<ServicesStackParamList, "NewService">;
};

const PRIORITIES: Priority[] = ["low", "medium", "high", "urgent"];

export default function NewServiceScreen({ navigation, route }: Props) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { customers, devices, addService } = useData();

  const initialCustomerId = route.params?.customerId;
  const initialDeviceId = route.params?.deviceId;

  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(initialCustomerId || null);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(initialDeviceId || null);
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const customerDevices = selectedCustomerId
    ? devices.filter(d => d.customerId === selectedCustomerId)
    : [];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable onPress={() => navigation.goBack()}>
          <ThemedText type="body" style={{ color: theme.primary }}>Odustani</ThemedText>
        </Pressable>
      ),
      headerRight: () => (
        <Pressable onPress={handleSubmit} disabled={isSubmitting}>
          <ThemedText type="body" style={{ color: theme.primary, fontWeight: "600" }}>Sačuvaj</ThemedText>
        </Pressable>
      ),
    });
  }, [navigation, theme, isSubmitting, selectedCustomerId, selectedDeviceId, description, priority]);

  const handleSubmit = async () => {
    if (!selectedCustomerId) {
      Alert.alert("Greška", "Izaberite klijenta");
      return;
    }
    if (!selectedDeviceId) {
      Alert.alert("Greška", "Izaberite uređaj");
      return;
    }
    if (!description.trim()) {
      Alert.alert("Greška", "Unesite opis problema");
      return;
    }

    setIsSubmitting(true);
    try {
      await addService({
        customerId: selectedCustomerId,
        deviceId: selectedDeviceId,
        status: "pending",
        priority,
        description: description.trim(),
        createdByUserId: user?.id,
      });
      navigation.goBack();
    } catch {
      Alert.alert("Greška", "Nije moguće kreirati servis");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.section}>
          <ThemedText type="h4" style={styles.sectionTitle}>Klijent</ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
            {customers.map(customer => (
              <Pressable
                key={customer.id}
                style={[
                  styles.selectCard,
                  { backgroundColor: theme.backgroundDefault, borderColor: theme.border },
                  selectedCustomerId === customer.id && { borderColor: theme.primary, borderWidth: 2 },
                ]}
                onPress={() => {
                  setSelectedCustomerId(customer.id);
                  setSelectedDeviceId(null);
                }}
              >
                <Feather
                  name="user"
                  size={20}
                  color={selectedCustomerId === customer.id ? theme.primary : theme.textSecondary}
                />
                <ThemedText type="body" numberOfLines={1}>{customer.name}</ThemedText>
                <ThemedText type="small" style={{ color: theme.textSecondary }} numberOfLines={1}>
                  {customer.phone}
                </ThemedText>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {selectedCustomerId ? (
          <View style={styles.section}>
            <ThemedText type="h4" style={styles.sectionTitle}>Uređaj</ThemedText>
            {customerDevices.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
                {customerDevices.map(device => (
                  <Pressable
                    key={device.id}
                    style={[
                      styles.selectCard,
                      { backgroundColor: theme.backgroundDefault, borderColor: theme.border },
                      selectedDeviceId === device.id && { borderColor: theme.primary, borderWidth: 2 },
                    ]}
                    onPress={() => setSelectedDeviceId(device.id)}
                  >
                    <Feather
                      name="box"
                      size={20}
                      color={selectedDeviceId === device.id ? theme.primary : theme.textSecondary}
                    />
                    <ThemedText type="body" numberOfLines={1}>{device.brand} {device.model}</ThemedText>
                    <ThemedText type="small" style={{ color: theme.textSecondary }} numberOfLines={1}>
                      {DEVICE_TYPE_LABELS[device.type]}
                    </ThemedText>
                  </Pressable>
                ))}
              </ScrollView>
            ) : (
              <ThemedText type="body" style={{ color: theme.textSecondary }}>
                Ovaj klijent nema registrovanih uređaja
              </ThemedText>
            )}
          </View>
        ) : null}

        <View style={styles.section}>
          <ThemedText type="h4" style={styles.sectionTitle}>Prioritet</ThemedText>
          <View style={styles.priorityContainer}>
            {PRIORITIES.map(p => (
              <Pressable
                key={p}
                style={[
                  styles.priorityChip,
                  { backgroundColor: theme.backgroundDefault, borderColor: theme.border },
                  priority === p && { borderColor: theme.primary, borderWidth: 2 },
                ]}
                onPress={() => setPriority(p)}
              >
                <ThemedText
                  type="small"
                  style={{ color: priority === p ? theme.primary : theme.text, fontWeight: priority === p ? "600" : "400" }}
                >
                  {PRIORITY_LABELS[p]}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="h4" style={styles.sectionTitle}>Opis problema</ThemedText>
          <TextInput
            style={[
              styles.textArea,
              { backgroundColor: theme.backgroundDefault, color: theme.text, borderColor: theme.border },
            ]}
            value={description}
            onChangeText={setDescription}
            placeholder="Opišite problem sa uređajem..."
            placeholderTextColor={theme.textSecondary}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.xl,
  },
  section: {
    marginBottom: Spacing["2xl"],
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  horizontalList: {
    marginHorizontal: -Spacing.xl,
    paddingHorizontal: Spacing.xl,
  },
  selectCard: {
    width: 140,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.sm,
    borderWidth: 1,
    gap: Spacing.xs,
  },
  priorityContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  priorityChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  textArea: {
    minHeight: 120,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    fontSize: 16,
    borderWidth: 1,
  },
});
