const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const NAMESPACE = "miraj-prayer-alarms-v1";

function fnv1aHash(str: string): number {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/** Deterministic RFC-4122 UUID for a stable logical alarm key. */
export function alarmKitUuidForKey(logicalKey: string): string {
  const seed = `${NAMESPACE}:${logicalKey}`;
  const bytes = new Uint8Array(16);
  for (let i = 0; i < 16; i++) {
    bytes[i] = fnv1aHash(`${seed}:${i}`) & 0xff;
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x50;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

export function isAlarmKitUuid(id: string): boolean {
  return UUID_RE.test(id);
}

/** Maps legacy or logical ids to the AlarmKit UUID used at schedule time. */
export function resolveAlarmKitId(id: string): string | null {
  if (isAlarmKitUuid(id)) return id;
  if (id.startsWith("prayer-")) return alarmKitUuidForKey(id);
  if (id.startsWith("inapp-")) return alarmKitUuidForKey(id.replace(/^inapp-/, "prayer-"));
  return null;
}

export function logicalAlarmKey(prayer: string, dateKey: string): string {
  return `prayer-${prayer}-${dateKey}`;
}
