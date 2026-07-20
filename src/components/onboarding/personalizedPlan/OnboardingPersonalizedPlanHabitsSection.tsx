import React from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/primitives/ThemedText";
import { PersonalizedPlanHabitStep } from "@/features/onboarding/OnboardingPersonalizedPlanCatalog";
import { OnboardingPersonalizedPlanTheme as Theme } from "@/features/onboarding/OnboardingPersonalizedPlanTheme";
import { OnboardingPersonalizedPlanGraphic } from "./OnboardingPersonalizedPlanGraphic";

interface OnboardingPersonalizedPlanHabitsSectionProps {
  title: string;
  body: string;
  howLead: string;
  steps: readonly PersonalizedPlanHabitStep[];
}

/** Section D: user habits and identity. */
export function OnboardingPersonalizedPlanHabitsSection({
  title,
  body,
  howLead,
  steps,
}: OnboardingPersonalizedPlanHabitsSectionProps) {
  return (
    <View style={styles.wrap}>
      <OnboardingPersonalizedPlanGraphic kind="habits" />
      <ThemedText variant="heading" style={styles.title}>
        {title}
      </ThemedText>
      <ThemedText variant="body" style={styles.body}>
        {body}
      </ThemedText>
      <ThemedText variant="bodyStrong" style={styles.howLead}>
        {howLead}
      </ThemedText>
      <View style={styles.list}>
        {steps.map((step) => (
          <View key={step.id} style={styles.row}>
            <View style={styles.iconWrap}>
              <Ionicons name={step.icon} size={20} color={Theme.accent} />
            </View>
            <View style={styles.copy}>
              <ThemedText variant="bodyStrong" style={styles.stepTitle}>
                {step.title}
              </ThemedText>
              <ThemedText variant="body" style={styles.stepBody}>
                {step.body}
              </ThemedText>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    alignItems: "center",
    gap: 16,
    paddingVertical: 8,
  },
  title: {
    color: Theme.ink,
    textAlign: "center",
    paddingHorizontal: 8,
  },
  body: {
    color: Theme.muted,
    textAlign: "center",
    paddingHorizontal: 12,
    lineHeight: 22,
  },
  howLead: {
    color: Theme.ink,
    alignSelf: "flex-start",
    paddingHorizontal: 4,
    marginTop: 4,
  },
  list: {
    width: "100%",
    gap: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    paddingHorizontal: 4,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Theme.sageFill,
    alignItems: "center",
    justifyContent: "center",
  },
  copy: {
    flex: 1,
    gap: 4,
    paddingTop: 2,
  },
  stepTitle: {
    color: Theme.ink,
  },
  stepBody: {
    color: Theme.muted,
    lineHeight: 21,
  },
});
