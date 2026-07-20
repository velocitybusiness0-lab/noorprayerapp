import * as Linking from "expo-linking";

export interface AlarmObjectHuntDeepLink {
  alarmId: string;
  slot?: string;
}

/**
 * Parses Miraj AlarmKit deep links that should open the Continue / ring gate.
 * Accepts `miraj://alarm/ring?alarmId=` (preferred) and legacy
 * `miraj://alarm/object-hunt?alarmId=` from older native builds.
 */
export class AlarmObjectHuntDeepLinkParser {
  parse(url: string): AlarmObjectHuntDeepLink | null {
    let parsed: ReturnType<typeof Linking.parse>;
    try {
      parsed = Linking.parse(url);
    } catch {
      return null;
    }

    const path = this.normalizedPath(parsed);
    if (!this.isLockScreenHandoffPath(path, parsed.hostname)) return null;

    const alarmId = this.stringQuery(parsed.queryParams?.alarmId);
    if (!alarmId) return null;

    const slot = this.stringQuery(parsed.queryParams?.slot);
    return slot ? { alarmId, slot } : { alarmId };
  }

  private normalizedPath(parsed: ReturnType<typeof Linking.parse>): string {
    const raw = (parsed.path ?? "").replace(/^\//, "");
    if (raw.length > 0) return raw;
    if (parsed.hostname === "alarm") return "alarm/ring";
    return "";
  }

  private isLockScreenHandoffPath(
    path: string,
    hostname: string | null | undefined
  ): boolean {
    if (
      path === "alarm/ring" ||
      path.endsWith("/alarm/ring") ||
      path === "alarm/object-hunt" ||
      path.endsWith("/alarm/object-hunt")
    ) {
      return true;
    }
    if (hostname !== "alarm") return false;
    return path === "ring" || path === "object-hunt" || path === "";
  }

  private stringQuery(value: unknown): string | undefined {
    if (typeof value === "string" && value.length > 0) return value;
    if (Array.isArray(value) && typeof value[0] === "string" && value[0].length > 0) {
      return value[0];
    }
    return undefined;
  }
}

export const alarmObjectHuntDeepLinkParser = new AlarmObjectHuntDeepLinkParser();
