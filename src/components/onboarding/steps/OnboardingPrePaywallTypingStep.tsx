import React, { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { ONBOARDING_INK } from "@/features/onboarding/OnboardingPastelPalette";
import { OnboardingPrePaywallTypingSequence } from "@/features/onboarding/OnboardingPrePaywallTypingSequence";
import { OnboardingTypewriter } from "@/features/onboarding/OnboardingTypewriter";
import { OnboardingAnswers, OnboardingStep } from "@/features/onboarding/onboarding.types";
import { ThemedText } from "@/components/primitives/ThemedText";

interface OnboardingPrePaywallTypingStepProps {
  step: OnboardingStep;
  answers: OnboardingAnswers;
  onComplete: () => void;
}

type Phase = "opening" | "invest" | "final" | "done";

/** Sequential typing lines before the personalized plan — Reload prepaywall pattern. */
export function OnboardingPrePaywallTypingStep({
  answers,
  onComplete,
}: OnboardingPrePaywallTypingStepProps) {
  const lines = useMemo(
    () => OnboardingPrePaywallTypingSequence.linesFor(answers),
    [answers]
  );
  const [phase, setPhase] = useState<Phase>("opening");
  const [openingLine, setOpeningLine] = useState(0);
  const [openingText, setOpeningText] = useState("");
  const [secondOpeningText, setSecondOpeningText] = useState("");
  const [investText, setInvestText] = useState("");
  const [finalText, setFinalText] = useState("");
  const onCompleteRef = useRef(onComplete);
  const typewriterRef = useRef(new OnboardingTypewriter({ charMs: 36, pauseBetweenLinesMs: 0 }));

  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  useEffect(() => {
    const writer = typewriterRef.current;
    writer.cancel();
    setPhase("opening");
    setOpeningLine(0);
    setOpeningText("");
    setSecondOpeningText("");
    setInvestText("");
    setFinalText("");

    let cancelled = false;

    const run = async () => {
      const [greeting, successClose, invest, finalReview] = lines;
      if (!greeting || !successClose || !invest || !finalReview) return;

      await writer.run(greeting.text, undefined, {
        onTitleProgress: setOpeningText,
        onBodyProgress: () => {},
        onComplete: () => {},
      });
      if (cancelled) return;

      await wait(OnboardingPrePaywallTypingSequence.pauseBeforeSecondOpeningLineMs);
      if (cancelled) return;

      setOpeningLine(1);
      await writer.run(successClose.text, undefined, {
        onTitleProgress: setSecondOpeningText,
        onBodyProgress: () => {},
        onComplete: () => {},
      });
      if (cancelled) return;

      await wait(OnboardingPrePaywallTypingSequence.dwellAfterBlockMs);
      if (cancelled) return;

      setPhase("invest");
      setOpeningText("");
      setSecondOpeningText("");
      await wait(OnboardingPrePaywallTypingSequence.gapBetweenBlocksMs);
      if (cancelled) return;

      await writer.run(invest.text, undefined, {
        onTitleProgress: setInvestText,
        onBodyProgress: () => {},
        onComplete: () => {},
      });
      if (cancelled) return;

      await wait(OnboardingPrePaywallTypingSequence.dwellAfterBlockMs);
      if (cancelled) return;

      setPhase("final");
      setInvestText("");
      await wait(OnboardingPrePaywallTypingSequence.gapBetweenBlocksMs);
      if (cancelled) return;

      await writer.run(finalReview.text, undefined, {
        onTitleProgress: setFinalText,
        onBodyProgress: () => {},
        onComplete: () => {},
      });
      if (cancelled) return;

      await wait(500);
      if (cancelled) return;

      setPhase("done");
      onCompleteRef.current();
    };

    void run();

    return () => {
      cancelled = true;
      writer.cancel();
    };
  }, [lines]);

  return (
    <View style={styles.wrap}>
      <View style={styles.topSpacer} />
      <View style={styles.textBlock}>
        {phase === "opening" ? (
          <Animated.View entering={FadeIn.duration(300)} exiting={FadeOut.duration(300)}>
            <TypingLine text={openingLine === 0 ? openingText : secondOpeningText} />
          </Animated.View>
        ) : null}
        {phase === "invest" ? (
          <Animated.View entering={FadeIn.duration(300)} exiting={FadeOut.duration(300)}>
            <TypingLine text={investText} />
          </Animated.View>
        ) : null}
        {phase === "final" || phase === "done" ? (
          <Animated.View entering={FadeIn.duration(300)} exiting={FadeOut.duration(300)}>
            <TypingLine text={finalText} />
          </Animated.View>
        ) : null}
      </View>
      <View style={styles.midSpacer} />
      <View style={styles.loaderWrap}>
        <ActivityIndicator size="large" color={ONBOARDING_INK} />
      </View>
    </View>
  );
}

function TypingLine({ text }: { text: string }) {
  return (
    <ThemedText variant="heading" style={styles.line}>
      {text}
    </ThemedText>
  );
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 32,
  },
  // Flex bias places typing in the top third (Reload middle-but-higher).
  topSpacer: {
    flex: 0.28,
  },
  textBlock: {
    width: "100%",
    minHeight: 120,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  midSpacer: {
    flex: 1,
  },
  line: {
    color: ONBOARDING_INK,
    textAlign: "center",
    fontSize: 24,
    lineHeight: 32,
  },
  loaderWrap: {
    alignItems: "center",
    paddingBottom: 80,
  },
});
