import React from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  View,
  useWindowDimensions,
} from "react-native";
import { useTheme } from "@/core/theme";
import { haptics } from "@/core/haptics/HapticsManager";
import { ThemedText } from "@/components/primitives/ThemedText";
import { Button } from "@/components/primitives/Button";
import { ReminderCategoryChips } from "./ReminderCategoryChips";
import { ReminderQuantityStepper } from "./ReminderQuantityStepper";
import { ReminderWindowPicker } from "./ReminderWindowPicker";
import { ReminderSettingsSection } from "./ReminderSettingsSection";
import { ReminderSettingsRow } from "./ReminderSettingsRow";
import { useMotivationPrefs } from "@/features/motivation/motivationPrefsStore";
import { MotivationCategoryId } from "@/features/motivation/motivation.types";
import { MotivationPrefsManager } from "@/features/motivation/MotivationPrefsManager";

interface ReminderSettingsSheetProps {
  visible: boolean;
  onClose: () => void;
}

/** Centered preferences card for reminder types and notifications. */
export function ReminderSettingsSheet({ visible, onClose }: ReminderSettingsSheetProps) {
  const theme = useTheme();
  const { width, height } = useWindowDimensions();
  const enabledCategories = useMotivationPrefs((s) => s.enabledCategories);
  const notifications = useMotivationPrefs((s) => s.notifications);
  const toggleCategory = useMotivationPrefs((s) => s.toggleCategory);
  const toggleWindowPreset = useMotivationPrefs((s) => s.toggleWindowPreset);
  const setNotifications = useMotivationPrefs((s) => s.setNotifications);

  const onToggleCategory = (id: MotivationCategoryId) => {
    toggleCategory(id);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable
          style={[styles.backdrop, { backgroundColor: theme.colors.overlay }]}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close preferences"
        />
        <View
          style={[
            styles.card,
            {
              width: Math.min(width - 40, 400),
              maxHeight: height * 0.78,
              backgroundColor: theme.colors.surface,
              borderRadius: theme.radii.xl,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <ThemedText variant="heading" style={styles.title}>
            Preferences
          </ThemedText>

          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
            contentContainerStyle={styles.content}
          >
            <ReminderSettingsSection label="Types">
              <ReminderCategoryChips
                enabled={enabledCategories}
                onToggle={onToggleCategory}
              />
            </ReminderSettingsSection>

            <ReminderSettingsRow label="Notifications">
              <Switch
                value={notifications.enabled}
                onValueChange={(enabled) => {
                  haptics.selection();
                  setNotifications({ enabled });
                }}
                trackColor={{ true: theme.colors.accent, false: theme.colors.border }}
                thumbColor={theme.colors.background}
              />
            </ReminderSettingsRow>

            {notifications.enabled ? (
              <>
                <ReminderSettingsRow label="Amount" hint="Spread over When">
                  <ReminderQuantityStepper
                    value={notifications.quantityPerDay}
                    min={MotivationPrefsManager.quantityMin}
                    max={MotivationPrefsManager.quantityMax}
                    onChange={(quantityPerDay) => setNotifications({ quantityPerDay })}
                  />
                </ReminderSettingsRow>

                <ReminderSettingsSection label="When">
                  <ReminderWindowPicker
                    selected={notifications.windowPresets}
                    onToggle={toggleWindowPreset}
                  />
                </ReminderSettingsSection>
              </>
            ) : null}
          </ScrollView>

          <Button label="Done" onPress={onClose} style={styles.done} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 18,
    gap: 18,
    zIndex: 1,
  },
  title: {
    textAlign: "center",
  },
  content: {
    gap: 24,
    paddingBottom: 4,
  },
  done: {
    marginTop: 2,
  },
});
