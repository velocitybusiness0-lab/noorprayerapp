import React from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn } from "react-native-reanimated";
import { ThemedText } from "@/components/primitives/ThemedText";
import { ONBOARDING_INK } from "@/features/onboarding/OnboardingPastelPalette";
import { CalculationChecklistStatus } from "@/features/onboarding/OnboardingCalculationChecklistProgress";

interface OnboardingCalculationChecklistRowProps {
  label: string;
  status: CalculationChecklistStatus;
  showDivider: boolean;
  hairlineColor: string;
  successColor: string;
}

/** Single calculation checklist row: label left, status circle right. */
export function OnboardingCalculationChecklistRow({
  label,
  status,
  showDivider,
  hairlineColor,
  successColor,
}: OnboardingCalculationChecklistRowProps) {
  const isUpcoming = status === "upcoming";
  const isCompleted = status === "completed";

  return (
    <View>
      <View style={styles.row}>
        <ThemedText
          variant="body"
          style={[styles.label, isUpcoming ? styles.labelUpcoming : styles.labelActive]}
        >
          {label}
        </ThemedText>
        {isCompleted ? (
          <Animated.View entering={FadeIn.duration(280)} style={[styles.check, { backgroundColor: successColor }]}>
            <Ionicons name="checkmark" size={14} color="#FFFFFF" />
          </Animated.View>
        ) : (
          <View style={styles.empty} />
        )}
      </View>
      {showDivider ? <View style={[styles.divider, { backgroundColor: hairlineColor }]} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 18,
    gap: 12,
  },
  label: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  labelActive: {
    color: ONBOARDING_INK,
    fontWeight: "600",
  },
  labelUpcoming: {
    color: ONBOARDING_INK,
    opacity: 0.38,
    fontWeight: "500",
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  empty: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "rgba(61,56,50,0.18)",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 18,
  },
});
