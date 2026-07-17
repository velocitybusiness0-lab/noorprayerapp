import React from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { OnboardingSlideGraphicType } from "@/features/onboarding/onboarding.types";

interface OnboardingSlideGraphicProps {
  type: OnboardingSlideGraphicType;
}

/** Large monochrome illustrations for urgency and hope slides. */
export function OnboardingSlideGraphic({ type }: OnboardingSlideGraphicProps) {
  if (type === "domino") return <DominoGraphic />;
  if (type === "hourglass") return <HourglassGraphic />;
  return <SummitGraphic />;
}

function DominoGraphic() {
  return (
    <View style={styles.canvas}>
      {[0, 1, 2, 3].map((index) => (
        <View
          key={index}
          style={[
            styles.domino,
            {
              left: 28 + index * 42,
              transform: [{ rotate: `${18 + index * 14}deg` }],
              opacity: 1 - index * 0.08,
            },
          ]}
        />
      ))}
      <Ionicons name="arrow-down" size={54} color="#FFFFFF" style={styles.dominoArrow} />
    </View>
  );
}

function HourglassGraphic() {
  return (
    <View style={styles.canvas}>
      <View style={styles.hourglassTop} />
      <View style={styles.hourglassNeck} />
      <View style={styles.hourglassBottom} />
      <View style={styles.sandTop} />
      <View style={styles.sandStream} />
      <View style={styles.sandBottom} />
      <Ionicons name="time-outline" size={36} color="#FFFFFF" style={styles.hourglassIcon} />
    </View>
  );
}

function SummitGraphic() {
  return (
    <View style={styles.canvas}>
      <View style={styles.mountainBack} />
      <View style={styles.mountainFront} />
      <View style={styles.flagPole} />
      <Ionicons name="flag" size={52} color="#FFFFFF" style={styles.flag} />
      <Ionicons name="person" size={54} color="#FFFFFF" style={styles.climber} />
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: {
    width: 230,
    height: 190,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  domino: {
    position: "absolute",
    bottom: 28,
    width: 28,
    height: 88,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
  },
  dominoArrow: {
    position: "absolute",
    right: 18,
    top: 18,
    opacity: 0.9,
  },
  hourglassTop: {
    position: "absolute",
    top: 18,
    width: 96,
    height: 58,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderWidth: 8,
    borderColor: "#FFFFFF",
    borderBottomWidth: 0,
  },
  hourglassNeck: {
    position: "absolute",
    top: 74,
    width: 18,
    height: 24,
    backgroundColor: "#FFFFFF",
  },
  hourglassBottom: {
    position: "absolute",
    bottom: 18,
    width: 96,
    height: 58,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderWidth: 8,
    borderColor: "#FFFFFF",
    borderTopWidth: 0,
  },
  sandTop: {
    position: "absolute",
    top: 30,
    width: 72,
    height: 28,
    backgroundColor: "rgba(255,255,255,0.55)",
    borderRadius: 4,
  },
  sandStream: {
    position: "absolute",
    top: 78,
    width: 6,
    height: 28,
    backgroundColor: "rgba(255,255,255,0.75)",
    borderRadius: 3,
  },
  sandBottom: {
    position: "absolute",
    bottom: 28,
    width: 72,
    height: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
  },
  hourglassIcon: {
    position: "absolute",
    right: 24,
    bottom: 24,
    opacity: 0.85,
  },
  mountainBack: {
    position: "absolute",
    bottom: 10,
    left: 16,
    width: 0,
    height: 0,
    borderLeftWidth: 86,
    borderRightWidth: 86,
    borderBottomWidth: 132,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "rgba(255,255,255,0.48)",
  },
  mountainFront: {
    position: "absolute",
    bottom: 10,
    right: 8,
    width: 0,
    height: 0,
    borderLeftWidth: 68,
    borderRightWidth: 68,
    borderBottomWidth: 104,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#FFFFFF",
  },
  flagPole: {
    position: "absolute",
    right: 72,
    top: 10,
    width: 7,
    height: 90,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
  },
  flag: { position: "absolute", right: 23, top: 1 },
  climber: { position: "absolute", left: 84, bottom: 34 },
});
