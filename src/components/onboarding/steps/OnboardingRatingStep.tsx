import React, { useEffect, useRef } from "react";
import { ScrollView, StyleSheet } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { ThemedText } from "@/components/primitives/ThemedText";
import { ONBOARDING_INK } from "@/features/onboarding/OnboardingPastelPalette";
import { OnboardingRatingCatalog } from "@/features/onboarding/catalog/OnboardingRatingCatalog";
import { OnboardingRatingContinuePolicy } from "@/features/onboarding/OnboardingRatingContinuePolicy";
import { OnboardingRatingTypography } from "@/features/onboarding/OnboardingRatingVisuals";
import { OnboardingStep } from "@/features/onboarding/onboarding.types";
import { OnboardingRatingReviewCard } from "./OnboardingRatingReviewCard";
import { OnboardingRatingStarsRow } from "./OnboardingRatingStarsRow";

interface OnboardingRatingStepProps {
  step: OnboardingStep;
  onReady?: () => void;
}

/**
 * Social-proof rating page: stars, laurels, and reviews.
 * Continue advances onboarding without opening a native review sheet.
 */
export function OnboardingRatingStep({ step, onReady }: OnboardingRatingStepProps) {
  const onReadyRef = useRef(onReady);

  useEffect(() => {
    onReadyRef.current = onReady;
  });

  useEffect(() => {
    const unlockTimer = setTimeout(() => {
      onReadyRef.current?.();
    }, OnboardingRatingContinuePolicy.continueUnlockDelayMs);

    return () => {
      clearTimeout(unlockTimer);
    };
  }, [step.id]);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View entering={FadeIn.duration(280)} style={styles.hero}>
        <ThemedText variant="heading" style={styles.title}>
          {step.title}
        </ThemedText>

        <OnboardingRatingStarsRow />

        {step.body ? (
          <ThemedText variant="body" style={styles.subtitle}>
            {step.body}
          </ThemedText>
        ) : null}

        <ThemedText variant="caption" style={styles.socialProof}>
          {OnboardingRatingCatalog.socialProofCopy}
        </ThemedText>
      </Animated.View>

      <Animated.View
        entering={FadeIn.duration(320).delay(120)}
        style={styles.reviews}
      >
        {OnboardingRatingCatalog.reviews.map((review) => (
          <OnboardingRatingReviewCard key={review.id} review={review} />
        ))}
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    width: "100%",
  },
  content: {
    paddingBottom: 24,
    gap: 20,
  },
  hero: {
    alignItems: "center",
    gap: 14,
    paddingTop: 8,
  },
  title: OnboardingRatingTypography.style({
    color: ONBOARDING_INK,
    textAlign: "center",
    fontSize: 26,
    lineHeight: 32,
  }),
  subtitle: OnboardingRatingTypography.style({
    color: ONBOARDING_INK,
    textAlign: "center",
    opacity: 0.88,
    maxWidth: 320,
    lineHeight: 22,
  }),
  socialProof: OnboardingRatingTypography.style({
    color: ONBOARDING_INK,
    opacity: 0.55,
    textAlign: "center",
  }),
  reviews: {
    width: "100%",
    gap: 12,
    paddingHorizontal: 4,
  },
});
