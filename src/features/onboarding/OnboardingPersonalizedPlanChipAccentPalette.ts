/**
 * Soft Miraj pastel accents for personalized-plan benefit chips.
 * Borders/icons stay muted — never neon.
 */
export type PersonalizedPlanChipAccentId =
  | "sky"
  | "sand"
  | "sage"
  | "lavender"
  | "teal"
  | "coral"
  | "mint";

export interface PersonalizedPlanChipAccentColors {
  border: string;
  icon: string;
  fill: string;
}

export class OnboardingPersonalizedPlanChipAccentPalette {
  static colors(
    accent: PersonalizedPlanChipAccentId
  ): PersonalizedPlanChipAccentColors {
    switch (accent) {
      case "sky":
        return {
          border: "rgba(122,168,196,0.72)",
          icon: "#6A9BB8",
          fill: "rgba(168,200,220,0.22)",
        };
      case "sand":
        return {
          border: "rgba(196,154,104,0.68)",
          icon: "#C4925A",
          fill: "rgba(232,220,200,0.48)",
        };
      case "sage":
        return {
          border: "rgba(107,158,136,0.78)",
          icon: "#6B9E88",
          fill: "rgba(107,158,136,0.16)",
        };
      case "lavender":
        return {
          border: "rgba(168,148,196,0.7)",
          icon: "#8F7AB0",
          fill: "rgba(200,188,216,0.28)",
        };
      case "teal":
        return {
          border: "rgba(90,148,148,0.7)",
          icon: "#5A9494",
          fill: "rgba(168,204,200,0.24)",
        };
      case "coral":
        return {
          border: "rgba(196,120,112,0.68)",
          icon: "#C47870",
          fill: "rgba(232,188,180,0.32)",
        };
      case "mint":
        return {
          border: "rgba(124,184,154,0.75)",
          icon: "#7CB89A",
          fill: "rgba(187,247,208,0.28)",
        };
    }
  }
}
