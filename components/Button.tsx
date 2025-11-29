import React, { ReactNode, useCallback } from "react";
import { StyleSheet, Pressable, ViewStyle, StyleProp, Platform, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  WithSpringConfig,
} from "react-native-reanimated";

import { ThemedText } from "./ThemedText";
import { useTheme } from "../hooks/useTheme";
import { BorderRadius, Spacing } from "../constants/theme";

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'success';

interface ButtonProps {
  onPress?: () => void;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  variant?: ButtonVariant;
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

const springConfig: WithSpringConfig = {
  damping: 15,
  mass: 0.3,
  stiffness: 150,
  overshootClamping: true,
  energyThreshold: 0.001,
};

export function Button({
  onPress,
  children,
  style,
  disabled = false,
  variant = 'primary',
  size = 'medium',
  fullWidth = true,
}: ButtonProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    if (!disabled) {
      scale.value = withSpring(0.97, springConfig);
    }
  }, [disabled, scale]);

  const handlePressOut = useCallback(() => {
    if (!disabled) {
      scale.value = withSpring(1, springConfig);
    }
  }, [disabled, scale]);

  const handlePress = useCallback(() => {
    if (!disabled && onPress) {
      onPress();
    }
  }, [disabled, onPress]);

  const getBackgroundColor = () => {
    if (disabled) return theme.backgroundTertiary;
    switch (variant) {
      case 'primary':
        return theme.primary;
      case 'secondary':
        return theme.backgroundSecondary;
      case 'outline':
        return 'transparent';
      case 'danger':
        return theme.error;
      case 'success':
        return theme.success;
      default:
        return theme.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return theme.textSecondary;
    switch (variant) {
      case 'primary':
      case 'danger':
      case 'success':
        return '#FFFFFF';
      case 'secondary':
        return theme.text;
      case 'outline':
        return theme.primary;
      default:
        return '#FFFFFF';
    }
  };

  const getBorderStyle = (): ViewStyle => {
    if (variant === 'outline') {
      return {
        borderWidth: 2,
        borderColor: disabled ? theme.backgroundTertiary : theme.primary,
      };
    }
    return {};
  };

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'small':
        return {
          height: 40,
          paddingHorizontal: Spacing.md,
        };
      case 'large':
        return {
          height: 56,
          paddingHorizontal: Spacing["2xl"],
        };
      default:
        return {
          height: Spacing.buttonHeight,
          paddingHorizontal: Spacing.lg,
        };
    }
  };

  const getShadowStyle = (): ViewStyle => {
    if (disabled || variant === 'outline') return {};
    
    if (Platform.OS === 'android') {
      return {
        elevation: 4,
      };
    }
    
    if (Platform.OS === 'web') {
      return {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.15)',
      } as ViewStyle;
    }
    
    return {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
    };
  };

  const buttonStyles: ViewStyle[] = [
    styles.button,
    getSizeStyle(),
    getBorderStyle(),
    getShadowStyle(),
    {
      backgroundColor: getBackgroundColor(),
      opacity: disabled ? 0.6 : 1,
      width: fullWidth ? '100%' : undefined,
    },
    style as ViewStyle,
  ].filter(Boolean) as ViewStyle[];

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      <Animated.View style={[buttonStyles, animatedStyle]}>
        <ThemedText
          type="body"
          style={[
            styles.buttonText,
            { color: getTextColor() },
            size === 'large' && styles.largeText,
            size === 'small' && styles.smallText,
          ]}
        >
          {children}
        </ThemedText>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: 'row',
  },
  buttonText: {
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  largeText: {
    fontSize: 18,
  },
  smallText: {
    fontSize: 14,
  },
});
