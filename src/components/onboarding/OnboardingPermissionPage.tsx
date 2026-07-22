import React, { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Pressable } from "react-native-gesture-handler";
import { OnboardingContinueButton } from "@/components/onboarding/OnboardingContinueButton";
import { OnboardingLightAppearance } from "@/components/onboarding/OnboardingLightAppearance";
import { ThemedText } from "@/components/primitives/ThemedText";
import {
  OnboardingPermissionCopy,
  OnboardingPermissionItemModel,
} from "@/features/onboarding/OnboardingPermissionCopy";
import {
  OnboardingPermissionKind,
  onboardingPermissionCoordinator,
} from "@/features/onboarding/OnboardingPermissionCoordinator";
import { OnboardingPersonalizedPlanTheme as Theme } from "@/features/onboarding/OnboardingPersonalizedPlanTheme";
import { OnboardingPersonalizedPlanTypography as Type } from "@/features/onboarding/OnboardingPersonalizedPlanTypography";

interface OnboardingPermissionPageProps {
  onContinue: () => void;
}

/** Combined Miraj cream permissions screen (notifications + alarms). */
export function OnboardingPermissionPage({
  onContinue,
}: OnboardingPermissionPageProps) {
  const insets = useSafeAreaInsets();
  const model = OnboardingPermissionCopy.combined();
  const [busyKind, setBusyKind] = useState<OnboardingPermissionKind | null>(
    null
  );
  const [granted, setGranted] = useState<
    Partial<Record<OnboardingPermissionKind, boolean>>
  >({});

  const handleEnable = useCallback(async (kind: OnboardingPermissionKind) => {
    if (busyKind) return;
    setBusyKind(kind);
    try {
      const ok = await onboardingPermissionCoordinator.request(kind);
      setGranted((prev) => ({ ...prev, [kind]: ok }));
    } finally {
      setBusyKind(null);
    }
  }, [busyKind]);

  const busy = busyKind !== null;

  return (
    <OnboardingLightAppearance>
      <View
        style={[
          styles.root,
          {
            paddingTop: insets.top + 40,
            paddingBottom: Math.max(insets.bottom, 16) + 12,
          },
        ]}
      >
        <View style={styles.body}>
          <View style={styles.iconRing}>
            <Ionicons
              name="notifications-outline"
              size={36}
              color={Theme.accent}
            />
          </View>
          <ThemedText variant="heading" style={styles.title}>
            {model.title}
          </ThemedText>
          <ThemedText variant="body" style={styles.copy}>
            {model.body}
          </ThemedText>

          <View style={styles.items}>
            {model.items.map((item) => (
              <PermissionItemCard
                key={item.kind}
                item={item}
                enabled={granted[item.kind] === true}
                busy={busyKind === item.kind}
                disabled={busy}
                onEnable={() => {
                  void handleEnable(item.kind);
                }}
              />
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <OnboardingContinueButton
            label={model.continueLabel}
            disabled={busy}
            onPress={onContinue}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={model.skipLabel}
            disabled={busy}
            hitSlop={10}
            onPress={onContinue}
          >
            <ThemedText variant="bodyStrong" style={styles.skip}>
              {model.skipLabel}
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </OnboardingLightAppearance>
  );
}

interface PermissionItemCardProps {
  item: OnboardingPermissionItemModel;
  enabled: boolean;
  busy: boolean;
  disabled: boolean;
  onEnable: () => void;
}

function PermissionItemCard({
  item,
  enabled,
  busy,
  disabled,
  onEnable,
}: PermissionItemCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardIcon}>
        <Ionicons name={item.icon} size={22} color={Theme.accent} />
      </View>
      <View style={styles.cardText}>
        <ThemedText variant="bodyStrong" style={styles.cardTitle}>
          {item.title}
        </ThemedText>
        <ThemedText variant="caption" style={styles.cardBody}>
          {item.body}
        </ThemedText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={item.enableLabel}
          disabled={disabled || enabled}
          hitSlop={6}
          onPress={onEnable}
          style={({ pressed }) => [
            styles.enablePill,
            {
              opacity: enabled ? 0.55 : disabled && !busy ? 0.45 : pressed ? 0.9 : 1,
            },
          ]}
        >
          <ThemedText variant="bodyStrong" style={styles.enableLabel}>
            {enabled ? "Enabled" : busy ? "Please wait…" : item.enableLabel}
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Theme.pageBackground,
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  body: {
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 4,
  },
  iconRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Theme.emblemFill,
    borderWidth: 1,
    borderColor: Theme.emblemRing,
    marginBottom: 4,
  },
  title: Type.style({
    color: Theme.ink,
    textAlign: "center",
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "700",
    letterSpacing: -0.4,
  }),
  copy: Type.style({
    color: Theme.muted,
    textAlign: "center",
    fontSize: 17,
    lineHeight: 26,
  }),
  items: {
    width: "100%",
    gap: 12,
    marginTop: 8,
  },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    padding: 16,
    borderRadius: 18,
    backgroundColor: Theme.emblemFill,
    borderWidth: 1,
    borderColor: Theme.emblemRing,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Theme.pageBackground,
  },
  cardText: {
    flex: 1,
    gap: 6,
  },
  cardTitle: Type.style({
    color: Theme.ink,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.2,
  }),
  cardBody: Type.style({
    color: Theme.muted,
    fontSize: 14,
    lineHeight: 20,
  }),
  enablePill: {
    alignSelf: "flex-start",
    marginTop: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: Theme.accent,
  },
  enableLabel: Type.style({
    color: Theme.onCheckFill,
    fontSize: 14,
    fontWeight: "700",
  }),
  footer: {
    gap: 16,
    alignItems: "center",
  },
  skip: Type.style({
    color: Theme.softMuted,
    fontSize: 15,
    fontWeight: "600",
  }),
});
