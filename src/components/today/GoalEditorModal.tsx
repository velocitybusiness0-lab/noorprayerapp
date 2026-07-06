import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { useTheme } from "@/core/theme";
import { haptics } from "@/core/haptics/HapticsManager";
import { ThemedText } from "@/components/primitives/ThemedText";
import { Button } from "@/components/primitives/Button";
import {
  GOAL_PRESETS,
  MAX_GOAL_TARGET,
  MIN_GOAL_TARGET,
} from "@/features/dailyGoals/dailyGoals.types";

interface GoalEditorModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (title: string, target: number) => void;
}

/** Add-only sheet: name a goal and pick how many for today with −/+. */
export function GoalEditorModal({ visible, onClose, onSave }: GoalEditorModalProps) {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState(3);

  useEffect(() => {
    if (!visible) return;
    setTitle("");
    setTarget(3);
  }, [visible]);

  const stepTarget = (delta: number) => {
    haptics.selection();
    setTarget((prev) =>
      Math.max(MIN_GOAL_TARGET, Math.min(MAX_GOAL_TARGET, prev + delta))
    );
  };

  const handleSave = () => {
    const trimmed = title.trim();
    if (!trimmed || !Number.isFinite(target) || target < MIN_GOAL_TARGET) return;
    haptics.success();
    onSave(trimmed, target);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[
            styles.sheet,
            {
              width: Math.min(width - 48, 340),
              backgroundColor: theme.colors.surface,
              borderRadius: theme.radii.lg,
              borderColor: theme.colors.border,
            },
          ]}
          onPress={(event) => event.stopPropagation()}
        >
          <ThemedText variant="heading">New goal</ThemedText>

          <View style={styles.suggestions}>
            {GOAL_PRESETS.map((preset) => (
              <Pressable
                key={preset}
                onPress={() => {
                  haptics.selection();
                  setTitle(preset);
                }}
                style={[styles.suggestion, { borderColor: theme.colors.border }]}
              >
                <ThemedText variant="body" color="textSecondary">
                  {preset}
                </ThemedText>
              </Pressable>
            ))}
          </View>

          <ThemedText variant="caption" color="textTertiary" style={styles.label}>
            What do you want to do?
          </ThemedText>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Good deeds done"
            placeholderTextColor={theme.colors.textTertiary}
            style={[
              styles.input,
              {
                color: theme.colors.textPrimary,
                backgroundColor: theme.colors.backgroundElevated,
                borderColor: theme.colors.border,
              },
            ]}
          />

          <ThemedText variant="caption" color="textTertiary" style={styles.label}>
            How many today?
          </ThemedText>

          <View style={styles.targetRow}>
            <Pressable
              onPress={() => stepTarget(-1)}
              disabled={target <= MIN_GOAL_TARGET}
              style={[styles.targetStep, { opacity: target <= MIN_GOAL_TARGET ? 0.35 : 1 }]}
            >
              <ThemedText variant="heading">−</ThemedText>
            </Pressable>
            <ThemedText variant="display" style={styles.targetValue}>
              {target}
            </ThemedText>
            <Pressable
              onPress={() => stepTarget(1)}
              disabled={target >= MAX_GOAL_TARGET}
              style={[styles.targetStep, { opacity: target >= MAX_GOAL_TARGET ? 0.35 : 1 }]}
            >
              <ThemedText variant="heading">+</ThemedText>
            </Pressable>
          </View>

          <Button label="Add" onPress={handleSave} style={styles.save} />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  sheet: { padding: 24, borderWidth: StyleSheet.hairlineWidth },
  suggestions: { marginTop: 16, gap: 8 },
  suggestion: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
  label: { marginTop: 20, marginBottom: 8 },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  targetRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
    marginTop: 4,
    marginBottom: 20,
  },
  targetStep: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  targetValue: { minWidth: 48, textAlign: "center" },
  save: { marginTop: 4 },
});
