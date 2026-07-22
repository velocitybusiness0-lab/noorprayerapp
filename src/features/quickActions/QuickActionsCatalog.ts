import type { Action } from "expo-quick-actions";
import { OnboardingPermissionRoutes } from "@/features/onboarding/OnboardingPermissionRoutes";

/** Home-screen quick actions / Android shortcuts for Miraj. */
export class QuickActionsCatalog {
  static readonly maxItems = 4;

  static items(): Action[] {
    return [
      {
        id: "try_for_free",
        title: "Try for free",
        subtitle: "Start with limited access",
        icon: "favorite",
        params: { href: OnboardingPermissionRoutes.tryForFree },
      },
      {
        id: "qibla",
        title: "Open Qibla",
        subtitle: "Find the direction of prayer",
        icon: "location",
        params: { href: "/(tabs)/qibla" },
      },
      {
        id: "prayer_times",
        title: "Prayer times",
        subtitle: "Today’s timetable",
        icon: "time",
        params: { href: "/(tabs)/timetable" },
      },
      {
        id: "onboarding",
        title: "Start onboarding",
        subtitle: "Set up Miraj again",
        icon: "invitation",
        params: { href: "/onboarding" },
      },
    ];
  }
}
