import React from "react";
import { Image, ImageSourcePropType, StyleSheet, View } from "react-native";

interface OnboardingRatingReviewAvatarProps {
  avatarSource: ImageSourcePropType;
  accessibilityLabel: string;
}

const AVATAR_SIZE = 48;

/** Circular PNG avatar for a rating-step testimonial. */
export function OnboardingRatingReviewAvatar({
  avatarSource,
  accessibilityLabel,
}: OnboardingRatingReviewAvatarProps) {
  return (
    <View style={styles.frame} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Image
        source={avatarSource}
        style={styles.avatar}
        accessibilityLabel={accessibilityLabel}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    minWidth: AVATAR_SIZE,
    minHeight: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    overflow: "hidden",
    flexShrink: 0,
    alignSelf: "flex-start",
    borderWidth: 1.5,
    borderColor: "rgba(61,56,50,0.18)",
    backgroundColor: "rgba(61,56,50,0.08)",
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
  },
});
