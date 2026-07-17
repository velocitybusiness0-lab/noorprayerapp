import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "@/core/theme";
import { haptics } from "@/core/haptics/HapticsManager";
import { ThemedText } from "@/components/primitives/ThemedText";

interface AppBlockingActionTileProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress: () => void;
}

/** Tappable action tile used when blocking is active. */
export function AppBlockingActionTile({
  icon,
  title,
  subtitle,
  onPress,
}: AppBlockingActionTileProps) {
  const theme = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.flex, animatedStyle]}>
      <Pressable
        onPressIn={() => {
          scale.value = withTiming(0.96, { duration: 80 });
        }}
        onPressOut={() => {
          scale.value = withTiming(1, { duration: 120 });
        }}
        onPress={() => {
          haptics.selection();
          onPress();
        }}
        style={[
          styles.tile,
          {
            backgroundColor: theme.colors.surfaceTranslucent,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <View style={[styles.iconWrap, { backgroundColor: theme.colors.sageMuted }]}>
          <Ionicons name={icon} size={18} color={theme.colors.accent} />
        </View>
        <ThemedText variant="bodyStrong" style={styles.title} numberOfLines={1}>
          {title}
        </ThemedText>
        <ThemedText variant="caption" color="textTertiary" style={styles.subtitle} numberOfLines={1}>
          {subtitle ?? " "}
        </ThemedText>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, alignSelf: "stretch" },
  tile: {
    flex: 1,
    minHeight: 96,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  title: { textAlign: "center" },
  subtitle: { textAlign: "center", minHeight: 16, marginTop: 2 },
});
