import { OnboardingAnswers } from "./onboarding.types";

export interface OnboardingPrePaywallTypingLine {
  id: string;
  text: string;
}

/** Phased typing lines before the personalized plan — Reload PrePaywallTypingView pattern. */
export class OnboardingPrePaywallTypingSequence {
  static readonly charMs = 36;
  static readonly dwellAfterBlockMs = 850;
  static readonly gapBetweenBlocksMs = 350;
  static readonly pauseBeforeSecondOpeningLineMs = 700;

  static linesFor(answers: OnboardingAnswers, nameStepId = "name"): OnboardingPrePaywallTypingLine[] {
    const rawName = answers[nameStepId];
    const name = typeof rawName === "string" && rawName.trim().length > 0 ? rawName.trim() : "friend";

    return [
      { id: "greeting", text: `Hey, ${name}!` },
      {
        id: "success-close",
        text: "Your salah consistency and a steadier life are close.",
      },
      {
        id: "invest",
        text: "Now is the best time to commit to your prayers.",
      },
      {
        id: "final-review",
        text: "Let's do a final review and begin.",
      },
    ];
  }

  static typingDurationMs(text: string, startDelayMs = 200): number {
    return startDelayMs + text.length * this.charMs;
  }

  /** Total auto-advance delay from mount through all phases. */
  static totalDurationMs(lines: OnboardingPrePaywallTypingLine[]): number {
    const [greeting, successClose, invest, finalReview] = lines;
    if (!greeting || !successClose || !invest || !finalReview) return 8000;

    const openingEnd =
      this.typingDurationMs(greeting.text, 300) +
      this.pauseBeforeSecondOpeningLineMs +
      this.typingDurationMs(successClose.text, 200) +
      this.dwellAfterBlockMs;

    const investEnd =
      openingEnd +
      this.gapBetweenBlocksMs +
      this.typingDurationMs(invest.text, 200) +
      this.dwellAfterBlockMs;

    const finalEnd =
      investEnd +
      this.gapBetweenBlocksMs +
      this.typingDurationMs(finalReview.text, 200) +
      500;

    return finalEnd;
  }
}
