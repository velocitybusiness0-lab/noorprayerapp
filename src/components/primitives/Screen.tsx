import React from "react";
import { ScrollView, StyleSheet, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/core/theme";

interface ScreenProps {
  children: React.ReactNode;
  scroll?: boolean;
  /** Extra bottom padding so content clears the translucent tab bar. */
  tabBarPadding?: boolean;
  contentStyle?: ViewStyle;
}

const TAB_BAR_CLEARANCE = 108;

/** Root container: applies themed background and safe-area insets. */
export function Screen({
  children,
  scroll = false,
  tabBarPadding = false,
  contentStyle,
}: ScreenProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const padding: ViewStyle = {
    paddingTop: insets.top + theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: tabBarPadding ? TAB_BAR_CLEARANCE : insets.bottom + theme.spacing.lg,
  };

  const background = { backgroundColor: theme.colors.background };

  if (scroll) {
    return (
      <ScrollView
        style={[styles.flex, background]}
        contentContainerStyle={[padding, contentStyle]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    );
  }

  return <View style={[styles.flex, background, padding, contentStyle]}>{children}</View>;
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
