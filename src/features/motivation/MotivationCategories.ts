import { MotivationCategoryId } from "./motivation.types";

export type MotivationCategoryMeta = {
  id: MotivationCategoryId;
  label: string;
};

/** Display labels for reminder type chips and settings. */
export class MotivationCategories {
  private static readonly META: MotivationCategoryMeta[] = [
    { id: "quran", label: "Quran" },
    { id: "hadith", label: "Hadith" },
    { id: "motivation", label: "Motivation" },
    { id: "gratitude", label: "Gratitude" },
    { id: "discipline", label: "Discipline" },
    { id: "patience", label: "Patience" },
    { id: "tawakkul", label: "Tawakkul" },
    { id: "family", label: "Family" },
    { id: "morning", label: "Morning" },
    { id: "evening", label: "Evening" },
    { id: "strength", label: "Strength" },
    { id: "mercy", label: "Mercy" },
    { id: "focus", label: "Focus" },
    { id: "hope", label: "Hope" },
  ];

  static all(): MotivationCategoryMeta[] {
    return MotivationCategories.META;
  }

  static label(id: MotivationCategoryId): string {
    return MotivationCategories.META.find((item) => item.id === id)?.label ?? id;
  }
}
