/** Scroll metrics used to decide chapter completion. */
export interface PurposeEbookScrollMetrics {
  layoutHeight: number;
  contentHeight: number;
  offsetY: number;
}

/** Result of evaluating a chapter reader scroll position. */
export interface PurposeEbookScrollEvaluation {
  measured: boolean;
  shouldMarkComplete: boolean;
}

/** Detects when the reader has reached the end of a chapter. */
export class PurposeEbookScrollCompletionDetector {
  static readonly BOTTOM_THRESHOLD_PX = 32;
  static readonly SCROLLABLE_THRESHOLD_PX = 8;

  static isMeasured(metrics: PurposeEbookScrollMetrics): boolean {
    return metrics.layoutHeight > 0 && metrics.contentHeight > 0;
  }

  static evaluate(metrics: PurposeEbookScrollMetrics): PurposeEbookScrollEvaluation {
    if (!this.isMeasured(metrics)) {
      return {
        measured: false,
        // Avoid false positives before layout + content size are known.
        shouldMarkComplete: false,
      };
    }

    const { layoutHeight, contentHeight, offsetY } = metrics;
    const scrollable =
      contentHeight > layoutHeight + PurposeEbookScrollCompletionDetector.SCROLLABLE_THRESHOLD_PX;
    const distanceFromBottom = contentHeight - layoutHeight - offsetY;
    const nearBottom =
      distanceFromBottom <= PurposeEbookScrollCompletionDetector.BOTTOM_THRESHOLD_PX;
    // Short chapters that fit on screen count as read once measured.
    const shouldMarkComplete = !scrollable || nearBottom;

    return { measured: true, shouldMarkComplete };
  }
}
