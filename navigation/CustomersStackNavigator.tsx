import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CustomersScreen from "@/screens/CustomersScreen";
import CustomerDetailScreen from "@/screens/CustomerDetailScreen";
import NewCustomerScreen from "@/screens/NewCustomerScreen";
import DeviceDetailScreen from "@/screens/DeviceDetailScreen";
import NewDeviceScreen from "@/screens/NewDeviceScreen";
import QRScannerScreen from "@/screens/QRScannerScreen";
import { useTheme } from "@/hooks/useTheme";
import { getCommonScreenOptions } from "@/navigation/screenOptions";

export type ScannedDeviceData = {
  brand?: string;
  model?: string;
  serialNumber?: string;
};

export type CustomersStackParamList = {
  Customers: undefined;
  CustomerDetail: { customerId: string };
  NewCustomer: undefined;
  DeviceDetail: { deviceId: string };
  NewDevice: { customerId: string; scannedData?: ScannedDeviceData };
  QRScanner: { customerId: string };
};

const Stack = createNativeStackNavigator<CustomersStackParamList>();

export default function CustomersStackNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        ...getCommonScreenOptions({ theme, isDark }),
      }}
    >
      <Stack.Screen
        name="Customers"
        component={CustomersScreen}
        options={{
          headerTitle: "Klijenti",
        }}
      />
      <Stack.Screen
        name="CustomerDetail"
        component={CustomerDetailScreen}
        options={{
          headerTitle: "Detalji klijenta",
          ...getCommonScreenOptions({ theme, isDark, transparent: false }),
        }}
      />
      <Stack.Screen
        name="NewCustomer"
        component={NewCustomerScreen}
        options={{
          headerTitle: "Novi klijent",
          presentation: "modal",
          ...getCommonScreenOptions({ theme, isDark, transparent: false }),
        }}
      />
      <Stack.Screen
        name="DeviceDetail"
        component={DeviceDetailScreen}
        options={{
          headerTitle: "Detalji uređaja",
          ...getCommonScreenOptions({ theme, isDark, transparent: false }),
        }}
      />
      <Stack.Screen
        name="NewDevice"
        component={NewDeviceScreen}
        options={{
          headerTitle: "Novi uređaj",
          presentation: "modal",
          ...getCommonScreenOptions({ theme, isDark, transparent: false }),
        }}
      />
      <Stack.Screen
        name="QRScanner"
        component={QRScannerScreen}
        options={{
          headerShown: false,
          presentation: "fullScreenModal",
          animation: "slide_from_bottom",
        }}
      />
    </Stack.Navigator>
  );
}
