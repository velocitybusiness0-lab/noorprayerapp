import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/core/theme";
import { haptics } from "@/core/haptics/HapticsManager";
import { ThemedText } from "@/components/primitives/ThemedText";
import { Button } from "@/components/primitives/Button";
import { ScanTarget } from "@/features/scan/scanTargets";

interface ScanOverlayProps {
  targets: ScanTarget[];
  isAutomatic: boolean;
  scanning: boolean;
  confidence: number;
  succeeded: boolean;
  onManualConfirm: () => void;
  onCancel: () => void;
}

/** Guidance + controls layered over the camera during a scan. */
export function ScanOverlay({
  targets,
  isAutomatic,
  scanning,
  confidence,
  succeeded,
  onManualConfirm,
  onCancel,
}: ScanOverlayProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.fill} pointerEvents="box-none">
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable
          hitSlop={12}
          onPress={() => {
            haptics.selection();
            onCancel();
          }}
        >
          <Ionicons name="close" size={28} color="#FFFFFF" />
        </Pressable>
        <ThemedText variant="bodyStrong" style={styles.white}>
          Scan to continue
        </ThemedText>
        <View style={styles.spacer} />
      </View>

      <View style={styles.reticle}>
        <View style={styles.frame} />
        {succeeded ? (
          <View style={styles.status}>
            <Ionicons name="checkmark-circle" size={40} color="#FFFFFF" />
            <ThemedText variant="heading" style={styles.white}>
              Confirmed
            </ThemedText>
          </View>
        ) : (
          <ThemedText variant="caption" style={[styles.white, styles.hint]}>
            {targets.map((t) => t.label).join("  /  ")}
          </ThemedText>
        )}
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        {isAutomatic && !succeeded && (
          <ThemedText variant="caption" style={styles.white}>
            {scanning ? "Looking for the target..." : "Hold steady"}
            {confidence > 0 ? `  ${Math.round(confidence * 100)}%` : ""}
          </ThemedText>
        )}
        {!succeeded && (
          <Button
            label={isAutomatic ? "Confirm manually" : "I can see it - confirm"}
            variant="secondary"
            onPress={onManualConfirm}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { ...StyleSheet.absoluteFillObject, justifyContent: "space-between" },
  white: { color: "#FFFFFF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  spacer: { width: 28 },
  reticle: { flex: 1, alignItems: "center", justifyContent: "center", gap: 16 },
  frame: {
    width: 240,
    height: 240,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.85)",
  },
  status: { position: "absolute", alignItems: "center", gap: 8 },
  hint: { position: "absolute", bottom: 120, textAlign: "center" },
  footer: { paddingHorizontal: 24, gap: 14, alignItems: "center" },
});
