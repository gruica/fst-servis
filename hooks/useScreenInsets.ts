import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import { Spacing } from "@/constants/theme";

interface UseScreenInsetsOptions {
  hasTransparentHeader?: boolean;
}

export function useScreenInsets(options: UseScreenInsetsOptions = {}) {
  const { hasTransparentHeader = true } = options;
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();

  const paddingTop = hasTransparentHeader 
    ? headerHeight + Spacing.xl 
    : Spacing.lg;

  return {
    paddingTop,
    paddingBottom: tabBarHeight + Spacing.xl,
    scrollInsetBottom: insets.bottom + 16,
  };
}
