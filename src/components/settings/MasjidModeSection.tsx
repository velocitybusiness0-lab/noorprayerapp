import React from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/core/theme";
import { haptics } from "@/core/haptics/HapticsManager";
import { ThemedText } from "@/components/primitives/ThemedText";
import { SettingSection } from "./SettingSection";
import { ToggleRow } from "./ToggleRow";
import { useMasjid } from "@/features/masjidMode/masjidStore";
import { locationManager } from "@/features/location/LocationManager";

/** Masjid mode controls: toggle, saved mosques, and add-current-location. */
export function MasjidModeSection() {
  const theme = useTheme();
  const { enabled, setEnabled, mosques, addMosque, removeMosque, atMosque, nearbyName } =
    useMasjid();

  const saveCurrent = async () => {
    haptics.selection();
    try {
      const loc = await locationManager.resolve();
      addMosque(loc.name ?? "My masjid", loc);
    } catch {
      Alert.alert("Location needed", "Enable location to save this masjid.");
    }
  };

  return (
    <SettingSection title="Masjid">
      <ToggleRow
        label="Masjid mode"
        description="Near a saved masjid, alarms soften to a quiet check-in."
        value={enabled}
        onValueChange={setEnabled}
      />

      {enabled && atMosque && (
        <View style={[styles.status, { borderTopColor: theme.colors.hairline }]}>
          <Ionicons name="location" size={16} color={theme.colors.textPrimary} />
          <ThemedText variant="caption" color="textSecondary">
            {`At ${nearbyName ?? "a masjid"} — alarms softened`}
          </ThemedText>
        </View>
      )}

      {mosques.map((mosque) => (
        <View
          key={mosque.id}
          style={[styles.mosqueRow, { borderTopColor: theme.colors.hairline }]}
        >
          <ThemedText variant="body" color="textSecondary">
            {mosque.name}
          </ThemedText>
          <Pressable
            hitSlop={10}
            onPress={() => {
              haptics.selection();
              removeMosque(mosque.id);
            }}
          >
            <Ionicons name="trash-outline" size={18} color={theme.colors.textTertiary} />
          </Pressable>
        </View>
      ))}

      <Pressable
        style={[styles.add, { borderTopColor: theme.colors.hairline }]}
        onPress={saveCurrent}
      >
        <Ionicons name="add-circle-outline" size={18} color={theme.colors.textPrimary} />
        <ThemedText variant="body">Save current location</ThemedText>
      </Pressable>
    </SettingSection>
  );
}

const styles = StyleSheet.create({
  status: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  mosqueRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  add: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
