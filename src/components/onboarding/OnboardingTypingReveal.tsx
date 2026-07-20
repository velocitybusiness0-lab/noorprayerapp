import React, { useEffect } from "react";
import { StyleSheet, TextStyle, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { ONBOARDING_INK } from "@/features/onboarding/OnboardingPastelPalette";
import { ThemedText } from "@/components/primitives/ThemedText";
import { useTypingReveal } from "./useTypingReveal";

type TextVariant = "title" | "display" | "body" | "bodyStrong";
type BodyRevealMode = "typing" | "fade";

interface OnboardingTypingRevealProps {
  title: string;
  body?: string;
  textColor?: string;
  mutedColor?: string;
  titleVariant?: TextVariant;
  titleStyle?: TextStyle;
  bodyStyle?: TextStyle;
  bodyReveal?: BodyRevealMode;
  onComplete?: () => void;
}

/** Faith-style quote with typing title and typing or fade-in body. */
export function OnboardingTypingReveal({
  title,
  body,
  textColor = ONBOARDING_INK,
  mutedColor = ONBOARDING_INK,
  titleVariant = "title",
  titleStyle,
  bodyStyle,
  bodyReveal = "typing",
  onComplete,
}: OnboardingTypingRevealProps) {
  const { titleText, bodyText, isComplete, showBodyFade } = useTypingReveal(
    title,
    body,
    bodyReveal
  );
  const bodyOpacity = useSharedValue(bodyReveal === "fade" ? 0 : 1);

  useEffect(() => {
    if (isComplete) onComplete?.();
  }, [isComplete, onComplete]);

  useEffect(() => {
    if (bodyReveal !== "fade" || !showBodyFade) return;
    bodyOpacity.value = withDelay(
      80,
      withTiming(1, { duration: 520, easing: Easing.out(Easing.cubic) })
    );
  }, [bodyOpacity, bodyReveal, showBodyFade]);

  const fadeBodyStyle = useAnimatedStyle(() => ({
    opacity: bodyOpacity.value,
  }));

  const showTitleCursor = titleText.length < title.length;
  const showBodyCursor =
    bodyReveal === "typing" &&
    Boolean(body) &&
    titleText.length >= title.length &&
    bodyText.length < (body?.length ?? 0);

  return (
    <View style={styles.wrap}>
      <ThemedText
        variant={titleVariant}
        style={[styles.title, { color: textColor }, titleStyle]}
      >
        {titleText}
        {showTitleCursor ? <ThemedText style={styles.cursor}>|</ThemedText> : null}
      </ThemedText>
      {body ? (
        bodyReveal === "fade" ? (
          <Animated.View style={fadeBodyStyle}>
            <ThemedText variant="body" style={[styles.body, { color: mutedColor }, bodyStyle]}>
              {body}
            </ThemedText>
          </Animated.View>
        ) : (
          <ThemedText variant="body" style={[styles.body, { color: mutedColor }, bodyStyle]}>
            {bodyText}
            {showBodyCursor ? <ThemedText style={styles.cursor}>|</ThemedText> : null}
          </ThemedText>
        )
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    minHeight: 180,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    maxWidth: 320,
    gap: 14,
  },
  title: {
    textAlign: "center",
  },
  body: {
    textAlign: "center",
    lineHeight: 24,
    minHeight: 72,
  },
  cursor: {
    opacity: 0.45,
  },
});
