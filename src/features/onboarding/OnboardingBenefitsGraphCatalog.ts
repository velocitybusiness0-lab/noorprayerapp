export interface OnboardingBenefitsGraphPoint {
  x: number;
  y: number;
}

export interface OnboardingBenefitsGraphSeries {
  id: string;
  label: string;
  color: string;
  points: OnboardingBenefitsGraphPoint[];
}

/** Static week-1–3 comparison paths for the post-solution benefits beat. */
export class OnboardingBenefitsGraphCatalog {
  static readonly weekLabels = ["Week 1", "Week 2", "Week 3"] as const;

  static readonly missMarkerLabel = "X broken streaks";

  /** Normalized 0–1 coordinates; y=0 is chart bottom. */
  static withMirajSeries(): OnboardingBenefitsGraphSeries {
    return {
      id: "with-miraj",
      label: "With Miraj",
      color: "#16A34A",
      points: [
        { x: 0, y: 0.22 },
        { x: 0.18, y: 0.3 },
        { x: 0.34, y: 0.42 },
        { x: 0.5, y: 0.55 },
        { x: 0.66, y: 0.68 },
        { x: 0.82, y: 0.8 },
        { x: 1, y: 0.92 },
      ],
    };
  }

  static willpowerSeries(): OnboardingBenefitsGraphSeries {
    return {
      id: "willpower",
      label: "Willpower alone",
      color: "#F87171",
      points: [
        { x: 0, y: 0.34 },
        { x: 0.12, y: 0.48 },
        { x: 0.22, y: 0.18 },
        { x: 0.36, y: 0.44 },
        { x: 0.46, y: 0.16 },
        { x: 0.58, y: 0.4 },
        { x: 0.7, y: 0.14 },
        { x: 0.84, y: 0.36 },
        { x: 1, y: 0.2 },
      ],
    };
  }

  /** Indices into willpower points that show as broken-streak X marks. */
  static willpowerMissIndices(): number[] {
    return [1, 3, 5, 7];
  }
}
