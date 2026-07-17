import React from "react";
import { SettingSection } from "@/components/settings/SettingSection";
import { SettingActionRow } from "@/components/settings/SettingActionRow";
import { appSupportManager } from "@/features/appSupport/AppSupportManager";

/** Share, rate, and feedback shortcuts. */
export function AppSupportSection() {
  return (
    <SettingSection title="Support">
      <SettingActionRow
        label="Share the app"
        icon="share-outline"
        onPress={() => {
          void appSupportManager.shareApp();
        }}
      />
      <SettingActionRow
        label="Rate us"
        icon="star-outline"
        onPress={() => {
          void appSupportManager.rateApp();
        }}
      />
      <SettingActionRow
        label="Give feedback"
        icon="mail-outline"
        onPress={() => {
          appSupportManager.openFeedback();
        }}
        last
      />
    </SettingSection>
  );
}
