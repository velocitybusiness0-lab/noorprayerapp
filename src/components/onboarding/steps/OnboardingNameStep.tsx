import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { useTheme } from "@/core/theme";
import { ThemedText } from "@/components/primitives/ThemedText";
import { OnboardingStep } from "@/features/onboarding/onboarding.types";

interface OnboardingNameStepProps {
  step: OnboardingStep;
  value: string;
  onChange: (value: string) => void;
}

/** Centered name input; continue appears while typing (handled by parent). */
export function OnboardingNameStep({ step, value, onChange }: OnboardingNameStepProps) {
  const theme = useTheme();

  return (
    <View style={styles.wrap}>
      <View style={styles.center}>
        <ThemedText variant="heading" style={styles.title}>
          {step.title}
        </ThemedText>
        {step.body ? (
          <ThemedText variant="body" color="textSecondary" style={styles.body}>
            {step.body}
          </ThemedText>
        ) : null}

        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder="Your name"
          placeholderTextColor={theme.colors.textTertiary}
          autoFocus
          autoCapitalize="words"
          autoCorrect={false}
          style={[
            styles.input,
            {
              color: theme.colors.textPrimary,
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.surface,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  center: {
    width: "100%",
    maxWidth: 320,
    alignItems: "center",
    gap: 12,
  },
  title: {
    textAlign: "center",
  },
  body: {
    textAlign: "center",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 18,
    textAlign: "center",
    marginTop: 16,
  },
});
