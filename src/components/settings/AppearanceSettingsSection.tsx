import React from "react";
import { SettingSection } from "@/components/settings/SettingSection";
import { SegmentedControl } from "@/components/settings/SegmentedControl";
import { useThemeMode } from "@/core/theme";
import { ThemeMode } from "@/core/theme/theme";

/** Theme appearance preference. */
export function AppearanceSettingsSection() {
  const { mode: themeMode, setMode } = useThemeMode();

  return (
    <SettingSection title="Appearance">
      <SegmentedControl<ThemeMode>
        value={themeMode}
        onChange={setMode}
        options={[
          { value: "system", label: "System" },
          { value: "dark", label: "Dark" },
          { value: "light", label: "Light" },
        ]}
      />
    </SettingSection>
  );
}
