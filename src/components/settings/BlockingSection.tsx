import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/primitives/ThemedText";
import { Button } from "@/components/primitives/Button";
import { SettingSection } from "./SettingSection";
import { BLOCK_SELECTION_ID, blockingManager } from "@/features/blocking/BlockingManager";
import { isExpoGo } from "@/core/runtime/isExpoGo";

type AppPickerComponent = React.ComponentType<{
  familyActivitySelectionId: string;
  includeEntireCategory?: boolean;
  style?: object;
  footerText?: string;
}>;

/**
 * Lets the user pick which apps to shield during "Block apps" mode using the
 * native FamilyActivityPicker. Only meaningful on an iOS device with Screen
 * Time access; otherwise shows guidance.
 */
export function BlockingSection() {
  const available = Platform.OS === "ios" && blockingManager.isAvailable;
  const [authorized, setAuthorized] = useState(false);
  const [Picker, setPicker] = useState<AppPickerComponent | null>(null);

  useEffect(() => {
    blockingManager.setSelectionId(BLOCK_SELECTION_ID);
  }, []);

  useEffect(() => {
    if (!authorized || !available || isExpoGo()) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const mod = require("react-native-device-activity");
      setPicker(() => mod.DeviceActivitySelectionViewPersisted ?? null);
    } catch {
      setPicker(null);
    }
  }, [authorized, available]);

  if (!available) {
    return (
      <SettingSection title="App blocking">
        <ThemedText variant="body" color="textSecondary">
          App blocking uses Apple Screen Time. It requires a development build on
          a physical iOS device with the Family Controls entitlement. It does not
          work in Expo Go or the simulator.
        </ThemedText>
      </SettingSection>
    );
  }

  return (
    <SettingSection title="App blocking">
      {!authorized ? (
        <Button
          label="Grant Screen Time access"
          onPress={async () => setAuthorized(await blockingManager.requestAuthorization())}
        />
      ) : Picker ? (
        <View style={styles.picker}>
          <ThemedText variant="caption" color="textTertiary" style={styles.hint}>
            Choose the apps to block during prayer time.
          </ThemedText>
          <Picker
            familyActivitySelectionId={BLOCK_SELECTION_ID}
            includeEntireCategory
            style={styles.native}
            footerText="These apps are shielded until you scan to unlock."
          />
        </View>
      ) : (
        <ThemedText variant="body" color="textSecondary">
          The app picker is unavailable in this build. Install a development build
          to choose blocked apps.
        </ThemedText>
      )}
    </SettingSection>
  );
}

const styles = StyleSheet.create({
  picker: { gap: 10 },
  hint: {},
  native: { height: 320, width: "100%" },
});
