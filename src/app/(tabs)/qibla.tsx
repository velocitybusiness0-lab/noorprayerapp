import React, { useEffect, useRef } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Screen } from "@/components/primitives/Screen";
import { ThemedText } from "@/components/primitives/ThemedText";
import { QiblaCompass } from "@/components/qibla/QiblaCompass";
import { useTheme } from "@/core/theme";
import { haptics } from "@/core/haptics/HapticsManager";
import { useQibla } from "@/features/qibla/useQibla";

export default function QiblaScreen() {
  const theme = useTheme();
  const { loading, error, heading, relativeAngle, aligned, qiblaBearing } = useQibla();
  const wasAligned = useRef(false);

  // Haptic pulse the moment the user lines up with the qibla.
  useEffect(() => {
    if (aligned && !wasAligned.current) haptics.success();
    wasAligned.current = aligned;
  }, [aligned]);

  return (
    <Screen tabBarPadding>
      <ThemedText variant="title">Qibla</ThemedText>
      <ThemedText variant="body" color="textSecondary">
        {qiblaBearing ? `${Math.round(qiblaBearing)}\u00b0 from North` : "Locating..."}
      </ThemedText>

      <View style={styles.body}>
        {loading ? (
          <ActivityIndicator color={theme.colors.textPrimary} />
        ) : error ? (
          <ThemedText variant="body" color="textSecondary" style={styles.error}>
            {error}
          </ThemedText>
        ) : (
          <>
            <QiblaCompass
              heading={heading}
              relativeAngle={relativeAngle}
              aligned={aligned}
            />
            <ThemedText variant="mono" color="textSecondary" style={styles.heading}>
              {`${Math.round(heading)}\u00b0`}
            </ThemedText>
          </>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 32,
  },
  error: { textAlign: "center", paddingHorizontal: 24 },
  heading: { marginTop: 8 },
});
