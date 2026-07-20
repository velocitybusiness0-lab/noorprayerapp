import { Ionicons } from "@expo/vector-icons";

export type PersonalizedPlanIconName = keyof typeof Ionicons.glyphMap;

export interface PersonalizedPlanKeywordItem {
  id: string;
  keyword: string;
  rest: string;
  icon: PersonalizedPlanIconName;
}

export interface PersonalizedPlanHabitStep {
  id: string;
  title: string;
  body: string;
  icon: PersonalizedPlanIconName;
}

export interface PersonalizedPlanQuote {
  quote: string;
  attribution: string;
}

export interface PersonalizedPlanMotivationBenefit {
  id: string;
  keyword: string;
  rest: string;
  icon: PersonalizedPlanIconName;
}

/** Static Miraj copy + icons for the personalized-plan page. */
export class OnboardingPersonalizedPlanCatalog {
  static readonly goalLead = "Return to praying all five with presence by:";

  static readonly socialProofCaption =
    "For Muslims who want salah to feel sincere again";

  /** Sole product / features block on this page. */
  static readonly howTitle = "How Miraj helps";

  static readonly protectTitle = "Return to Allah one salah at a time";

  static readonly habitsTitle = "Who you are becoming";

  static readonly habitsBody =
    "Quiet practices that turn longing into a steady Muslim life, one sincere prayer at a time.";

  static readonly habitsHowLead = "Day by day, you are learning to:";

  static readonly motivationTitle = "Your heart was made for this return";

  static readonly motivationBody =
    "Willpower alone fades when mornings are hard. What lasts is a softer resolve: to stand, to remember, and to come back to Allah with peace instead of pressure.";

  static readonly discountTitle = "Special Discount!";

  static readonly discountBody = "Get 80% off on Miraj Premium!";

  static readonly discountCta = "Claim Now";

  static readonly trustLine = "Begin with Bismillah";

  static readonly helpItems: readonly PersonalizedPlanKeywordItem[] = [
    {
      id: "alarms",
      keyword: "Prayer alarms",
      rest: " so you rise and stand on time",
      icon: "alarm-outline",
    },
    {
      id: "scan",
      keyword: "Wake receipts",
      rest: " that confirm you truly got up for Fajr",
      icon: "scan-outline",
    },
    {
      id: "duas",
      keyword: "Duas ready",
      rest: " when your heart needs words",
      icon: "book-outline",
    },
    {
      id: "reminders",
      keyword: "Gentle reminders",
      rest: " that keep salah close through the day",
      icon: "notifications-outline",
    },
  ];

  static readonly howQuote: PersonalizedPlanQuote = {
    quote:
      "I used to miss Fajr more than I want to admit. Small reminders and a clear rhythm finally made salah feel steady again.",
    attribution: "a Miraj user",
  };

  static readonly protectItems: readonly PersonalizedPlanKeywordItem[] = [
    {
      id: "guard",
      keyword: "Guard your prayer",
      rest: " before the world pulls you away",
      icon: "shield-checkmark-outline",
    },
    {
      id: "presence",
      keyword: "Pray with presence",
      rest: " so each rakah feels intentional",
      icon: "heart-outline",
    },
    {
      id: "return",
      keyword: "Return gently",
      rest: " when you miss, without shame",
      icon: "refresh-outline",
    },
    {
      id: "barakah",
      keyword: "Seek barakah",
      rest: " in the quiet consistency of five daily meetings with Allah",
      icon: "sparkles-outline",
    },
  ];

  static readonly protectQuote: PersonalizedPlanQuote = {
    quote:
      "I stopped treating missed prayers as the end of my story. Returning became part of my worship.",
    attribution: "a Miraj user",
  };

  static readonly habitSteps: readonly PersonalizedPlanHabitStep[] = [
    {
      id: "fajr",
      title: "Guard Fajr",
      body: "Rise for the first prayer before the day claims your attention.",
      icon: "moon-outline",
    },
    {
      id: "presence",
      title: "Slow into salah",
      body: "Pause long enough for each prayer to feel sincere, not rushed.",
      icon: "leaf-outline",
    },
    {
      id: "dhikr",
      title: "Keep Allah near",
      body: "Carry remembrance between the five so your heart stays awake.",
      icon: "heart-outline",
    },
    {
      id: "return",
      title: "Return without shame",
      body: "Come back gently whenever you drift. Mercy is part of the path.",
      icon: "refresh-outline",
    },
  ];

  static readonly motivationBenefits: readonly PersonalizedPlanMotivationBenefit[] =
    [
      {
        id: "sincerity",
        keyword: "Sincerity",
        rest: " that deepens each time you stand before Allah",
        icon: "sparkles-outline",
      },
      {
        id: "peace",
        keyword: "Peace",
        rest: " that settles when prayer feels like coming home",
        icon: "water-outline",
      },
      {
        id: "discipline",
        keyword: "Discipline with mercy",
        rest: " so effort grows from love, not from guilt",
        icon: "compass-outline",
      },
      {
        id: "identity",
        keyword: "A clearer identity",
        rest: " as a servant who shows up, again and again",
        icon: "person-outline",
      },
    ];
}
