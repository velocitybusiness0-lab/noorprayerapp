import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { Easing, FadeInDown } from "react-native-reanimated";
import { useTheme } from "@/core/theme";
import { haptics } from "@/core/haptics/HapticsManager";
import { ONBOARDING_INK } from "@/features/onboarding/OnboardingPastelPalette";
import { ThemedText } from "@/components/primitives/ThemedText";
import { OnboardingStep } from "@/features/onboarding/onboarding.types";

interface OnboardingComparisonStepProps {
  step: OnboardingStep;
  onAnimationComplete?: () => void;
}

const CARD_DELAY_MS = 780;
const CARD_DURATION_MS = 650;

/** Future self comparison cards revealed one at a time with smooth motion. */
export function OnboardingComparisonStep({
  step,
  onAnimationComplete,
}: OnboardingComparisonStepProps) {
  const theme = useTheme();
  const rows = step.comparisonRows ?? [];
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    setVisibleCount(0);
    if (rows.length === 0) {
      onAnimationComplete?.();
      return;
    }

    let index = 0;
    const timer = setInterval(() => {
      index += 1;
      setVisibleCount(index);
      haptics.impact();
      if (index >= rows.length) clearInterval(timer);
    }, CARD_DELAY_MS);

    const done = setTimeout(
      () => onAnimationComplete?.(),
      rows.length * CARD_DELAY_MS + CARD_DURATION_MS
    );

    return () => {
      clearInterval(timer);
      clearTimeout(done);
    };
  }, [onAnimationComplete, rows.length, step.id]);

  return (
    <View style={styles.wrap}>
      <ThemedText variant="heading" style={styles.title}>
        {step.title}
      </ThemedText>

      <View style={styles.center}>
        {rows.slice(0, visibleCount).map((row, index) => (
          <Animated.View
            key={row.positive}
            entering={FadeInDown.duration(CARD_DURATION_MS)
              .delay(index * 40)
              .easing(Easing.out(Easing.cubic))}
            style={[
              styles.card,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <ThemedText variant="bodyStrong" style={styles.positive}>
              ✓ {row.positive}
            </ThemedText>
            <ThemedText variant="caption" style={styles.negative}>
              ✗ {row.negative}
            </ThemedText>
          </Animated.View>
        ))}
      </View>

      {step.footer && visibleCount >= rows.length ? (
        <Animated.View entering={FadeInDown.duration(420)}>
          <ThemedText variant="caption" style={styles.footer}>
            {step.footer}
          </ThemedText>
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  title: {
    color: ONBOARDING_INK,
    textAlign: "center",
    marginBottom: 28,
  },
  center: {
    width: "100%",
    gap: 14,
    alignItems: "center",
  },
  card: {
    width: "100%",
    maxWidth: 320,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 18,
    padding: 18,
    gap: 8,
    alignItems: "center",
  },
  positive: { color: "#16A34A", textAlign: "center" },
  negative: { color: ONBOARDING_INK, opacity: 0.55, textAlign: "center" },
  footer: {
    color: ONBOARDING_INK,
    opacity: 0.7,
    textAlign: "center",
    marginTop: 24,
    maxWidth: 280,
  },
});
