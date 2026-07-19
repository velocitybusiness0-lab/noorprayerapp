import { OnboardingPastelTone, OnboardingSlide } from "./onboarding.types";

/** Navigation and pastel sync for the urgency/hope slideshow step. */
export class OnboardingSlideshowController {
  static slideCount(slides: OnboardingSlide[] | undefined): number {
    return slides?.length ?? 0;
  }

  static clampIndex(index: number, slideCount: number): number {
    if (slideCount <= 0) return 0;
    return Math.max(0, Math.min(index, slideCount - 1));
  }

  static isLastSlide(index: number, slideCount: number): boolean {
    if (slideCount <= 0) return true;
    return index >= slideCount - 1;
  }

  /** Next slide index, or null when Continue should leave the slideshow step. */
  static nextSlideIndex(index: number, slideCount: number): number | null {
    if (this.isLastSlide(index, slideCount)) return null;
    return index + 1;
  }

  /** Intra-slide advances use Next; the final slide uses the step continue label. */
  static continueLabel(
    index: number,
    slideCount: number,
    stepContinueLabel?: string
  ): string {
    if (!this.isLastSlide(index, slideCount)) return "Next";
    return stepContinueLabel ?? "Continue";
  }

  static indexFromOffset(offsetX: number, pageWidth: number): number {
    if (pageWidth <= 0) return 0;
    return Math.round(offsetX / pageWidth);
  }

  static pastelAt(
    slides: OnboardingSlide[] | undefined,
    index: number,
    fallback: OnboardingPastelTone = "hardRed"
  ): OnboardingPastelTone {
    const count = this.slideCount(slides);
    if (count === 0) return fallback;
    const safeIndex = this.clampIndex(index, count);
    return slides?.[safeIndex]?.pastel ?? fallback;
  }
}
