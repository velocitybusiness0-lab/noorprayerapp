import React from "react";
import { StyleSheet, View } from "react-native";
import { ImpactFeedbackStyle } from "expo-haptics";
import { Pressable } from "react-native-gesture-handler";
import { haptics } from "@/core/haptics/HapticsManager";
import { ThemedText } from "@/components/primitives/ThemedText";
import { OnboardingPersonalizedPlanTheme as Theme } from "@/features/onboarding/OnboardingPersonalizedPlanTheme";

interface OnboardingPersonalizedPlanDiscountBoxProps {
  title: string;
  body: string;
  ctaLabel: string;
  onPress: () => void;
}

/**
 * Dark navy “Special Discount!” promo card — title, offer line, Claim Now.
 * Matches the bottom-sheet style reference: one centered box, high contrast.
 */
export function OnboardingPersonalizedPlanDiscountBox({
  title,
  body,
  ctaLabel,
  onPress,
}: OnboardingPersonalizedPlanDiscountBoxProps) {
  return (
    <View style={styles.box}>
      <ThemedText variant="heading" style={styles.title}>
        {title}
      </ThemedText>

      <ThemedText variant="body" style={styles.body}>
        {body}
      </ThemedText>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={ctaLabel}
        onPress={() => {
          haptics.impact(ImpactFeedbackStyle.Medium);
          onPress();
        }}
        style={({ pressed }) => [
          styles.cta,
          {
            opacity: pressed ? 0.92 : 1,
            transform: [{ scale: pressed ? 0.985 : 1 }],
          },
        ]}
      >
        <ThemedText variant="bodyStrong" style={styles.ctaLabel}>
          {ctaLabel}
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    width: "100%",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 24,
    backgroundColor: Theme.discountCardFill,
    gap: 10,
    alignItems: "center",
  },
  title: {
    color: Theme.discountTitle,
    textAlign: "center",
    fontWeight: "700",
    fontSize: 28,
    lineHeight: 34,
  },
  body: {
    color: Theme.discountBody,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 6,
  },
  cta: {
    marginTop: 6,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: Theme.discountCtaFill,
  },
  ctaLabel: {
    color: Theme.discountCtaText,
    fontWeight: "700",
  },
});
