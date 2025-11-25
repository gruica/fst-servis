import React, { useRef, useCallback } from "react";
import { StyleSheet } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { CameraScanner } from "@/components/CameraScanner";
import { CustomersStackParamList } from "@/navigation/CustomersStackNavigator";

type Props = {
  navigation: NativeStackNavigationProp<CustomersStackParamList, "QRScanner">;
  route: RouteProp<CustomersStackParamList, "QRScanner">;
};

export default function QRScannerScreen({ navigation, route }: Props) {
  const hasNavigatedRef = useRef(false);

  const handleClose = () => {
    navigation.goBack();
  };

  const handleScan = useCallback((scannedData: string) => {
    if (hasNavigatedRef.current) return;
    hasNavigatedRef.current = true;

    let deviceInfo: { brand?: string; model?: string; serialNumber?: string } = {};
    
    try {
      const parsed = JSON.parse(scannedData);
      if (parsed.brand || parsed.model || parsed.serialNumber) {
        deviceInfo = {
          brand: parsed.brand || "",
          model: parsed.model || "",
          serialNumber: parsed.serialNumber || parsed.serial || "",
        };
      }
    } catch {
      if (scannedData.includes("|")) {
        const parts = scannedData.split("|");
        deviceInfo = {
          brand: parts[0] || "",
          model: parts[1] || "",
          serialNumber: parts[2] || "",
        };
      } else if (scannedData.length > 5) {
        deviceInfo = {
          serialNumber: scannedData,
        };
      }
    }
    
    navigation.replace("NewDevice", {
      customerId: route.params.customerId,
      scannedData: deviceInfo,
    });
  }, [navigation, route.params.customerId]);

  return <CameraScanner onScan={handleScan} onClose={handleClose} />;
}
