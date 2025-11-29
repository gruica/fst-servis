import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ReportsScreen from "../screens/ReportsScreen";
import { useTheme } from "../hooks/useTheme";
import { getCommonScreenOptions } from "./screenOptions";

export type ReportsStackParamList = {
  Reports: undefined;
};

const Stack = createNativeStackNavigator<ReportsStackParamList>();

export default function ReportsStackNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        ...getCommonScreenOptions({ theme, isDark, transparent: false }),
      }}
    >
      <Stack.Screen
        name="Reports"
        component={ReportsScreen}
        options={{
          headerTitle: "Izveštaji",
        }}
      />
    </Stack.Navigator>
  );
}
