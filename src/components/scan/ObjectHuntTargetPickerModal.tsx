import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/core/theme";
import { haptics } from "@/core/haptics/HapticsManager";
import { ThemedText } from "@/components/primitives/ThemedText";
import { Button } from "@/components/primitives/Button";
import { ObjectHuntTargetRow } from "@/components/scan/ObjectHuntTargetRow";
import { ScanTarget } from "@/features/scan/scanTargets";

interface ObjectHuntTargetPickerModalProps {
  visible: boolean;
  targets: ScanTarget[];
  selectedTarget: ScanTarget;
  onSelect: (target: ScanTarget) => void;
  onClose: () => void;
}

/** Center popup for swapping the object hunt target — mirrors the mode picker. */
export function ObjectHuntTargetPickerModal({
  visible,
  targets,
  selectedTarget,
  onSelect,
  onClose,
}: ObjectHuntTargetPickerModalProps) {
  const theme = useTheme();
  const { width } = useWindowDimensions();

  const handleSelect = (target: ScanTarget) => {
    onSelect(target);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[
            styles.sheet,
            {
              width: Math.min(width - 48, 360),
              backgroundColor: theme.colors.surface,
              borderRadius: theme.radii.lg,
              borderColor: theme.colors.border,
            },
          ]}
          onPress={(event) => event.stopPropagation()}
        >
          <ThemedText variant="heading" style={styles.title}>
            Find object
          </ThemedText>
          <ThemedText variant="caption" color="textTertiary" style={styles.subtitle}>
            Pick what you want to scan.
          </ThemedText>

          <View style={styles.list}>
            {targets.map((target, index) => (
              <ObjectHuntTargetRow
                key={target.id}
                target={target}
                selected={target.id === selectedTarget.id}
                onSelect={() => handleSelect(target)}
                last={index === targets.length - 1}
              />
            ))}
          </View>

          <Button label="Done" onPress={onClose} style={styles.done} />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

interface ObjectHuntTargetPillProps {
  label: string;
  onPress: () => void;
}

/** Compact control above the camera — opens the target picker. */
export function ObjectHuntTargetPill({ label, onPress }: ObjectHuntTargetPillProps) {
  return (
    <Pressable
      onPress={() => {
        haptics.selection();
        onPress();
      }}
      style={styles.pill}
    >
      <Ionicons name="options-outline" size={16} color="#FFFFFF" />
      <ThemedText variant="caption" style={styles.pillText}>
        {`Object: ${label}`}
      </ThemedText>
      <Ionicons name="chevron-down" size={14} color="rgba(255,255,255,0.7)" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  sheet: {
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 18,
  },
  title: { textAlign: "center" },
  subtitle: { textAlign: "center", marginTop: 8, marginBottom: 8 },
  list: { marginTop: 4 },
  done: { marginTop: 8 },
  pill: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.28)",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  pillText: { color: "rgba(255,255,255,0.9)" },
});
