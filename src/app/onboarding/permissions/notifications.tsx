import { Href, Redirect } from "expo-router";
import { OnboardingPermissionRoutes } from "@/features/onboarding/OnboardingPermissionRoutes";

/** Legacy route — redirect to the combined permissions page. */
export default function OnboardingNotificationsPermissionRedirect() {
  return (
    <Redirect href={OnboardingPermissionRoutes.permissions as Href} />
  );
}
