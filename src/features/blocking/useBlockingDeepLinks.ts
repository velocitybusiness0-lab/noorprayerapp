import { useEffect } from "react";
import * as Linking from "expo-linking";
import { router } from "expo-router";

/** Routes shield "Open Miraj" and deep links into the scan-to-unblock screen. */
export function useBlockingDeepLinks(): void {
  useEffect(() => {
    const openFromUrl = (url: string | null) => {
      if (!url) return;
      const path = Linking.parse(url).path ?? "";
      if (path.includes("scan/unblock") || url.includes("scan/unblock")) {
        router.push("/scan/unblock");
      }
    };

    void Linking.getInitialURL().then(openFromUrl);
    const subscription = Linking.addEventListener("url", (event) => {
      openFromUrl(event.url);
    });

    return () => subscription.remove();
  }, []);
}
