import { DuaCollection } from "./dua.types";

const STARTER_IDS = new Set([
  "col-daily",
  "col-parents",
  "col-ramadan",
  "col-travel",
  "col-work",
  "col-tahajjud",
  "col-goals",
]);

/** Starter collections for a personal dua library. */
export class DuaDefaultCollections {
  static create(): DuaCollection[] {
    const now = Date.now();
    return [
      { id: "col-daily", name: "Daily Duas", emoji: "🤲", duaIds: [], createdAt: now },
      { id: "col-parents", name: "For My Parents", emoji: "❤️", duaIds: [], createdAt: now },
      { id: "col-ramadan", name: "Ramadan", emoji: "🕌", duaIds: [], createdAt: now },
      { id: "col-travel", name: "Travel", emoji: "✈️", duaIds: [], createdAt: now },
      { id: "col-work", name: "Work", emoji: "💼", duaIds: [], createdAt: now },
      { id: "col-tahajjud", name: "Tahajjud", emoji: "🌙", duaIds: [], createdAt: now },
      { id: "col-goals", name: "Personal Goals", emoji: "✨", duaIds: [], createdAt: now },
    ];
  }

  static isStarter(id: string): boolean {
    return STARTER_IDS.has(id);
  }
}
