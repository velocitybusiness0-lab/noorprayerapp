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
import { DuaCreateListPicker } from "./DuaCreateListPicker";

interface DuaCreateListModalProps {
  visible: boolean;
  onClose: () => void;
  onCreate: (name: string, duaIds: string[]) => void;
}

/** Modal to name a new list and optionally multi-select catalog duas. */
export function DuaCreateListModal({
  visible,
  onClose,
  onCreate,
}: DuaCreateListModalProps) {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const [name, setName] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    if (!visible) return;
    setName("");
    setSelectedIds([]);
  }, [visible]);

  const handleCreate = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    haptics.success();
    onCreate(trimmed, selectedIds);
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
          <ThemedText variant="heading">New list</ThemedText>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Name"
            placeholderTextColor={theme.colors.textTertiary}
            autoFocus
            style={[
              styles.input,
              {
                color: theme.colors.textPrimary,
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.background,
                borderRadius: theme.radii.md,
              },
            ]}
          />
          <DuaCreateListPicker
            selectedIds={selectedIds}
            onChangeSelectedIds={setSelectedIds}
          />
          <View style={styles.actions}>
            <Button label="Cancel" variant="ghost" onPress={onClose} />
            <Button label="Create" onPress={handleCreate} disabled={!name.trim()} />
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
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  actions: { flexDirection: "row", justifyContent: "flex-end", gap: 8, marginTop: 4 },
});
