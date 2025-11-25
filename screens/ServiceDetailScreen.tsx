import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert, Pressable, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { StatusBadge } from "@/components/StatusBadge";
import { PriorityBadge } from "@/components/PriorityBadge";
import { Button } from "@/components/Button";
import { PhotoGallery } from "@/components/PhotoGallery";
import { useTheme } from "@/hooks/useTheme";
import { useData } from "@/contexts/DataContext";
import { ServicesStackParamList } from "@/navigation/ServicesStackNavigator";
import { DEVICE_TYPE_LABELS, ServiceStatus } from "@/types";
import { Spacing, BorderRadius } from "@/constants/theme";
import { sendServiceStatusEmail, checkEmailAvailability } from "@/utils/email";

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

  const [isEditingDiagnosis, setIsEditingDiagnosis] = useState(false);
  const [diagnosis, setDiagnosis] = useState(service?.diagnosis || "");
  const [isEditingSolution, setIsEditingSolution] = useState(false);
  const [solution, setSolution] = useState(service?.solution || "");
  const [isEditingCost, setIsEditingCost] = useState(false);
  const [cost, setCost] = useState(service?.cost?.toString() || "");
  const [canSendEmail, setCanSendEmail] = useState(false);

  useEffect(() => {
    checkEmailAvailability().then(setCanSendEmail).catch(() => setCanSendEmail(false));
  }, []);

  if (!service) {
    return (
      <ScreenScrollView hasTransparentHeader={false}>
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

  const handlePhotosChange = async (photos: string[]) => {
    await updateService({
      ...service,
      photos,
    });
  };

  const handleSaveDiagnosis = async () => {
    await updateService({
      ...service,
      diagnosis: diagnosis.trim(),
    });
    setIsEditingDiagnosis(false);
  };

  const handleSaveSolution = async () => {
    await updateService({
      ...service,
      solution: solution.trim(),
    });
    setIsEditingSolution(false);
  };

  const handleSaveCost = async () => {
    const costValue = parseFloat(cost);
    await updateService({
      ...service,
      cost: isNaN(costValue) ? undefined : costValue,
    });
    setIsEditingCost(false);
  };

  const handleSendEmail = async () => {
    if (!customer || !device) {
      Alert.alert("Greška", "Podaci o klijentu ili uređaju nisu dostupni");
      return;
    }

    if (!customer.email) {
      Alert.alert(
        "Email nije dostupan",
        "Klijent nema upisanu email adresu. Da li želite da ručno unesete adresu?",
        [
          { text: "Odustani", style: "cancel" },
          {
            text: "Nastavi",
            onPress: async () => {
              try {
                await sendServiceStatusEmail(customer, device, service);
              } catch (error) {
                Alert.alert("Greška", "Nije moguće otvoriti email aplikaciju");
              }
            },
          },
        ]
      );
      return;
    }

    try {
      await sendServiceStatusEmail(customer, device, service);
    } catch (error) {
      Alert.alert("Greška", "Nije moguće otvoriti email aplikaciju");
    }
  };

  const isEditable = service.status !== "completed" && service.status !== "cancelled";

  return (
    <ScreenScrollView hasTransparentHeader={false}>
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

      <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
        <PhotoGallery
          photos={service.photos || []}
          onPhotosChange={handlePhotosChange}
          editable={isEditable}
          maxPhotos={10}
        />
      </View>

      <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
        <View style={styles.cardHeader}>
          <Feather name="search" size={20} color={theme.primary} />
          <ThemedText type="h4">Dijagnoza</ThemedText>
          {isEditable && !isEditingDiagnosis ? (
            <Pressable
              style={styles.editButton}
              onPress={() => {
                setDiagnosis(service.diagnosis || "");
                setIsEditingDiagnosis(true);
              }}
            >
              <Feather name="edit-2" size={16} color={theme.primary} />
            </Pressable>
          ) : null}
        </View>
        {isEditingDiagnosis ? (
          <View>
            <TextInput
              style={[styles.textArea, { backgroundColor: theme.backgroundRoot, color: theme.text, borderColor: theme.border }]}
              value={diagnosis}
              onChangeText={setDiagnosis}
              placeholder="Unesite dijagnozu..."
              placeholderTextColor={theme.textSecondary}
              multiline
              numberOfLines={3}
            />
            <View style={styles.editActions}>
              <Pressable
                style={[styles.saveButton, { backgroundColor: theme.primary }]}
                onPress={handleSaveDiagnosis}
              >
                <ThemedText type="small" style={styles.saveButtonText}>Sačuvaj</ThemedText>
              </Pressable>
              <Pressable
                style={styles.cancelEditButton}
                onPress={() => setIsEditingDiagnosis(false)}
              >
                <ThemedText type="small" style={{ color: theme.textSecondary }}>Odustani</ThemedText>
              </Pressable>
            </View>
          </View>
        ) : (
          <ThemedText type="body" style={!service.diagnosis ? { color: theme.textSecondary, fontStyle: "italic" } : undefined}>
            {service.diagnosis || "Nije uneta dijagnoza"}
          </ThemedText>
        )}
      </View>

      <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
        <View style={styles.cardHeader}>
          <Feather name="check-circle" size={20} color={theme.success} />
          <ThemedText type="h4">Rešenje</ThemedText>
          {isEditable && !isEditingSolution ? (
            <Pressable
              style={styles.editButton}
              onPress={() => {
                setSolution(service.solution || "");
                setIsEditingSolution(true);
              }}
            >
              <Feather name="edit-2" size={16} color={theme.primary} />
            </Pressable>
          ) : null}
        </View>
        {isEditingSolution ? (
          <View>
            <TextInput
              style={[styles.textArea, { backgroundColor: theme.backgroundRoot, color: theme.text, borderColor: theme.border }]}
              value={solution}
              onChangeText={setSolution}
              placeholder="Unesite rešenje..."
              placeholderTextColor={theme.textSecondary}
              multiline
              numberOfLines={3}
            />
            <View style={styles.editActions}>
              <Pressable
                style={[styles.saveButton, { backgroundColor: theme.primary }]}
                onPress={handleSaveSolution}
              >
                <ThemedText type="small" style={styles.saveButtonText}>Sačuvaj</ThemedText>
              </Pressable>
              <Pressable
                style={styles.cancelEditButton}
                onPress={() => setIsEditingSolution(false)}
              >
                <ThemedText type="small" style={{ color: theme.textSecondary }}>Odustani</ThemedText>
              </Pressable>
            </View>
          </View>
        ) : (
          <ThemedText type="body" style={!service.solution ? { color: theme.textSecondary, fontStyle: "italic" } : undefined}>
            {service.solution || "Nije uneto rešenje"}
          </ThemedText>
        )}
      </View>

      <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
        <View style={styles.cardHeader}>
          <Feather name="dollar-sign" size={20} color={theme.primary} />
          <ThemedText type="h4">Cena</ThemedText>
          {isEditable && !isEditingCost ? (
            <Pressable
              style={styles.editButton}
              onPress={() => {
                setCost(service.cost?.toString() || "");
                setIsEditingCost(true);
              }}
            >
              <Feather name="edit-2" size={16} color={theme.primary} />
            </Pressable>
          ) : null}
        </View>
        {isEditingCost ? (
          <View>
            <View style={styles.costInputContainer}>
              <TextInput
                style={[styles.costInput, { backgroundColor: theme.backgroundRoot, color: theme.text, borderColor: theme.border }]}
                value={cost}
                onChangeText={setCost}
                placeholder="0"
                placeholderTextColor={theme.textSecondary}
                keyboardType="numeric"
              />
              <ThemedText type="body" style={styles.currencyLabel}>EUR</ThemedText>
            </View>
            <View style={styles.editActions}>
              <Pressable
                style={[styles.saveButton, { backgroundColor: theme.primary }]}
                onPress={handleSaveCost}
              >
                <ThemedText type="small" style={styles.saveButtonText}>Sačuvaj</ThemedText>
              </Pressable>
              <Pressable
                style={styles.cancelEditButton}
                onPress={() => setIsEditingCost(false)}
              >
                <ThemedText type="small" style={{ color: theme.textSecondary }}>Odustani</ThemedText>
              </Pressable>
            </View>
          </View>
        ) : (
          <ThemedText type="h3" style={!service.cost ? { color: theme.textSecondary, fontStyle: "italic", fontSize: 16 } : undefined}>
            {service.cost ? `${service.cost} EUR` : "Nije uneta cena"}
          </ThemedText>
        )}
      </View>

      {canSendEmail ? (
        <Pressable
          style={[styles.emailButton, { backgroundColor: theme.backgroundDefault, borderColor: theme.primary }]}
          onPress={handleSendEmail}
        >
          <Feather name="mail" size={18} color={theme.primary} />
          <ThemedText type="body" style={{ color: theme.primary, marginLeft: Spacing.sm }}>
            Pošalji email klijentu
          </ThemedText>
        </Pressable>
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
  editButton: {
    marginLeft: "auto",
    padding: Spacing.xs,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: "top",
  },
  editActions: {
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  saveButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  cancelEditButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  costInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  costInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    fontSize: 18,
  },
  currencyLabel: {
    fontWeight: "600",
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
  emailButton: {
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.full,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
});
