import React, { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "@/core/theme";
import { useHideTabBar } from "@/features/navigation/useHideTabBar";
import { stackBackNavigator } from "@/features/navigation/StackBackNavigator";
import { MotivationFeedPresenter } from "@/features/motivation/MotivationFeedPresenter";
import { useMotivationPrefs } from "@/features/motivation/motivationPrefsStore";
import { RemindersChrome } from "@/components/reminders/RemindersChrome";
import { ReminderFeed } from "@/components/reminders/ReminderFeed";
import { ReminderSettingsSheet } from "@/components/reminders/ReminderSettingsSheet";

/** Full-screen vertical pager of curated motivation quotes and hadiths. */
export default function RemindersScreen() {
  useHideTabBar("reminders");
  const theme = useTheme();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const enabledCategories = useMotivationPrefs((s) => s.enabledCategories);

  const items = useMemo(
    () => MotivationFeedPresenter.feedItems({ enabledCategories }),
    [enabledCategories]
  );

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.surface }]}>
      <RemindersChrome
        onBack={() => stackBackNavigator.goBack()}
        onOpenSettings={() => setSettingsOpen(true)}
      />
      <ReminderFeed items={items} />
      <ReminderSettingsSheet
        visible={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
