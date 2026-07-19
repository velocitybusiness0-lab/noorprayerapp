import React from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn, ZoomIn } from "react-native-reanimated";
import { OnboardingTypingReveal } from "../OnboardingTypingReveal";
import { OnboardingStep } from "@/features/onboarding/onboarding.types";

interface OnboardingHopeScreenStepProps {
  step: OnboardingStep;
  onTypingComplete?: () => void;
}

/** Green hope screen with typing reveal and a soft success animation. */
export function OnboardingHopeScreenStep({
  step,
  onTypingComplete,
}: OnboardingHopeScreenStepProps) {
  return (
    <View style={styles.wrap}>
      <Animated.View entering={ZoomIn.duration(500).delay(80)} style={styles.iconWrap}>
        <Ionicons name="leaf" size={36} color="#16A34A" />
      </Animated.View>

      <OnboardingTypingReveal
        title={step.title ?? ""}
        body={step.body}
        titleVariant="display"
        titleStyle={styles.title}
        bodyStyle={styles.body}
        onComplete={onTypingComplete}
      />

      <Animated.View entering={FadeIn.duration(600).delay(1200)} style={styles.badge}>
        <Ionicons name="checkmark-circle" size={22} color="#16A34A" />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
    gap: 12,
  },
  iconWrap: {
    marginBottom: 4,
  },
  title: {
    textTransform: "uppercase",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  body: {
    lineHeight: 28,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  badge: {
    marginTop: 8,
  },
});
