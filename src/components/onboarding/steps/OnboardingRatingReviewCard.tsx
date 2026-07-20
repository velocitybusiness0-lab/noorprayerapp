import React from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/primitives/ThemedText";
import { ONBOARDING_INK } from "@/features/onboarding/OnboardingPastelPalette";
import { OnboardingRatingReview } from "@/features/onboarding/catalog/OnboardingRatingCatalog";
import { OnboardingRatingReviewAvatar } from "./OnboardingRatingReviewAvatar";

interface OnboardingRatingReviewCardProps {
  review: OnboardingRatingReview;
}

const STAR_GOLD = "#E8B84A";

/** Single testimonial card for the onboarding rating page. */
export function OnboardingRatingReviewCard({
  review,
}: OnboardingRatingReviewCardProps) {
  return (
    <View style={styles.card}>
      <OnboardingRatingReviewAvatar
        avatarSource={review.avatarSource}
        accessibilityLabel={`${review.name} avatar`}
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.meta}>
            <ThemedText variant="bodyStrong" style={styles.name}>
              {review.name}
            </ThemedText>
            {review.handle ? (
              <ThemedText variant="caption" style={styles.handle}>
                {review.handle}
              </ThemedText>
            ) : null}
          </View>
          <View style={styles.stars}>
            {Array.from({ length: review.rating }, (_, index) => (
              <Ionicons key={index} name="star" size={12} color={STAR_GOLD} />
            ))}
          </View>
        </View>
        <ThemedText variant="body" style={styles.body}>
          {review.review}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: 16,
    padding: 16,
    gap: 12,
    backgroundColor: "rgba(61,56,50,0.06)",
    borderWidth: 1,
    borderColor: "rgba(61,56,50,0.1)",
  },
  content: {
    flex: 1,
    flexShrink: 1,
    gap: 8,
    minWidth: 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  meta: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  name: {
    color: ONBOARDING_INK,
    fontSize: 15,
  },
  handle: {
    color: ONBOARDING_INK,
    opacity: 0.55,
  },
  stars: {
    flexDirection: "row",
    gap: 2,
    paddingTop: 2,
  },
  body: {
    color: ONBOARDING_INK,
    opacity: 0.88,
    lineHeight: 21,
    fontSize: 14,
  },
});
