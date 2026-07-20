import React, { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { useTheme } from "@/core/theme";
import { haptics } from "@/core/haptics/HapticsManager";
import { Card } from "@/components/primitives/Card";
import { ThemedText } from "@/components/primitives/ThemedText";
import { DailyGoalRow } from "@/components/today/DailyGoalRow";
import { GoalEditorModal } from "@/components/today/GoalEditorModal";
import { useDailyGoals } from "@/features/dailyGoals/dailyGoalsStore";

/** Today's goals — add with Add, remove by holding a goal. */
export function DailyGoalsSection() {
  const theme = useTheme();
  const goals = useDailyGoals((s) => s.goals);
  const progress = useDailyGoals((s) => s.progress);
  const init = useDailyGoals((s) => s.init);
  const refresh = useDailyGoals((s) => s.refresh);
  const increment = useDailyGoals((s) => s.increment);
  const decrement = useDailyGoals((s) => s.decrement);
  const addGoal = useDailyGoals((s) => s.addGoal);
  const removeGoal = useDailyGoals((s) => s.removeGoal);
  const canAddGoal = useDailyGoals((s) => s.canAddGoal);

  const [addVisible, setAddVisible] = useState(false);

  useEffect(() => {
    init();
  }, [init]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const openAdd = () => {
    if (!canAddGoal()) return;
    haptics.selection();
    setAddVisible(true);
  };

  return (
    <>
      <Card style={styles.card}>
        <View style={styles.header}>
          <ThemedText variant="bodyStrong">Today&apos;s goals</ThemedText>
          {canAddGoal() && (
            <Pressable onPress={openAdd} hitSlop={8}>
              <ThemedText variant="bodyStrong" color="accent">
                Add
              </ThemedText>
            </Pressable>
          )}
        </View>

        {goals.length === 0 ? (
          <Pressable onPress={openAdd} style={styles.empty}>
            <ThemedText variant="body" color="textTertiary">
              Nothing here yet. Tap Add to create one.
            </ThemedText>
          </Pressable>
        ) : (
          <View style={styles.list}>
            {goals.map((goal, index) => (
              <View key={goal.id}>
                {index > 0 && (
                  <View style={[styles.divider, { backgroundColor: theme.colors.hairline }]} />
                )}
                <DailyGoalRow
                  goal={goal}
                  count={progress[goal.id] ?? 0}
                  onIncrement={() => increment(goal.id)}
                  onDecrement={() => decrement(goal.id)}
                  onRemove={() => removeGoal(goal.id)}
                />
              </View>
            ))}
          </View>
        )}
      </Card>

      <GoalEditorModal
        visible={addVisible}
        onClose={() => setAddVisible(false)}
        onSave={(title, target) => addGoal(title, target)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  card: { marginTop: 12 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  empty: { paddingVertical: 14 },
  list: { marginTop: 4 },
  divider: { height: StyleSheet.hairlineWidth },
});
