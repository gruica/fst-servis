import React, { useState, useEffect } from "react";
import { View, StyleSheet, Pressable, Dimensions, ActivityIndicator } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { useTheme } from "../hooks/useTheme";
import { Spacing, BorderRadius } from "../constants/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SCAN_AREA_SIZE = SCREEN_WIDTH * 0.7;

interface CameraScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

export function CameraScanner({ onScan, onClose }: CameraScannerProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [flashOn, setFlashOn] = useState(false);

  const handleBarCodeScanned = (result: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    onScan(result.data);
  };

  const toggleFlash = () => {
    setFlashOn(prev => !prev);
  };

  const handleScanAgain = () => {
    setScanned(false);
  };

  if (!permission) {
    return (
      <ThemedView style={[styles.container, styles.permissionContainer]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <ThemedText type="body" style={{ marginTop: Spacing.lg }}>
          Učitavanje kamere...
        </ThemedText>
      </ThemedView>
    );
  }

  if (!permission.granted) {
    return (
      <ThemedView style={[styles.container, styles.permissionContainer]}>
        <View style={styles.permissionContent}>
          <Feather name="camera-off" size={64} color={theme.textSecondary} />
          <ThemedText type="h3" style={styles.permissionTitle}>
            Pristup kameri
          </ThemedText>
          <ThemedText type="body" style={[styles.permissionText, { color: theme.textSecondary }]}>
            Da biste skenirali QR kod ili bar kod uređaja, potrebno je odobriti pristup kameri.
          </ThemedText>
          <Pressable
            onPress={requestPermission}
            style={[styles.permissionButton, { backgroundColor: theme.primary }]}
          >
            <ThemedText type="body" style={styles.permissionButtonText}>
              Dozvoli pristup
            </ThemedText>
          </Pressable>
          <Pressable onPress={onClose} style={styles.cancelButton}>
            <ThemedText type="body" style={{ color: theme.textSecondary }}>
              Odustani
            </ThemedText>
          </Pressable>
        </View>
      </ThemedView>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        enableTorch={flashOn}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "ean13", "ean8", "code128", "code39", "code93", "datamatrix"],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />

      <View style={[styles.overlay, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <View style={styles.header}>
          <Pressable
            onPress={onClose}
            style={[styles.headerButton, { backgroundColor: "rgba(0,0,0,0.5)" }]}
          >
            <Feather name="x" size={24} color="#fff" />
          </Pressable>
          
          <Pressable
            onPress={toggleFlash}
            style={[
              styles.headerButton,
              { backgroundColor: flashOn ? theme.primary : "rgba(0,0,0,0.5)" },
            ]}
          >
            <Feather name={flashOn ? "zap" : "zap-off"} size={24} color="#fff" />
          </Pressable>
        </View>

        <View style={styles.scanAreaContainer}>
          <View style={[styles.scanArea, { width: SCAN_AREA_SIZE, height: SCAN_AREA_SIZE }]}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
        </View>

        <View style={styles.footer}>
          <ThemedText type="h4" style={styles.footerTitle}>
            Skenirajte kod uređaja
          </ThemedText>
          <ThemedText type="body" style={styles.footerText}>
            Usmerite kameru na QR kod ili bar kod na uređaju
          </ThemedText>

          {scanned ? (
            <Pressable
              onPress={handleScanAgain}
              style={[styles.scanAgainButton, { backgroundColor: theme.primary }]}
            >
              <Feather name="refresh-cw" size={20} color="#fff" />
              <ThemedText type="body" style={styles.scanAgainText}>
                Skeniraj ponovo
              </ThemedText>
            </Pressable>
          ) : null}
        </View>
      </View>
    </View>
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
  cancelButton: {
    marginTop: Spacing.lg,
    padding: Spacing.md,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: Spacing.lg,
  },
  headerButton: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  scanAreaContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scanArea: {
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: "#fff",
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 8,
  },
  footer: {
    alignItems: "center",
    paddingHorizontal: Spacing["2xl"],
    paddingBottom: Spacing["3xl"],
  },
  footerTitle: {
    color: "#fff",
    marginBottom: Spacing.sm,
  },
  footerText: {
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
  },
  scanAgainButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginTop: Spacing.xl,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  scanAgainText: {
    color: "#fff",
    fontWeight: "600",
  },
});
