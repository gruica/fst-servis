import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ScheduleScreen from "../screens/ScheduleScreen";
import { useTheme } from "../hooks/useTheme";
import { getCommonScreenOptions } from "./screenOptions";

export type ScheduleStackParamList = {
  Schedule: undefined;
};

const Stack = createNativeStackNavigator<ScheduleStackParamList>();

export default function ScheduleStackNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        ...getCommonScreenOptions({ theme, isDark, transparent: false }),
      }}
    >
      <Stack.Screen
        name="Schedule"
        component={ScheduleScreen}
        options={{
          headerTitle: "Raspored",
        }}
      />
    </Stack.Navigator>
  );
}
