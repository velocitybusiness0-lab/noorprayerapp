import { PURPOSE_EBOOK_META } from "./PurposeEbookMeta";
import { PurposeEbookCatalog } from "./PurposeEbookCatalog";
import { PurposeEbookChapter, PurposeEbookMeta } from "./purposeEbook.types";

/** Presentation helpers for cover, TOC, and chapter reader screens. */
export class PurposeEbookPresenter {
  static meta(): PurposeEbookMeta {
    return PURPOSE_EBOOK_META;
  }

  static tocChapters(): PurposeEbookChapter[] {
    return PurposeEbookCatalog.all();
  }

  static chapterLabel(chapter: PurposeEbookChapter): string {
    return `Chapter ${chapter.number}`;
  }

  static tocRowTitle(chapter: PurposeEbookChapter): string {
    return chapter.title;
  }

  static tocRowAccessibilityLabel(chapter: PurposeEbookChapter, isCompleted: boolean): string {
    const status = isCompleted ? "Completed." : "";
    return `${status}${this.chapterLabel(chapter)}. ${chapter.title}`.trim();
  }

  static progressLabel(chapter: PurposeEbookChapter): string {
    const total = PurposeEbookCatalog.count();
    return `${chapter.number} of ${total}`;
  }

  static adjacentIds(chapterId: string): {
    previousId: string | null;
    nextId: string | null;
  } {
    return {
      previousId: PurposeEbookCatalog.previousId(chapterId),
      nextId: PurposeEbookCatalog.nextId(chapterId),
    };
  }
}
