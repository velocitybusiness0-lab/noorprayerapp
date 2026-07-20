import React, { useEffect, useState } from "react";
import {
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { ONBOARDING_INK } from "@/features/onboarding/OnboardingPastelPalette";
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

const FIELD = {
  backgroundColor: "rgba(0,0,0,0.06)",
  borderColor: "rgba(61,56,50,0.22)",
  color: ONBOARDING_INK,
};

/** Name + age in Reload-style boxes; Continue stays above keyboard via shell. */
export function OnboardingNameStep({
  step,
  nameValue,
  ageValue,
  onNameChange,
  onAgeChange,
}: OnboardingNameStepProps) {
  const [keyboardOpen, setKeyboardOpen] = useState(false);
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
    <Pressable style={[styles.root, layout.rootStyle(compact)]} onPress={Keyboard.dismiss}>
      <View style={[styles.stack, { gap: layout.fieldGap(compact) }]}>
        <ThemedText variant="heading" style={styles.title}>
          {step.title}
        </ThemedText>
        {step.body ? (
          <ThemedText variant="body" color="textSecondary" style={styles.body}>
            {step.body}
          </ThemedText>
        ) : null}

        <View style={[styles.fieldBlock, { marginTop: layout.inputMarginTop(compact) }]}>
          <ThemedText variant="bodyStrong" style={styles.label}>
            Name
          </ThemedText>
          <TextInput
            value={nameValue}
            onChangeText={onNameChange}
            placeholder="Enter your name"
            placeholderTextColor="rgba(61,56,50,0.45)"
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="next"
            style={[styles.input, FIELD]}
          />
        </View>

        <View style={[styles.fieldBlock, { marginTop: layout.ageLabelMarginTop(compact) }]}>
          <ThemedText variant="bodyStrong" style={styles.label}>
            Age
          </ThemedText>
          <TextInput
            value={ageValue}
            onChangeText={onAgeChange}
            placeholder="Enter your age"
            placeholderTextColor="rgba(61,56,50,0.45)"
            keyboardType="number-pad"
            maxLength={3}
            style={[styles.input, FIELD]}
          />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 4,
  },
  stack: {
    width: "100%",
    maxWidth: 340,
    alignSelf: "center",
  },
  title: {
    textAlign: "center",
    color: ONBOARDING_INK,
    fontSize: 22,
    lineHeight: 28,
  },
  body: {
    textAlign: "center",
    marginBottom: 4,
  },
  fieldBlock: {
    width: "100%",
    gap: 8,
  },
  label: {
    color: ONBOARDING_INK,
    fontSize: 15,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
});
