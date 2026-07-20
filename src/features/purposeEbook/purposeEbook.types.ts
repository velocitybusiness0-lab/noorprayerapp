/** A headed block of prose within a chapter. */
export interface PurposeEbookSection {
  heading?: string;
  paragraphs: string[];
}

/** One chapter of the My Purpose companion guide. */
export interface PurposeEbookChapter {
  id: string;
  number: number;
  title: string;
  sections: PurposeEbookSection[];
}

/** Book-level metadata shown on the cover and home card. */
export interface PurposeEbookMeta {
  title: string;
  subtitle: string;
  homeCardSubtitle: string;
}

/** Persisted chapter completion state for the companion guide. */
export interface PurposeEbookCompletionSnapshot {
  completedChapterIds: string[];
}
