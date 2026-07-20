import React from "react";
import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/primitives/ThemedText";

const HINT_COPY = "Click the namaz to confirm after praying";

/** Subtle caption under the home prayer timetable. */
export function HomeTimetableConfirmHint() {
  return (
    <ThemedText variant="caption" color="textTertiary" style={styles.hint}>
      {HINT_COPY}
    </ThemedText>
  );
}

const styles = StyleSheet.create({
  hint: {
    marginTop: 10,
    textAlign: "center",
    opacity: 0.85,
  },
});
