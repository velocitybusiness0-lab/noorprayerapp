import React, { useEffect, useState } from "react";
import {
  Keyboard,
  Platform,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { useTheme } from "@/core/theme";
import { ThemedText } from "@/components/primitives/ThemedText";
import { OnboardingNameKeyboardLayoutPolicy } from "@/features/onboarding/OnboardingNameKeyboardLayoutPolicy";
import { OnboardingStep } from "@/features/onboarding/onboarding.types";

interface OnboardingNameStepProps {
  step: OnboardingStep;
  nameValue: string;
  ageValue: string;
  onNameChange: (value: string) => void;
  onAgeChange: (value: string) => void;
}

/** Name + age inputs; top-aligns while keyboard is open so both fields stay visible. */
export function OnboardingNameStep({
  step,
  nameValue,
  ageValue,
  onNameChange,
  onAgeChange,
}: OnboardingNameStepProps) {
  const theme = useTheme();
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const inputColors = {
    color: theme.colors.textPrimary,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  };
  const compact = keyboardOpen;
  const layout = OnboardingNameKeyboardLayoutPolicy;

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const showSub = Keyboard.addListener(showEvent, () => setKeyboardOpen(true));
    const hideSub = Keyboard.addListener(hideEvent, () => setKeyboardOpen(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <View style={[styles.root, layout.rootStyle(compact)]}>
      <View style={[styles.center, { gap: layout.fieldGap(compact) }]}>
        <ThemedText variant="heading" style={styles.title}>
          {step.title}
        </ThemedText>
        {step.body ? (
          <ThemedText variant="body" color="textSecondary" style={styles.body}>
            {step.body}
          </ThemedText>
        ) : null}

        <TextInput
          value={nameValue}
          onChangeText={onNameChange}
          placeholder="Your name"
          placeholderTextColor={theme.colors.textTertiary}
          autoFocus
          autoCapitalize="words"
          autoCorrect={false}
          onFocus={() => setKeyboardOpen(true)}
          style={[
            styles.input,
            inputColors,
            { marginTop: layout.inputMarginTop(compact) },
          ]}
        />

        <ThemedText
          variant="bodyStrong"
          style={[
            styles.ageLabel,
            { marginTop: layout.ageLabelMarginTop(compact) },
          ]}
        >
          Age
        </ThemedText>
        <TextInput
          value={ageValue}
          onChangeText={onAgeChange}
          placeholder="Your age"
          placeholderTextColor={theme.colors.textTertiary}
          keyboardType="number-pad"
          maxLength={3}
          onFocus={() => setKeyboardOpen(true)}
          style={[styles.input, styles.ageInput, inputColors]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 24,
  },
  center: {
    width: "100%",
    maxWidth: 320,
    alignItems: "center",
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
  },
  ageLabel: {
    alignSelf: "stretch",
    textAlign: "center",
  },
  ageInput: {
    marginTop: 0,
  },
});
