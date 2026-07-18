import React, { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/primitives/ThemedText";

interface ReminderSettingsRowProps {
  label: string;
  /** Optional one-line clarification under the label. */
  hint?: string;
  children: ReactNode;
}

/** Label + control on one horizontal row for simple prefs. */
export function ReminderSettingsRow({
  label,
  hint,
  children,
}: ReminderSettingsRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.copy}>
        <ThemedText variant="body">{label}</ThemedText>
        {hint ? (
          <ThemedText variant="caption" color="textTertiary">
            {hint}
          </ThemedText>
        ) : null}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 44,
    gap: 12,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
});
