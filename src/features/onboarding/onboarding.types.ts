export type OnboardingOptionLayout = "grid-2x2" | "grid-2" | "stack-3" | "stack-2";

export type OnboardingPastelTone = import("./OnboardingPastelPalette").OnboardingPastelTone;

export type OnboardingStepType =
  | "welcome"
  | "multi-choice"
  | "message"
  | "comparison"
  | "slider"
  | "missed-graph"
  | "feature-slideshow"
  | "name"
  | "faith-slideshow"
  | "calculation"
  | "downtrend"
  | "slideshow"
  | "hope-screen"
  | "streak";

export interface OnboardingOption {
  id: string;
  label: string;
}

export interface OnboardingComparisonRow {
  positive: string;
  negative: string;
}

export type OnboardingSlideGraphicType = "domino" | "hourglass" | "summit";

export interface OnboardingSlide {
  title?: string;
  body?: string;
  bullets?: string[];
  checks?: string[];
  icon?: string;
  graphic?: OnboardingSlideGraphicType;
  pastel: OnboardingPastelTone;
}

export interface OnboardingFeatureSlide {
  icon: string;
  title: string;
  body: string;
}

export interface OnboardingCalculationQuote {
  title: string;
  body?: string;
  source?: string;
}

export interface OnboardingStep {
  id: string;
  type: OnboardingStepType;
  title?: string;
  body?: string;
  options?: OnboardingOption[];
  layout?: OnboardingOptionLayout;
  continueLabel?: string;
  requiresSelection?: boolean;
  comparisonRows?: OnboardingComparisonRow[];
  footer?: string;
  features?: OnboardingFeatureSlide[];
  bullets?: string[];
  min?: number;
  max?: number;
  slides?: OnboardingSlide[];
  calculationTasks?: string[];
  calculationQuotes?: OnboardingCalculationQuote[];
  calculationDurationMs?: number;
  optionSpacing?: "normal" | "relaxed" | "loose";
  checks?: string[];
  pastel?: OnboardingPastelTone;
}

export type OnboardingAnswers = Record<string, string | string[] | number>;
