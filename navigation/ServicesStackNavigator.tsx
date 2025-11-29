import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ServicesScreen from "../screens/ServicesScreen";
import ServiceDetailScreen from "../screens/ServiceDetailScreen";
import NewServiceScreen from "../screens/NewServiceScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { HeaderTitle } from "../components/HeaderTitle";
import { useTheme } from "../hooks/useTheme";
import { getCommonScreenOptions } from "./screenOptions";

export type ServicesStackParamList = {
  Services: undefined;
  ServiceDetail: { serviceId: string };
  NewService: { customerId?: string; deviceId?: string } | undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<ServicesStackParamList>();

export default function ServicesStackNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        ...getCommonScreenOptions({ theme, isDark }),
      }}
    >
      <Stack.Screen
        name="Services"
        component={ServicesScreen}
        options={{
          headerTitle: () => <HeaderTitle title="FST Servis" />,
        }}
      />
      <Stack.Screen
        name="ServiceDetail"
        component={ServiceDetailScreen}
        options={{
          headerTitle: "Detalji servisa",
          ...getCommonScreenOptions({ theme, isDark, transparent: false }),
        }}
      />
      <Stack.Screen
        name="NewService"
        component={NewServiceScreen}
        options={{
          headerTitle: "Novi servis",
          presentation: "modal",
          ...getCommonScreenOptions({ theme, isDark, transparent: false }),
        }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerTitle: "Profil",
          ...getCommonScreenOptions({ theme, isDark, transparent: false }),
        }}
      />
    </Stack.Navigator>
  );
}
