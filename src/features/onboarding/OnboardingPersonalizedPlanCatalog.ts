import { Ionicons } from "@expo/vector-icons";
import { PersonalizedPlanChipAccentId } from "./OnboardingPersonalizedPlanChipAccentPalette";

export type PersonalizedPlanIconName = keyof typeof Ionicons.glyphMap;

export interface PersonalizedPlanBenefitChip {
  id: string;
  label: string;
  icon: PersonalizedPlanIconName;
  accent: PersonalizedPlanChipAccentId;
}

export interface PersonalizedPlanIncludesItem {
  id: string;
  title: string;
  description: string;
  icon: PersonalizedPlanIconName;
}

export interface PersonalizedPlanTextSegment {
  text: string;
  bold?: boolean;
}

export interface PersonalizedPlanOutcomeRow {
  id: string;
  segments: readonly PersonalizedPlanTextSegment[];
}

export interface PersonalizedPlanTestimonial {
  id: string;
  name: string;
  handle: string;
  quote: string;
  rating: number;
}

export interface PersonalizedPlanSetupField {
  id: string;
  label: string;
  value: string;
}

/** Static Miraj copy for the personalized-plan pre-paywall page. */
export class OnboardingPersonalizedPlanCatalog {
  static readonly lead =
    "Your custom plan is ready when you are. Miraj walks with you back to salah, one gentle step at a time.";

  static readonly benefitsTitle = "Become more consistent with Miraj";

  static readonly benefitsSubtitle = "Steadier salah. Softer mornings. A clearer heart.";

  static readonly planIncludesTitle = "Your plan";

  static readonly planIncludesSubheader = "Here's what's ready for you";

  static readonly socialProofLine = "Built for daily salah";

  static readonly ratingLine = "4.9 average rating";

  static readonly outcomesRatingLine = "Loved by Muslims worldwide";

  static readonly secondaryQuote =
    "Best choice I made for my mornings. Fajr finally feels possible again.";

  static readonly secondaryAttribution = "Anonymous";

  static readonly comeThisFar = "You've come this far.";

  static readonly investHeadline = "Invest in your salah and start your journey.";

  static readonly ctaLabel = "Start my plan";

  static readonly trustLine = "Cancel anytime · Begin with Bismillah";

  static readonly termsLabel = "Terms";

  static readonly privacyLabel = "Privacy";

  static readonly restoreLabel = "Restore";

  /** Three strong Miraj features for the cream “Your plan” card. */
  static readonly planIncludesItems: readonly PersonalizedPlanIncludesItem[] = [
    {
      id: "alarms",
      title: "Prayer alarms",
      description: "Gentle Fajr wake-ups that actually get you up",
      icon: "alarm-outline",
    },
    {
      id: "hunt",
      title: "Object hunt",
      description: "Scan to dismiss so you truly leave bed",
      icon: "scan-outline",
    },
    {
      id: "qibla",
      title: "Qibla & times",
      description: "Direction and timetable when you need them",
      icon: "compass-outline",
    },
  ];

  /** Ordered for 2 / 3 / 2 staggered chip rows (see BenefitChipRowLayout).
   *  Middle row keeps the three shortest labels so borders stay on-screen. */
  static readonly benefitChips: readonly PersonalizedPlanBenefitChip[] = [
    { id: "imaan", label: "Improved imaan", icon: "heart-outline", accent: "sky" },
    { id: "presence", label: "More presence", icon: "leaf-outline", accent: "lavender" },
    {
      id: "fajr",
      label: "Stronger Fajr",
      icon: "sunny-outline",
      accent: "sage",
    },
    { id: "duas", label: "Deeper duas", icon: "book-outline", accent: "teal" },
    { id: "qibla", label: "Clearer qibla", icon: "compass-outline", accent: "coral" },
    {
      id: "salah",
      label: "Steadier salah",
      icon: "moon-outline",
      accent: "sand",
    },
    {
      id: "mornings",
      label: "Calmer mornings",
      icon: "partly-sunny-outline",
      accent: "mint",
    },
  ];

  static readonly outcomeRows: readonly PersonalizedPlanOutcomeRow[] = [
    {
      id: "fajr",
      segments: [
        { text: "Wake for Fajr " },
        { text: "without hitting snooze", bold: true },
        { text: " again." },
      ],
    },
    {
      id: "hunt",
      segments: [
        { text: "Use object hunt " },
        { text: "so you truly get out of bed", bold: true },
        { text: "." },
      ],
    },
    {
      id: "present",
      segments: [
        { text: "Feel " },
        { text: "more present", bold: true },
        { text: " in every salah, every day." },
      ],
    },
    {
      id: "relationship",
      segments: [
        { text: "Build a " },
        { text: "steadier relationship", bold: true },
        { text: " with Allah through consistency." },
      ],
    },
  ];

  static readonly testimonials: readonly PersonalizedPlanTestimonial[] = [
    {
      id: "amina",
      name: "Amina K.",
      handle: "@amina.k",
      rating: 5,
      quote:
        "The Fajr alarm with object hunt finally gets me out of bed. I have not missed a morning prayer in weeks.",
    },
    {
      id: "yusuf",
      name: "Yusuf R.",
      handle: "@yusuf.r",
      rating: 5,
      quote:
        "Confirming namaz after I pray keeps me honest, and my streak is the longest it has ever been.",
    },
    {
      id: "sara",
      name: "Sara M.",
      handle: "@sara.m",
      rating: 5,
      quote:
        "Accurate prayer times and Qibla mean I never guess. The duas library feels like a blessing.",
    },
  ];
}
