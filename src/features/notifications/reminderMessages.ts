import { ObligatoryPrayer } from "@/features/prayerTimes/prayerTimes.types";

/**
 * Motivational reminder copy: a short "why now" line per prayer to answer
 * "what's to come / reasons why". Rotated to stay fresh.
 */
const MESSAGES: Record<ObligatoryPrayer, string[]> = {
  fajr: [
    "Fajr is here. The two rak'ahs of Fajr are better than the world and all it holds.",
    "Begin the day in light. Whoever prays Fajr is under Allah's protection.",
  ],
  dhuhr: [
    "Dhuhr time. Pause the noise of the day and stand before your Lord.",
    "A few minutes now for a lifetime of reward. It's Dhuhr.",
  ],
  asr: [
    "Asr is here. Guard the middle prayer; do not let the day slip by.",
    "Whoever prays Asr on time, their deeds are raised. Don't miss it.",
  ],
  maghrib: [
    "Maghrib time. As the sun sets, turn back to the One who never sets.",
    "The day is closing. Meet Maghrib before it passes.",
  ],
  isha: [
    "Isha is here. End your day in sujood and rest with a clear heart.",
    "Praying Isha in congregation is like praying half the night. It's time.",
  ],
};

export function reminderMessage(prayer: ObligatoryPrayer): string {
  const list = MESSAGES[prayer];
  return list[Math.floor(Math.random() * list.length)];
}

export function followUpMessage(prayerLabel: string): string {
  return `Did you pray ${prayerLabel}? Tap to log it and keep your streak alive.`;
}
