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

/** Sign-your-commitment beat — signature stays in memory only. */
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
    alignItems: "center",
    paddingHorizontal: 8,
    paddingTop: 10,
    paddingBottom: 12,
  },
  brand: {
    color: ONBOARDING_INK,
    marginBottom: 12,
    letterSpacing: 0.4,
  },
  title: {
    color: ONBOARDING_INK,
    textAlign: "center",
    marginBottom: 10,
  },
  body: {
    color: ONBOARDING_INK,
    textAlign: "center",
    opacity: 0.78,
    lineHeight: 20,
    maxWidth: 300,
    marginBottom: 18,
  },
  padBlock: {
    width: "100%",
    height: 168,
    marginBottom: 12,
  },
  hint: {
    color: ONBOARDING_INK,
    opacity: 0.55,
    textAlign: "center",
    marginBottom: 14,
  },
  ctaWrap: {
    width: "100%",
  },
});
