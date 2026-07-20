import React from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/primitives/ThemedText";
import { ONBOARDING_INK } from "@/features/onboarding/OnboardingPastelPalette";
import { OnboardingRatingReview } from "@/features/onboarding/catalog/OnboardingRatingCatalog";

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
      <View style={styles.header}>
        <View style={styles.avatar}>
          <ThemedText variant="bodyStrong" style={styles.avatarText}>
            {review.initials}
          </ThemedText>
        </View>
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
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: 16,
    padding: 16,
    gap: 12,
    backgroundColor: "rgba(61,56,50,0.06)",
    borderWidth: 1,
    borderColor: "rgba(61,56,50,0.1)",
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(107,158,136,0.28)",
  },
  avatarText: {
    color: ONBOARDING_INK,
    fontSize: 14,
  },
  meta: {
    flex: 1,
    gap: 2,
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
