/** Question answers always render as full-width list rows. */
export type OnboardingOptionLayout = "list";

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
  | "streak"
  | "commitment"
  | "benefits-graph"
  | "personalized-plan";

export interface OnboardingOption {
  id: string;
  label: string;
}

export interface OnboardingComparisonRow {
  positive: string;
  negative: string;
}

export type OnboardingSlideGraphicType =
  | "domino"
  | "hourglass"
  | "summit"
  | "welcomeMiraj"
  | "welcomeAlarms"
  | "welcomeConsistency";

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
  /** Vertical placement of the option block within the content area. */
  optionsPlacement?: "start" | "center" | "end";
  /** Vertical placement for centered message content. */
  contentPlacement?: "center" | "upper";
  /** How the body line appears after the title (defaults to typing). */
  bodyReveal?: "typing" | "fade";
  checks?: string[];
  /** Optional brand mark shown above slideshow content (e.g. Miraj welcome). */
  brandLabel?: string;
  /** Defaults to single-select for quiz questions; choose-goals uses multi. */
  selectionMode?: "single" | "multi";
  pastel?: OnboardingPastelTone;
}

export type OnboardingAnswers = Record<string, string | string[] | number>;
