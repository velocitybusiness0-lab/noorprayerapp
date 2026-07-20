import { create } from "zustand";
import { storage } from "@/core/storage/StorageManager";
import { StorageKeys } from "@/core/storage/storageKeys";
import { PurposeEbookCompletionSnapshot } from "./purposeEbook.types";

interface PurposeEbookCompletionState extends PurposeEbookCompletionSnapshot {
  markComplete: (chapterId: string) => void;
  isComplete: (chapterId: string) => boolean;
}

function loadSnapshot(): PurposeEbookCompletionSnapshot {
  const stored = storage.getObject<PurposeEbookCompletionSnapshot>(
    StorageKeys.purposeEbookCompletion
  );
  return {
    completedChapterIds: stored?.completedChapterIds ?? [],
  };
}

function persist(snapshot: PurposeEbookCompletionSnapshot): void {
  storage.setObject(StorageKeys.purposeEbookCompletion, snapshot);
}

/** Persisted chapter completion for the My Purpose companion guide. */
export const usePurposeEbookCompletion = create<PurposeEbookCompletionState>((set, get) => ({
  ...loadSnapshot(),

  isComplete: (chapterId) => get().completedChapterIds.includes(chapterId),

  markComplete: (chapterId) => {
    if (get().completedChapterIds.includes(chapterId)) return;
    set((state) => {
      const next = {
        completedChapterIds: [...state.completedChapterIds, chapterId],
      };
      persist(next);
      return next;
    });
  },
}));
