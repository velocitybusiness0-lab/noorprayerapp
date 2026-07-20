import React from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { OnboardingPersonalizedPlanTheme as Theme } from "@/features/onboarding/OnboardingPersonalizedPlanTheme";

export type PersonalizedPlanGraphicKind =
  | "helps"
  | "protect"
  | "habits"
  | "motivation";

interface OnboardingPersonalizedPlanGraphicProps {
  kind: PersonalizedPlanGraphicKind;
}

/** Small thematic emblems for each major plan section. */
export function OnboardingPersonalizedPlanGraphic({
  kind,
}: OnboardingPersonalizedPlanGraphicProps) {
  if (kind === "helps") return <HelpsEmblem />;
  if (kind === "protect") return <ProtectEmblem />;
  if (kind === "habits") return <HabitsEmblem />;
  return <MotivationEmblem />;
}

function HelpsEmblem() {
  return (
    <View style={styles.canvas}>
      <View style={[styles.halo, { backgroundColor: Theme.skyWash }]}>
        <Ionicons name="compass" size={36} color={Theme.accent} />
      </View>
      <View style={styles.badgeRow}>
        <View style={styles.miniBadge}>
          <Ionicons name="alarm" size={16} color={Theme.accent} />
        </View>
        <View style={styles.miniBadge}>
          <Ionicons name="book" size={16} color={Theme.accent} />
        </View>
        <View style={styles.miniBadge}>
          <Ionicons name="notifications" size={16} color={Theme.accent} />
        </View>
      </View>
    </View>
  );
}

function ProtectEmblem() {
  return (
    <View style={styles.canvas}>
      <View style={[styles.halo, { backgroundColor: Theme.sandWash }]}>
        <Ionicons name="shield-checkmark" size={36} color={Theme.accent} />
      </View>
      <View style={styles.badgeRow}>
        <View style={styles.miniBadge}>
          <Ionicons name="heart" size={15} color={Theme.accent} />
        </View>
        <View style={styles.miniBadge}>
          <Ionicons name="sparkles" size={15} color={Theme.star} />
        </View>
      </View>
    </View>
  );
}

function HabitsEmblem() {
  return (
    <View style={styles.canvas}>
      <View style={[styles.halo, { backgroundColor: Theme.emblemFill }]}>
        <Ionicons name="sunny" size={36} color={Theme.accent} />
      </View>
    </View>
  );
}

function MotivationEmblem() {
  return (
    <View style={styles.canvas}>
      <View style={[styles.halo, { backgroundColor: Theme.lavenderWash }]}>
        <Ionicons name="hand-left" size={34} color={Theme.accent} />
      </View>
      <View style={styles.starRow}>
        {[0, 1, 2, 3, 4].map((index) => (
          <Ionicons key={index} name="star" size={11} color={Theme.star} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: {
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 4,
  },
  starRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  halo: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Theme.emblemRing,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 8,
  },
  miniBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Theme.cardSurface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Theme.chipBorder,
  },
});
