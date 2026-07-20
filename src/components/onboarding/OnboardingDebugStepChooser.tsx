import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "@/components/primitives/ThemedText";
import { ONBOARDING_INK } from "@/features/onboarding/OnboardingPastelPalette";
import { OnboardingStepCatalog } from "@/features/onboarding/OnboardingStepCatalog";

interface OnboardingDebugStepChooserProps {
  currentIndex: number;
  onJumpToIndex: (index: number) => void;
}

/** Floating debug control to jump to any onboarding step. */
export function OnboardingDebugStepChooser({
  currentIndex,
  onJumpToIndex,
}: OnboardingDebugStepChooserProps) {
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const steps = OnboardingStepCatalog.steps;

  if (!__DEV__) return null;

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Debug onboarding steps"
        hitSlop={12}
        onPress={() => setOpen(true)}
        style={[styles.fab, { bottom: insets.bottom + 88 }]}
      >
        <ThemedText variant="caption" style={styles.fabLabel}>
          DBG
        </ThemedText>
      </Pressable>

      <Modal visible={open} animationType="slide" transparent onRequestClose={() => setOpen(false)}>
        <View style={styles.backdrop}>
          <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
            <View style={styles.sheetHeader}>
              <ThemedText variant="heading" style={styles.sheetTitle}>
                Onboarding steps
              </ThemedText>
              <Pressable onPress={() => setOpen(false)} hitSlop={8}>
                <ThemedText variant="bodyStrong" style={styles.done}>
                  Done
                </ThemedText>
              </Pressable>
            </View>

            <ThemedText variant="caption" style={styles.meta}>
              Step {currentIndex} of {steps.length - 1}
            </ThemedText>

            <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
              {steps.map((entry, index) => {
                const active = index === currentIndex;
                return (
                  <Pressable
                    key={entry.id}
                    onPress={() => {
                      onJumpToIndex(index);
                      setOpen(false);
                    }}
                    style={[styles.row, active && styles.rowActive]}
                  >
                    <ThemedText variant="caption" style={styles.rowIndex}>
                      {index}
                    </ThemedText>
                    <View style={styles.rowText}>
                      <ThemedText variant="bodyStrong" style={styles.rowId}>
                        {entry.id}
                      </ThemedText>
                      <ThemedText variant="caption" style={styles.rowType}>
                        {entry.type}
                        {entry.title ? ` · ${entry.title}` : ""}
                      </ThemedText>
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    left: 16,
    zIndex: 30,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  fabLabel: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 11,
  },
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  sheet: {
    maxHeight: "72%",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  sheetTitle: {
    color: ONBOARDING_INK,
  },
  done: {
    color: ONBOARDING_INK,
  },
  meta: {
    color: ONBOARDING_INK,
    opacity: 0.6,
    marginBottom: 12,
  },
  list: {
    flexGrow: 0,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 6,
    backgroundColor: "rgba(0,0,0,0.04)",
  },
  rowActive: {
    backgroundColor: "rgba(0,0,0,0.09)",
  },
  rowIndex: {
    width: 28,
    color: ONBOARDING_INK,
    opacity: 0.55,
    fontVariant: ["tabular-nums"],
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  rowId: {
    color: ONBOARDING_INK,
  },
  rowType: {
    color: ONBOARDING_INK,
    opacity: 0.65,
  },
});
