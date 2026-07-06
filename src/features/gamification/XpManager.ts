/** XP awarded per logged activity. */
export const XP_PER_NAMAZ = 10;
export const XP_PER_QURAN_SESSION = 25;

/** Converts logged namaz + quran into total XP. */
export class XpManager {
  totalXp(namazCount: number, quranSessions: number): number {
    return namazCount * XP_PER_NAMAZ + quranSessions * XP_PER_QURAN_SESSION;
  }
}

export const xpManager = new XpManager();
