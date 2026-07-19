import React, { useEffect } from "react";
import { StyleSheet, TextStyle, View } from "react-native";
import { ONBOARDING_INK } from "@/features/onboarding/OnboardingPastelPalette";
import { ThemedText } from "@/components/primitives/ThemedText";
import { useTypingReveal } from "./useTypingReveal";

type TextVariant = "title" | "display" | "body" | "bodyStrong";

interface OnboardingTypingRevealProps {
  title: string;
  body?: string;
  textColor?: string;
  mutedColor?: string;
  titleVariant?: TextVariant;
  titleStyle?: TextStyle;
  bodyStyle?: TextStyle;
  onComplete?: () => void;
}

/** Faith-style quote with a typing reveal and haptic feedback. */
export function OnboardingTypingReveal({
  title,
  body,
  textColor = ONBOARDING_INK,
  mutedColor = ONBOARDING_INK,
  titleVariant = "title",
  titleStyle,
  bodyStyle,
  onComplete,
}: OnboardingTypingRevealProps) {
  const { titleText, bodyText, isComplete } = useTypingReveal(title, body);

  useEffect(() => {
    if (isComplete) onComplete?.();
  }, [isComplete, onComplete]);

  const showTitleCursor = titleText.length < title.length;
  const showBodyCursor =
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
        <ThemedText variant="body" style={[styles.body, { color: mutedColor }, bodyStyle]}>
          {bodyText}
          {showBodyCursor ? <ThemedText style={styles.cursor}>|</ThemedText> : null}
        </ThemedText>
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
