import React, { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/primitives/ThemedText";

interface ReminderSettingsSectionProps {
  label: string;
  children: ReactNode;
}

/** One labeled block in the reminder preferences card. */
export function ReminderSettingsSection({
  label,
  children,
}: ReminderSettingsSectionProps) {
  return (
    <View style={styles.section}>
      <ThemedText variant="caption" color="textTertiary">
        {label}
      </ThemedText>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 12,
  },
});
