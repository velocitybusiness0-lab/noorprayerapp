import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "@/components/primitives/ThemedText";
import { OnboardingHoldToLockInButton } from "@/components/onboarding/OnboardingHoldToLockInButton";
import { OnboardingSignaturePad } from "@/components/onboarding/OnboardingSignaturePad";
import { useTheme } from "@/core/theme";
import { ONBOARDING_INK } from "@/features/onboarding/OnboardingPastelPalette";
import { OnboardingStep } from "@/features/onboarding/onboarding.types";

/** Darker pastel sage so hold progress reads clearly on the sand track. */
const HOLD_FILL = "#8FCBB0";

interface OnboardingCommitmentStepProps {
  step: OnboardingStep;
  onLockIn: () => void;
}

/** Sign-your-commitment beat — expanded heading, hold CTA pinned above safe area. */
export function OnboardingCommitmentStep({
  step,
  onLockIn,
}: OnboardingCommitmentStepProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [hasSignature, setHasSignature] = useState(false);

  return (
    <View style={styles.wrap}>
      <View style={styles.center}>
        <ThemedText variant="display" style={styles.title}>
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
      </View>

      <View style={[styles.ctaWrap, { paddingBottom: Math.max(insets.bottom, 8) }]}>
        <OnboardingHoldToLockInButton
          label={step.continueLabel ?? "Hold to Lock In"}
          enabled={hasSignature}
          fillColor={HOLD_FILL}
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
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    // Bias block slightly upward so the signature plane sits nearer mid-screen.
    paddingBottom: 56,
    gap: 12,
  },
  title: {
    color: ONBOARDING_INK,
    textAlign: "center",
    fontSize: 28,
    lineHeight: 34,
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
    height: 180,
    marginTop: 12,
  },
  ctaWrap: {
    width: "100%",
    paddingTop: 12,
  },
});
