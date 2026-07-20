import { PurposeEbookCatalog } from "./PurposeEbookCatalog";
import { usePurposeEbookCompletion } from "./purposeEbookCompletionStore";

/** Business logic for marking and querying chapter completion. */
export class PurposeEbookCompletionManager {
  static markChapterComplete(chapterId: string): void {
    if (!PurposeEbookCatalog.byId(chapterId)) return;
    usePurposeEbookCompletion.getState().markComplete(chapterId);
  }

  static isChapterComplete(chapterId: string): boolean {
    return usePurposeEbookCompletion.getState().isComplete(chapterId);
  }

  static completedChapterIds(): string[] {
    return usePurposeEbookCompletion.getState().completedChapterIds;
  }
}
