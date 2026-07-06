import React, { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "@/core/theme";
import { haptics } from "@/core/haptics/HapticsManager";
import { ThemedText } from "@/components/primitives/ThemedText";
import { GoalProgressBar } from "@/components/today/GoalProgressBar";
import { DailyGoal, isAutoNamazGoal } from "@/features/dailyGoals/dailyGoals.types";

interface DailyGoalRowProps {
  goal: DailyGoal;
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}

const REMOVE_DURATION_MS = 380;

/** One goal: name, count, animated green bar, and −/+ buttons. Hold to remove. */
export function DailyGoalRow({
  goal,
  count,
  onIncrement,
  onDecrement,
  onRemove,
}: DailyGoalRowProps) {
  const target = Number.isFinite(goal.target) && goal.target > 0 ? goal.target : 1;
  const ratio = Math.min(1, count / target);
  const autoGoal = isAutoNamazGoal(goal.id);
  const rowOpacity = useSharedValue(1);
  const [isRemoving, setIsRemoving] = useState(false);
  const [drainRatio, setDrainRatio] = useState<number | null>(null);

  useEffect(() => {
    if (!isRemoving) setDrainRatio(null);
  }, [isRemoving]);

  const finishRemove = () => {
    setIsRemoving(false);
    onRemove();
  };

  const animateRemove = () => {
    if (isRemoving) return;
    setIsRemoving(true);
    haptics.success();
    setDrainRatio(0);
    rowOpacity.value = withTiming(0, { duration: REMOVE_DURATION_MS }, (finished) => {
      if (finished) runOnJS(finishRemove)();
    });
  };

  const confirmRemove = () => {
    if (isAutoNamazGoal(goal.id)) return;
    haptics.warning();
    Alert.alert("Remove goal?", `Remove "${goal.title}"?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", style: "destructive", onPress: animateRemove },
    ]);
  };

  const rowStyle = useAnimatedStyle(() => ({
    opacity: rowOpacity.value,
  }));

  const barRatio = drainRatio ?? ratio;

  return (
    <Pressable onLongPress={confirmRemove} delayLongPress={450} disabled={autoGoal}>
      <Animated.View style={[styles.wrap, rowStyle]}>
        <View style={styles.row}>
          <View style={styles.label}>
            <ThemedText variant="body" numberOfLines={2}>
              {goal.title}
            </ThemedText>
          </View>

          <ThemedText variant="bodyStrong" color="textSecondary" style={styles.count}>
            {`${count}/${target}`}
          </ThemedText>

          {!autoGoal && (
            <View style={styles.controls}>
              <StepButton label="−" onPress={onDecrement} disabled={count <= 0 || isRemoving} />
              <StepButton label="+" onPress={onIncrement} disabled={count >= target || isRemoving} />
            </View>
          )}
        </View>

        <GoalProgressBar
          ratio={barRatio}
          animate={!isRemoving}
          durationMs={isRemoving ? REMOVE_DURATION_MS : 220}
        />
      </Animated.View>
    </Pressable>
  );
}

function StepButton({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  const theme = useTheme();

  return (
    <Pressable
      disabled={disabled}
      onPress={() => {
        haptics.selection();
        onPress();
      }}
      style={[
        styles.stepBtn,
        {
          borderColor: theme.colors.border,
          opacity: disabled ? 0.35 : 1,
        },
      ]}
    >
      <ThemedText variant="bodyStrong" color="accent">
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingVertical: 12, gap: 8 },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  label: { flex: 1 },
  count: { minWidth: 36, textAlign: "center" },
  controls: { flexDirection: "row", gap: 6 },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
  },
});
