import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { useTheme } from "@/core/theme";
import { haptics } from "@/core/haptics/HapticsManager";
import { ThemedText } from "@/components/primitives/ThemedText";
import { Button } from "@/components/primitives/Button";
import { SalahModeCheckboxRow } from "@/components/modes/SalahModeCheckboxRow";
import { useModes } from "@/features/modes/modeStore";
import { ALL_SALAH_MODES } from "@/features/modes/mode.types";

interface SalahModePickerModalProps {
  visible: boolean;
  onClose: () => void;
}

/** Center popup for choosing what happens when prayer time arrives. */
export function SalahModePickerModal({ visible, onClose }: SalahModePickerModalProps) {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const enabledModes = useModes((s) => s.enabledModes);
  const toggleMode = useModes((s) => s.toggleMode);

  const handleToggle = (mode: (typeof ALL_SALAH_MODES)[number]) => {
    const isOnlySelected = enabledModes.length === 1 && enabledModes.includes(mode);
    if (isOnlySelected) {
      haptics.warning();
      return;
    }
    toggleMode(mode);
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
            When prayer time arrives
          </ThemedText>
          <ThemedText variant="caption" color="textTertiary" style={styles.subtitle}>
            Choose everything you want to happen. You can select more than one.
          </ThemedText>

          <View style={styles.list}>
            {ALL_SALAH_MODES.map((mode, index) => (
              <SalahModeCheckboxRow
                key={mode}
                mode={mode}
                checked={enabledModes.includes(mode)}
                onToggle={() => handleToggle(mode)}
                last={index === ALL_SALAH_MODES.length - 1}
              />
            ))}
          </View>

          <Button label="Done" onPress={onClose} style={styles.done} />
        </Pressable>
      </Pressable>
    </Modal>
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
});
