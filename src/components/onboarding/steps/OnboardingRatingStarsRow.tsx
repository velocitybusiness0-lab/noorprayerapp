import React from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { OnboardingRatingLaurel } from "./OnboardingRatingLaurel";

const STAR_GOLD = "#E8B84A";
const STAR_COUNT = 5;
const STAR_SIZE = 28;
/** Laurel image height; width follows asset aspect (tall/narrow). */
const LAUREL_SIZE = 44;

/**
 * Classic App Store rating badge: laurel | ★★★★★ | laurel.
 */
export function OnboardingRatingStarsRow() {
  return (
    <View style={styles.row} accessibilityRole="image" accessibilityLabel="5 star rating">
      <OnboardingRatingLaurel side="leading" size={LAUREL_SIZE} />
      <View style={styles.stars}>
        {Array.from({ length: STAR_COUNT }, (_, index) => (
          <Ionicons key={index} name="star" size={STAR_SIZE} color={STAR_GOLD} />
        ))}
      </View>
      <OnboardingRatingLaurel side="trailing" size={LAUREL_SIZE} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stars: {
    flexDirection: "row",
    gap: 4,
  },
});
