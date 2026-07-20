import { router } from "expo-router";
import { PurposeEbookCatalog } from "./PurposeEbookCatalog";
import { PurposeEbookRoutes } from "./PurposeEbookRoutes";

/** Navigation and lookup for the My Purpose companion guide. */
export class PurposeEbookManager {
  static openCover(): void {
    router.push(PurposeEbookRoutes.cover());
  }

  static openChapter(chapterId: string): void {
    if (!PurposeEbookCatalog.byId(chapterId)) return;
    router.push(PurposeEbookRoutes.chapter(chapterId));
  }

  static openFirstChapter(): void {
    const first = PurposeEbookCatalog.all()[0];
    if (!first) return;
    this.openChapter(first.id);
  }

  static goToAdjacent(chapterId: string, direction: "previous" | "next"): void {
    const targetId =
      direction === "previous"
        ? PurposeEbookCatalog.previousId(chapterId)
        : PurposeEbookCatalog.nextId(chapterId);
    if (!targetId) return;
    router.replace(PurposeEbookRoutes.chapter(targetId));
  }
}
