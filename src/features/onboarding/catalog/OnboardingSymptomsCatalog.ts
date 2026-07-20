/** Symptom categories shown immediately before the red urgency pages. */
export interface OnboardingSymptomCategory {
  id: string;
  title: string;
  symptoms: { id: string; label: string }[];
}

export class OnboardingSymptomsCatalog {
  static readonly warningCopy =
    "Missing salah can have serious negative impacts on your spiritual and mental wellbeing";

  static readonly instructionCopy = "Select all symptoms you've been experiencing:";

  static readonly categories: OnboardingSymptomCategory[] = [
    {
      id: "mental",
      title: "Mental & Spiritual",
      symptoms: [
        { id: "unmotivated", label: "Feeling unmotivated to pray" },
        { id: "guilt", label: "Guilt after missing salah" },
        { id: "concentration", label: "Difficulty concentrating in salah" },
        { id: "brain-fog", label: "Spiritual brain fog" },
        { id: "anxiety", label: "General anxiety" },
      ],
    },
    {
      id: "physical",
      title: "Physical Health",
      symptoms: [
        { id: "tiredness", label: "Chronic tiredness affecting Fajr" },
        { id: "sleep", label: "Sleep problems" },
        { id: "rushing", label: "Rushing through salah" },
        { id: "wudhu", label: "Neglecting wudhu properly" },
        { id: "restless", label: "Restlessness during prayer" },
      ],
    },
    {
      id: "social",
      title: "Social & Relationships",
      symptoms: [
        { id: "avoiding-family", label: "Avoiding prayer with family" },
        { id: "strained", label: "Strained relationships at home" },
        { id: "conflicts", label: "More frequent conflicts" },
        { id: "isolated", label: "Feeling isolated from the ummah" },
        { id: "low-confidence", label: "Low confidence in religious settings" },
      ],
    },
    {
      id: "faith",
      title: "Faith & Growth",
      symptoms: [
        { id: "missing-windows", label: "Missing important prayer times" },
        { id: "excuses", label: "Making excuses to skip salah" },
        { id: "no-progress", label: "Lack of progress on faith goals" },
        { id: "fear-change", label: "Fear of committing to change" },
      ],
    },
  ];
}
