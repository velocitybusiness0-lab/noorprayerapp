import { ImpactFeedbackStyle } from "expo-haptics";
import { haptics } from "@/core/haptics/HapticsManager";

export interface OnboardingTypewriterOptions {
  charMs?: number;
  hapticEvery?: number;
  pauseBetweenLinesMs?: number;
}

export interface OnboardingTypewriterLineCallbacks {
  onTitleProgress: (text: string) => void;
  onBodyProgress: (text: string) => void;
  onComplete: () => void;
}

/**
 * Character-by-character typing sequence with light haptic ticks.
 * Call `cancel()` to stop an in-flight run (e.g. on unmount).
 */
export class OnboardingTypewriter {
  private static readonly DEFAULT_CHAR_MS = 18;
  private static readonly DEFAULT_HAPTIC_EVERY = 4;
  private static readonly DEFAULT_PAUSE_MS = 180;

  private cancelled = false;
  private readonly charMs: number;
  private readonly hapticEvery: number;
  private readonly pauseBetweenLinesMs: number;

  constructor(options: OnboardingTypewriterOptions = {}) {
    this.charMs = options.charMs ?? OnboardingTypewriter.DEFAULT_CHAR_MS;
    this.hapticEvery = options.hapticEvery ?? OnboardingTypewriter.DEFAULT_HAPTIC_EVERY;
    this.pauseBetweenLinesMs =
      options.pauseBetweenLinesMs ?? OnboardingTypewriter.DEFAULT_PAUSE_MS;
  }

  cancel(): void {
    this.cancelled = true;
  }

  async run(
    title: string,
    body: string | undefined,
    callbacks: OnboardingTypewriterLineCallbacks
  ): Promise<void> {
    this.cancelled = false;
    callbacks.onTitleProgress("");
    callbacks.onBodyProgress("");

    await this.typeLine(title, callbacks.onTitleProgress);
    if (this.cancelled) return;

    if (body) {
      await this.wait(this.pauseBetweenLinesMs);
      if (this.cancelled) return;
      await this.typeLine(body, callbacks.onBodyProgress);
    }

    if (this.cancelled) return;
    haptics.impact(ImpactFeedbackStyle.Light);
    callbacks.onComplete();
  }

  private async typeLine(line: string, apply: (value: string) => void): Promise<void> {
    for (let index = 0; index <= line.length; index += 1) {
      if (this.cancelled) return;
      apply(line.slice(0, index));
      if (index > 0 && index % this.hapticEvery === 0) {
        haptics.impact(ImpactFeedbackStyle.Light);
      }
      await this.wait(this.charMs);
    }
  }

  private wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
