import React from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/primitives/ThemedText";
import { PersonalizedPlanTestimonial } from "@/features/onboarding/OnboardingPersonalizedPlanCatalog";
import { OnboardingPersonalizedPlanTheme as Theme } from "@/features/onboarding/OnboardingPersonalizedPlanTheme";
import { OnboardingPersonalizedPlanTypography as Type } from "@/features/onboarding/OnboardingPersonalizedPlanTypography";

interface OnboardingPersonalizedPlanTestimonialCardProps {
  testimonial: PersonalizedPlanTestimonial;
  width: number;
}

/** Review card: name, handle, stars, quote. */
export function OnboardingPersonalizedPlanTestimonialCard({
  testimonial,
  width,
}: OnboardingPersonalizedPlanTestimonialCardProps) {
  return (
    <View style={[styles.card, { width }]}>
      <View style={styles.header}>
        <View style={styles.identity}>
          <ThemedText variant="bodyStrong" style={styles.name}>
            {testimonial.name}
          </ThemedText>
          <ThemedText variant="caption" style={styles.handle}>
            {testimonial.handle}
          </ThemedText>
        </View>
        <View style={styles.stars}>
          {Array.from({ length: testimonial.rating }, (_, index) => (
            <Ionicons key={index} name="star" size={13} color={Theme.star} />
          ))}
        </View>
      </View>
      <ThemedText variant="body" style={styles.quote}>
        {testimonial.quote}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 18,
    backgroundColor: Theme.cardSurface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Theme.cardBorder,
    gap: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },
  identity: {
    flex: 1,
    gap: 2,
  },
  name: Type.style({
    color: Theme.ink,
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: -0.15,
  }),
  handle: Type.style({
    color: Theme.softMuted,
    fontSize: 13,
  }),
  stars: {
    flexDirection: "row",
    gap: 2,
    paddingTop: 2,
  },
  quote: Type.style({
    color: Theme.ink,
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: -0.1,
  }),
});
