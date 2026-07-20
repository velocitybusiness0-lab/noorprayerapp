import React from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/primitives/ThemedText";
import { PersonalizedPlanKeywordItem } from "@/features/onboarding/OnboardingPersonalizedPlanCatalog";
import { OnboardingPersonalizedPlanTheme as Theme } from "@/features/onboarding/OnboardingPersonalizedPlanTheme";

interface OnboardingPersonalizedPlanKeywordRowsProps {
  items: readonly PersonalizedPlanKeywordItem[];
}

/** Icon rows with bold keyword + supporting rest of sentence. */
export function OnboardingPersonalizedPlanKeywordRows({
  items,
}: OnboardingPersonalizedPlanKeywordRowsProps) {
  return (
    <View style={styles.list}>
      {items.map((item) => (
        <View key={item.id} style={styles.row}>
          <View style={styles.iconWrap}>
            <Ionicons name={item.icon} size={18} color={Theme.accent} />
          </View>
          <ThemedText variant="body" style={styles.line}>
            <ThemedText variant="bodyStrong" style={styles.keyword}>
              {item.keyword}
            </ThemedText>
            {item.rest}
          </ThemedText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    width: "100%",
    gap: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Theme.iconWash,
    alignItems: "center",
    justifyContent: "center",
  },
  line: {
    color: Theme.muted,
    flex: 1,
    paddingTop: 6,
    lineHeight: 22,
  },
  keyword: {
    color: Theme.ink,
  },
});
