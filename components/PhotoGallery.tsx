import React, { useState, useEffect } from "react";
import { View, StyleSheet, Pressable, Modal, Image, Dimensions, Alert, Platform, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { ThemedText } from "./ThemedText";
import { useTheme } from "../hooks/useTheme";
import { Spacing, BorderRadius } from "../constants/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IMAGE_SIZE = (SCREEN_WIDTH - Spacing.xl * 2 - Spacing.md * 2) / 3;

interface PhotoGalleryProps {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  editable?: boolean;
  maxPhotos?: number;
}

export function PhotoGallery({ photos, onPhotosChange, editable = true, maxPhotos = 10 }: PhotoGalleryProps) {
  const { theme } = useTheme();
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const requestPermissions = async () => {
    if (Platform.OS !== "web") {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      return cameraStatus === "granted" && libraryStatus === "granted";
    }
    return true;
  };

  const handleAddPhoto = async () => {
    if (photos.length >= maxPhotos) {
      Alert.alert("Ograničenje", `Maksimalan broj fotografija je ${maxPhotos}`);
      return;
    }

    if (Platform.OS === "web") {
      pickFromGallery();
      return;
    }

    Alert.alert(
      "Dodaj fotografiju",
      "Izaberite opciju",
      [
        {
          text: "Kamera",
          onPress: () => takePhoto(),
        },
        {
          text: "Galerija",
          onPress: () => pickFromGallery(),
        },
        {
          text: "Odustani",
          style: "cancel",
        },
      ]
    );
  };

  const takePhoto = async () => {
    if (Platform.OS === "web") {
      Alert.alert("Nedostupno", "Kamera nije podržana u web pregledaču. Koristite mobilnu aplikaciju.");
      return;
    }

    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      Alert.alert("Pristup odbijen", "Potrebna je dozvola za korišćenje kamere");
      return;
    }

    setIsLoading(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const newPhoto = result.assets[0].uri;
        onPhotosChange([...photos, newPhoto]);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Greška", "Nije moguće snimiti fotografiju");
    } finally {
      setIsLoading(false);
    }
  };

  const pickFromGallery = async () => {
    if (Platform.OS !== "web") {
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        Alert.alert("Pristup odbijen", "Potrebna je dozvola za pristup galeriji");
        return;
      }
    }

    setIsLoading(true);
    try {
      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: "images",
        quality: 0.7,
      };

      if (Platform.OS !== "web") {
        options.allowsMultipleSelection = true;
        options.selectionLimit = maxPhotos - photos.length;
      }

      const result = await ImagePicker.launchImageLibraryAsync(options);

      if (!result.canceled && result.assets.length > 0) {
        const remainingSlots = maxPhotos - photos.length;
        const newPhotos = result.assets.slice(0, remainingSlots).map(asset => asset.uri);
        if (newPhotos.length > 0) {
          onPhotosChange([...photos, ...newPhotos]);
        }
      }
    } catch (error) {
      console.error("Error picking photos:", error);
      if (Platform.OS === "web") {
        Alert.alert("Napomena", "Za dodavanje fotografija na web verziji, koristite mobilnu aplikaciju za bolje iskustvo");
      } else {
        Alert.alert("Greška", "Nije moguće izabrati fotografije");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePhoto = (index: number) => {
    Alert.alert(
      "Obriši fotografiju",
      "Da li ste sigurni da želite da obrišete ovu fotografiju?",
      [
        { text: "Odustani", style: "cancel" },
        {
          text: "Obriši",
          style: "destructive",
          onPress: () => {
            const newPhotos = [...photos];
            newPhotos.splice(index, 1);
            onPhotosChange(newPhotos);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <Feather name="image" size={20} color={theme.primary} />
          <ThemedText type="h4">Fotografije ({photos.length})</ThemedText>
        </View>
        {editable ? (
          <Pressable
            style={[styles.addButton, { backgroundColor: theme.primary }]}
            onPress={handleAddPhoto}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Feather name="plus" size={18} color="#fff" />
            )}
          </Pressable>
        ) : null}
      </View>

      {photos.length === 0 ? (
        <View style={[styles.emptyState, { borderColor: theme.border }]}>
          <Feather name={Platform.OS === "web" ? "upload" : "camera"} size={32} color={theme.textSecondary} />
          <ThemedText type="body" style={{ color: theme.textSecondary, marginTop: Spacing.sm, textAlign: "center" }}>
            {editable 
              ? Platform.OS === "web" 
                ? "Dodajte fotografije iz galerije" 
                : "Dodajte fotografije servisa" 
              : "Nema fotografija"}
          </ThemedText>
        </View>
      ) : (
        <View style={styles.grid}>
          {photos.map((photo, index) => (
            <Pressable
              key={`photo-${index}`}
              style={styles.imageContainer}
              onPress={() => setSelectedPhoto(photo)}
              onLongPress={editable ? () => handleDeletePhoto(index) : undefined}
            >
              <Image source={{ uri: photo }} style={styles.thumbnail} />
              {editable ? (
                <Pressable
                  style={[styles.deleteButton, { backgroundColor: theme.error }]}
                  onPress={() => handleDeletePhoto(index)}
                >
                  <Feather name="x" size={12} color="#fff" />
                </Pressable>
              ) : null}
            </Pressable>
          ))}
        </View>
      )}

      <Modal
        visible={!!selectedPhoto}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedPhoto(null)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setSelectedPhoto(null)}
        >
          <View style={styles.modalContent}>
            <Pressable
              style={[styles.closeModalButton, { backgroundColor: "rgba(0,0,0,0.5)" }]}
              onPress={() => setSelectedPhoto(null)}
            >
              <Feather name="x" size={24} color="#fff" />
            </Pressable>
            {selectedPhoto ? (
              <Image
                source={{ uri: selectedPhoto }}
                style={styles.fullImage}
                resizeMode="contain"
              />
            ) : null}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
  },
  headerTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyState: {
    padding: Spacing.xl,
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
  },
  imageContainer: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: BorderRadius.sm,
    overflow: "hidden",
    position: "relative",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  deleteButton: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  closeModalButton: {
    position: "absolute",
    top: 50,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  fullImage: {
    width: SCREEN_WIDTH - 40,
    height: SCREEN_WIDTH - 40,
  },
});
