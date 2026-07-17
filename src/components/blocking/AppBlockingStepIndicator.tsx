import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "@/core/theme";
import { ThemedText } from "@/components/primitives/ThemedText";
import { AppBlockingSetupPhase } from "./AppBlockingSetupPhaseResolver";

const STEPS = ["Allow", "Apps", "On"] as const;

interface AppBlockingStepIndicatorProps {
  phase: AppBlockingSetupPhase;
  stepIndex: number;
}

/** Three-dot setup progress for the blocking flow. */
export function AppBlockingStepIndicator({ phase, stepIndex }: AppBlockingStepIndicatorProps) {
  const theme = useTheme();

  if (phase === "active") return null;

  return (
    <View style={styles.wrap}>
      <View style={styles.track}>
        {STEPS.map((label, index) => {
          const done = index < stepIndex;
          const current = index === stepIndex;
          return (
            <React.Fragment key={label}>
              {index > 0 ? (
                <View
                  style={[
                    styles.line,
                    {
                      backgroundColor: done ? theme.colors.accent : theme.colors.hairline,
                    },
                  ]}
                />
              ) : null}
              <View style={styles.step}>
                <View
                  style={[
                    styles.dot,
                    {
                      backgroundColor: done || current ? theme.colors.accent : theme.colors.backgroundElevated,
                      borderColor: current ? theme.colors.accent : theme.colors.hairline,
                      transform: [{ scale: current ? 1.15 : 1 }],
                    },
                  ]}
                />
                <ThemedText
                  variant="caption"
                  color={current ? "accent" : done ? "textSecondary" : "textTertiary"}
                  style={styles.label}
                >
                  {label}
                </ThemedText>
              </View>
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 16 },
  track: { flexDirection: "row", alignItems: "flex-start", justifyContent: "center" },
  step: { alignItems: "center", width: 56 },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
  },
  line: { flex: 1, height: 2, marginTop: 4, borderRadius: 1, maxWidth: 36 },
  label: { marginTop: 6, fontSize: 11 },
});
