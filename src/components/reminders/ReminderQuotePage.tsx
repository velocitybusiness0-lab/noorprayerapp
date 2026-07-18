import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/primitives/ThemedText";
import { MotivationReminder } from "@/features/motivation/motivation.types";

interface ReminderQuotePageProps {
  reminder: MotivationReminder;
  height: number;
}

/** One full-screen centered quote page for the vertical pager. */
export function ReminderQuotePage({ reminder, height }: ReminderQuotePageProps) {
  return (
    <View style={[styles.page, { height }]}>
      <View style={styles.center}>
        <ThemedText variant="title" style={styles.quote}>
          {reminder.text}
        </ThemedText>
        {reminder.source ? (
          <ThemedText variant="caption" color="textTertiary" style={styles.source}>
            {reminder.source}
          </ThemedText>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  center: {
    alignItems: "center",
    gap: 16,
  },
  quote: {
    textAlign: "center",
    lineHeight: 34,
  },
  source: {
    textAlign: "center",
  },
});
