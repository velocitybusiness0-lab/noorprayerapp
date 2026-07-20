import React, { useEffect, useRef } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn } from "react-native-reanimated";
import { ThemedText } from "@/components/primitives/ThemedText";
import { ONBOARDING_INK } from "@/features/onboarding/OnboardingPastelPalette";
import { OnboardingRatingCatalog } from "@/features/onboarding/catalog/OnboardingRatingCatalog";
import { OnboardingRatingContinuePolicy } from "@/features/onboarding/OnboardingRatingContinuePolicy";
import { OnboardingStoreReviewRequester } from "@/features/onboarding/OnboardingStoreReviewRequester";
import { OnboardingStep } from "@/features/onboarding/onboarding.types";
import { OnboardingRatingReviewCard } from "./OnboardingRatingReviewCard";

interface OnboardingRatingStepProps {
  step: OnboardingStep;
  onReady?: () => void;
}

const STAR_GOLD = "#E8B84A";

/**
 * App Store rating prompt page: stars, social proof, reviews, then native review sheet.
 * Continue unlocks after a short delay so users are never stuck if the sheet is throttled.
 */
export function OnboardingRatingStep({ step, onReady }: OnboardingRatingStepProps) {
  const promptedRef = useRef(false);
  const onReadyRef = useRef(onReady);

  useEffect(() => {
    onReadyRef.current = onReady;
  });

  useEffect(() => {
    const reviewTimer = setTimeout(() => {
      if (promptedRef.current) return;
      promptedRef.current = true;
      void OnboardingStoreReviewRequester.requestIfAvailable();
    }, OnboardingRatingContinuePolicy.reviewPromptDelayMs);

    const unlockTimer = setTimeout(() => {
      onReadyRef.current?.();
    }, OnboardingRatingContinuePolicy.continueUnlockDelayMs);

    return () => {
      clearTimeout(reviewTimer);
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

        <View style={styles.starsRow}>
          <Ionicons name="leaf-outline" size={28} color={ONBOARDING_INK} style={styles.leaf} />
          <View style={styles.stars}>
            {Array.from({ length: 5 }, (_, index) => (
              <Ionicons key={index} name="star" size={28} color={STAR_GOLD} />
            ))}
          </View>
          <Ionicons
            name="leaf-outline"
            size={28}
            color={ONBOARDING_INK}
            style={[styles.leaf, styles.leafMirror]}
          />
        </View>

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
  title: {
    color: ONBOARDING_INK,
    textAlign: "center",
    fontSize: 26,
    lineHeight: 32,
  },
  starsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  stars: {
    flexDirection: "row",
    gap: 4,
  },
  leaf: {
    opacity: 0.72,
  },
  leafMirror: {
    transform: [{ scaleX: -1 }],
  },
  subtitle: {
    color: ONBOARDING_INK,
    textAlign: "center",
    opacity: 0.88,
    maxWidth: 320,
    lineHeight: 22,
  },
  socialProof: {
    color: ONBOARDING_INK,
    opacity: 0.55,
    textAlign: "center",
  },
  reviews: {
    width: "100%",
    gap: 12,
    paddingHorizontal: 4,
  },
});
