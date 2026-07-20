import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/primitives/ThemedText";
import { OnboardingHoldToLockInButton } from "@/components/onboarding/OnboardingHoldToLockInButton";
import { OnboardingSignaturePad } from "@/components/onboarding/OnboardingSignaturePad";
import { useTheme } from "@/core/theme";
import { ONBOARDING_INK } from "@/features/onboarding/OnboardingPastelPalette";
import { OnboardingStep } from "@/features/onboarding/onboarding.types";

interface OnboardingCommitmentStepProps {
  step: OnboardingStep;
  onLockIn: () => void;
}

/** Sign-your-commitment beat — brand at top, body centered, hold CTA at bottom. */
export function OnboardingCommitmentStep({
  step,
  onLockIn,
}: OnboardingCommitmentStepProps) {
  const theme = useTheme();
  const [hasSignature, setHasSignature] = useState(false);

  return (
    <View style={styles.wrap}>
      {step.brandLabel ? (
        <ThemedText variant="title" style={styles.brand}>
          {step.brandLabel}
        </ThemedText>
      ) : null}

      <View style={styles.center}>
        <ThemedText variant="heading" style={styles.title}>
          {step.title}
        </ThemedText>

        {step.body ? (
          <ThemedText variant="body" style={styles.body}>
            {step.body}
          </ThemedText>
        ) : null}

        <View style={styles.padBlock}>
          <OnboardingSignaturePad onSignatureChange={setHasSignature} />
        </View>

        <ThemedText variant="caption" style={styles.hint}>
          Sign above · not saved
        </ThemedText>
      </View>

      <View style={styles.ctaWrap}>
        <OnboardingHoldToLockInButton
          label={step.continueLabel ?? "Hold to Lock In"}
          enabled={hasSignature}
          fillColor={theme.colors.sageMuted}
          trackColor={theme.colors.sand}
          textColor={ONBOARDING_INK}
          onComplete={onLockIn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  brand: {
    color: ONBOARDING_INK,
    textAlign: "center",
    letterSpacing: 0.4,
    fontSize: 22,
    lineHeight: 28,
    marginBottom: 8,
    marginTop: 4,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    gap: 10,
  },
  title: {
    color: ONBOARDING_INK,
    textAlign: "center",
    fontSize: 22,
    lineHeight: 28,
  },
  body: {
    color: ONBOARDING_INK,
    textAlign: "center",
    opacity: 0.78,
    lineHeight: 20,
    maxWidth: 300,
  },
  padBlock: {
    width: "100%",
    height: 168,
    marginTop: 8,
  },
  hint: {
    color: ONBOARDING_INK,
    opacity: 0.55,
    textAlign: "center",
  },
  ctaWrap: {
    width: "100%",
    paddingTop: 8,
  },
});
