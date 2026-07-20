import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/primitives/ThemedText";
import { OnboardingPersonalizedPlanLegalLinkOpener as Opener } from "@/features/onboarding/OnboardingPersonalizedPlanLegalLinkOpener";
import { OnboardingPersonalizedPlanTheme as Theme } from "@/features/onboarding/OnboardingPersonalizedPlanTheme";
import { OnboardingPersonalizedPlanTypography as Type } from "@/features/onboarding/OnboardingPersonalizedPlanTypography";

interface OnboardingPersonalizedPlanLegalLinksProps {
  termsLabel: string;
  privacyLabel: string;
  restoreLabel: string;
}

/** Terms · Privacy · Restore footer links. */
export function OnboardingPersonalizedPlanLegalLinks({
  termsLabel,
  privacyLabel,
  restoreLabel,
}: OnboardingPersonalizedPlanLegalLinksProps) {
  return (
    <View style={styles.row}>
      <Link label={termsLabel} onPress={() => Opener.openTerms()} />
      <ThemedText variant="caption" style={styles.dot}>
        ·
      </ThemedText>
      <Link label={privacyLabel} onPress={() => Opener.openPrivacy()} />
      <ThemedText variant="caption" style={styles.dot}>
        ·
      </ThemedText>
      <Link label={restoreLabel} onPress={() => Opener.restorePurchases()} />
    </View>
  );
}

function Link({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="link" onPress={onPress} hitSlop={8}>
      <ThemedText variant="caption" style={styles.link}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  link: Type.style({
    color: Theme.softMuted,
    fontSize: 13,
    letterSpacing: 0.1,
  }),
  dot: Type.style({
    color: Theme.softMuted,
    fontSize: 13,
  }),
});
