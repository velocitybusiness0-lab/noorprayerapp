import React, { useEffect, useState } from "react";
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
import { DuaCreateListPicker } from "./DuaCreateListPicker";

interface DuaAddToListModalProps {
  visible: boolean;
  listName: string;
  initialSelectedIds?: string[];
  onClose: () => void;
  onSave: (duaIds: string[]) => void;
}

/** Multi-select catalog picker to attach duas to an existing list. */
export function DuaAddToListModal({
  visible,
  listName,
  initialSelectedIds = [],
  onClose,
  onSave,
}: DuaAddToListModalProps) {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds);

  useEffect(() => {
    if (!visible) return;
    setSelectedIds(initialSelectedIds);
  }, [visible, initialSelectedIds]);

  const handleSave = () => {
    haptics.success();
    onSave(selectedIds);
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
          <ThemedText variant="heading">Add duas</ThemedText>
          <ThemedText variant="caption" color="textSecondary">
            {listName}
          </ThemedText>
          <DuaCreateListPicker
            selectedIds={selectedIds}
            onChangeSelectedIds={setSelectedIds}
          />
          <View style={styles.actions}>
            <Button label="Cancel" variant="ghost" onPress={onClose} />
            <Button label="Save" onPress={handleSave} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  sheet: {
    padding: 20,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  actions: { flexDirection: "row", justifyContent: "flex-end", gap: 8, marginTop: 4 },
});
