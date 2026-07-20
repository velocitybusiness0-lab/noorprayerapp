import { FlatList } from "react-native";
import { OnboardingSlide } from "./onboarding.types";
import { OnboardingSlideshowController } from "./OnboardingSlideshowController";

type SlideshowList = FlatList<OnboardingSlide>;

/** Safe FlatList paging for onboarding slideshow Continue / swipe sync. */
export class OnboardingSlideshowPagerScroller {
  static canScroll(pageWidth: number, slideCount: number): boolean {
    return pageWidth > 0 && slideCount > 0;
  }

  static offsetForIndex(index: number, pageWidth: number): number {
    return Math.max(0, index) * pageWidth;
  }

  /**
   * Scrolls to a clamped index after layout. Prefers scrollToIndex with
   * offset fallback so Continue never throws on an unmeasured list.
   */
  static scrollToIndex(
    list: SlideshowList | null,
    index: number,
    slideCount: number,
    pageWidth: number,
    animated: boolean
  ): void {
    if (!list || !this.canScroll(pageWidth, slideCount)) return;
    const safeIndex = OnboardingSlideshowController.clampIndex(index, slideCount);
    try {
      list.scrollToIndex({ index: safeIndex, animated, viewPosition: 0 });
    } catch {
      list.scrollToOffset({
        offset: this.offsetForIndex(safeIndex, pageWidth),
        animated,
      });
    }
  }

  /** Retries a failed scrollToIndex once layout catches up. */
  static retryFailedIndex(
    list: SlideshowList | null,
    index: number,
    slideCount: number,
    pageWidth: number,
    averageItemLength: number
  ): void {
    if (!list || !this.canScroll(pageWidth, slideCount)) return;
    const safeIndex = OnboardingSlideshowController.clampIndex(index, slideCount);
    const length = averageItemLength > 0 ? averageItemLength : pageWidth;
    requestAnimationFrame(() => {
      list.scrollToOffset({
        offset: this.offsetForIndex(safeIndex, length),
        animated: false,
      });
      requestAnimationFrame(() => {
        this.scrollToIndex(list, safeIndex, slideCount, pageWidth, true);
      });
    });
  }
}
