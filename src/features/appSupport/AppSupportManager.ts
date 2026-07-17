import { Linking, Platform, Share } from "react-native";
import { AppLinks } from "@/core/app/AppLinks";

/** Share, rating, and feedback actions from Settings. */
export class AppSupportManager {
  async shareApp(): Promise<void> {
    const storeUrl =
      Platform.OS === "ios" ? AppLinks.iosAppStoreUrl : AppLinks.androidPlayStoreUrl;

    await Share.share({
      title: AppLinks.appName,
      message: `${AppLinks.shareMessage}\n${storeUrl}`,
    });
  }

  async rateApp(): Promise<void> {
    const url =
      Platform.OS === "ios" ? AppLinks.iosAppStoreUrl : AppLinks.androidPlayStoreUrl;
    await Linking.openURL(url);
  }

  openFeedback(): void {
    const subject = encodeURIComponent(AppLinks.feedbackSubject);
    const body = encodeURIComponent(
      `\n\n---\nApp: ${AppLinks.appName}\nPlatform: ${Platform.OS}`
    );
    void Linking.openURL(`mailto:${AppLinks.feedbackEmail}?subject=${subject}&body=${body}`);
  }
}

export const appSupportManager = new AppSupportManager();
