import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "@/core/theme";

interface AppBlockingShieldBadgeProps {
  active: boolean;
  appCount: number;
}

/** Shield emblem with a soft pulse when blocking is live. */
export function AppBlockingShieldBadge({ active, appCount }: AppBlockingShieldBadgeProps) {
  const theme = useTheme();
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (!active) {
      pulse.value = 1;
      return;
    }
    pulse.value = withRepeat(
      withTiming(1.08, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, [active, pulse]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: active ? 0.55 : 0.25,
  }));

  return (
    <View style={styles.wrap}>
      <Animated.View
        style={[
          styles.ring,
          ringStyle,
          {
            borderColor: active ? theme.colors.accent : theme.colors.border,
            backgroundColor: active ? theme.colors.sageMuted : theme.colors.backgroundElevated,
          },
        ]}
      />
      <View
        style={[
          styles.core,
          {
            backgroundColor: active ? theme.colors.accent : theme.colors.surface,
            borderColor: theme.colors.hairline,
          },
        ]}
      >
        <Ionicons
          name={active ? "shield-checkmark" : "shield-outline"}
          size={28}
          color={active ? theme.colors.onAccent : theme.colors.accent}
        />
      </View>
      {active && appCount > 0 ? (
        <View style={[styles.count, { backgroundColor: theme.colors.warmGlow }]}>
          <Animated.Text style={[styles.countText, { color: theme.colors.textInverse }]}>
            {appCount}
          </Animated.Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: 72, height: 72, alignItems: "center", justifyContent: "center" },
  ring: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 36,
    borderWidth: 2,
  },
  core: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
  },
  count: {
    position: "absolute",
    right: 2,
    bottom: 2,
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  countText: { fontSize: 11, fontWeight: "700" },
});
