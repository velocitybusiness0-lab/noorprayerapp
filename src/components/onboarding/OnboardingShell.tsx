import React, { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/core/theme";
import {
  ONBOARDING_INK,
  OnboardingPastelPalette,
} from "@/features/onboarding/OnboardingPastelPalette";
import { OnboardingPastelTone } from "@/features/onboarding/onboarding.types";
import { OnboardingProgressHeader } from "./OnboardingProgressHeader";
import { OnboardingContinueButton } from "./OnboardingContinueButton";
import { OnboardingSystemChrome } from "./OnboardingSystemChrome";

interface OnboardingShellProps {
  progress: number;
  progressOpacity?: number;
  showProgressBar?: boolean;
  showBack: boolean;
  continueLabel?: string;
  continueDisabled?: boolean;
  hideContinue?: boolean;
  keyboardAvoid?: boolean;
  pastel?: OnboardingPastelTone;
  onBack: () => void;
  onContinue: () => void;
  children: ReactNode;
}

const FOOTER_CONTENT_HEIGHT = 54 + 12;

/** Shared onboarding frame with matched safe-area colors. */
export function OnboardingShell({
  progress,
  progressOpacity = 1,
  showProgressBar = true,
  showBack,
  continueLabel,
  continueDisabled,
  hideContinue = false,
  keyboardAvoid = false,
  pastel = "default",
  onBack,
  onContinue,
  children,
}: OnboardingShellProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const pastelColors = OnboardingPastelPalette.forTone(pastel, theme.isDark);
  const trackColor = "rgba(61,56,50,0.12)";
  const footerPad = insets.bottom + theme.spacing.lg;
  const footerBlock = hideContinue ? 0 : FOOTER_CONTENT_HEIGHT + footerPad;

  const body = (
    <View style={styles.fill}>
      {showProgressBar ? (
        <OnboardingProgressHeader
          progress={progress}
          opacity={progressOpacity}
          showBack={showBack}
          onBack={onBack}
          foregroundColor={ONBOARDING_INK}
          trackColor={trackColor}
        />
      ) : showBack ? (
        <OnboardingProgressHeader
          progress={0}
          opacity={1}
          hideTrack
          showBack
          onBack={onBack}
          foregroundColor={ONBOARDING_INK}
          trackColor={trackColor}
        />
      ) : (
        <View style={{ height: theme.spacing.sm }} />
      )}

      <View
        style={[styles.content, { paddingBottom: footerBlock }]}
        pointerEvents="box-none"
      >
        {children}
      </View>

      {!hideContinue ? (
        <View
          pointerEvents="box-none"
          style={[
            styles.footer,
            {
              paddingBottom: footerPad,
              backgroundColor: pastelColors.bg,
            },
          ]}
        >
          <OnboardingContinueButton
            label={continueLabel}
            disabled={continueDisabled}
            backgroundColor={ONBOARDING_INK}
            textColor="#FFFFFF"
            onPress={onContinue}
          />
        </View>
      ) : null}
    </View>
  );

  return (
    <View style={[styles.fill, { backgroundColor: pastelColors.bg }]}>
      <View style={{ height: insets.top, backgroundColor: pastelColors.bg }} />
      <OnboardingSystemChrome pastel={pastel} />
      {keyboardAvoid ? (
        <KeyboardAvoidingView
          style={styles.fill}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={insets.top + 8}
        >
          {body}
        </KeyboardAvoidingView>
      ) : (
        body
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    overflow: "hidden",
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    zIndex: 100,
    elevation: 100,
  },
});
