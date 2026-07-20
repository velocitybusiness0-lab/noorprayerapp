import React, { useMemo, useState } from "react";
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { ThemedText } from "@/components/primitives/ThemedText";
import { PersonalizedPlanTestimonial } from "@/features/onboarding/OnboardingPersonalizedPlanCatalog";
import { OnboardingPersonalizedPlanTheme as Theme } from "@/features/onboarding/OnboardingPersonalizedPlanTheme";
import { OnboardingPersonalizedPlanTypography as Type } from "@/features/onboarding/OnboardingPersonalizedPlanTypography";
import { OnboardingPersonalizedPlanLegalLinks } from "./OnboardingPersonalizedPlanLegalLinks";
import { OnboardingPersonalizedPlanTestimonialCard } from "./OnboardingPersonalizedPlanTestimonialCard";

const SCREEN_WIDTH = Dimensions.get("window").width;
const CARD_GAP = 12;
const SIDE_INSET = 8;
const CARD_WIDTH = Math.min(300, SCREEN_WIDTH - SIDE_INSET * 2 - 40);

interface OnboardingPersonalizedPlanClosingSectionProps {
  testimonials: readonly PersonalizedPlanTestimonial[];
  secondaryQuote: string;
  secondaryAttribution: string;
  comeThisFar: string;
  investHeadline: string;
  termsLabel: string;
  privacyLabel: string;
  restoreLabel: string;
}

/** Testimonials carousel, invest copy, and legal links (CTA floats above). */
export function OnboardingPersonalizedPlanClosingSection({
  testimonials,
  secondaryQuote,
  secondaryAttribution,
  comeThisFar,
  investHeadline,
  termsLabel,
  privacyLabel,
  restoreLabel,
}: OnboardingPersonalizedPlanClosingSectionProps) {
  const [page, setPage] = useState(0);
  const snapInterval = useMemo(() => CARD_WIDTH + CARD_GAP, []);

  const onScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(event.nativeEvent.contentOffset.x / snapInterval);
    setPage(Math.max(0, Math.min(next, testimonials.length - 1)));
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.reviews}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={snapInterval}
          snapToAlignment="start"
          onMomentumScrollEnd={onScrollEnd}
          contentContainerStyle={styles.carousel}
        >
          {testimonials.map((testimonial) => (
            <OnboardingPersonalizedPlanTestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              width={CARD_WIDTH}
            />
          ))}
        </ScrollView>

        <View style={styles.dots}>
          {testimonials.map((testimonial, index) => (
            <View
              key={testimonial.id}
              style={[styles.dot, index === page && styles.dotActive]}
            />
          ))}
        </View>

        <View style={styles.secondary}>
          <ThemedText variant="body" style={styles.secondaryQuote}>
            “{secondaryQuote}”
          </ThemedText>
          <ThemedText variant="caption" style={styles.secondaryAttr}>
            {secondaryAttribution}
          </ThemedText>
        </View>
      </View>

      <View style={styles.investBlock}>
        <View style={styles.invest}>
          <ThemedText variant="body" style={styles.comeThisFar}>
            {comeThisFar}
          </ThemedText>
          <ThemedText variant="heading" style={styles.investHeadline}>
            {investHeadline}
          </ThemedText>
        </View>

        <OnboardingPersonalizedPlanLegalLinks
          termsLabel={termsLabel}
          privacyLabel={privacyLabel}
          restoreLabel={restoreLabel}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    alignItems: "center",
    gap: 34,
    paddingVertical: 4,
  },
  reviews: {
    width: "100%",
    alignItems: "center",
    gap: 16,
  },
  carousel: {
    gap: CARD_GAP,
    paddingHorizontal: SIDE_INSET,
    paddingVertical: 2,
  },
  dots: {
    flexDirection: "row",
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "rgba(107,158,136,0.28)",
  },
  dotActive: {
    backgroundColor: Theme.accent,
  },
  secondary: {
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
  },
  secondaryQuote: Type.style({
    color: Theme.ink,
    textAlign: "center",
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "500",
    letterSpacing: -0.2,
  }),
  secondaryAttr: Type.style({
    color: Theme.softMuted,
    fontSize: 13,
  }),
  investBlock: {
    width: "100%",
    alignItems: "center",
    gap: 22,
    paddingTop: 12,
  },
  invest: {
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 10,
  },
  comeThisFar: Type.style({
    color: Theme.muted,
    textAlign: "center",
    fontSize: 16,
  }),
  investHeadline: Type.style({
    color: Theme.ink,
    textAlign: "center",
    fontSize: 23,
    lineHeight: 29,
    fontWeight: "600",
    letterSpacing: -0.3,
  }),
});
