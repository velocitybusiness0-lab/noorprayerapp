export interface OnboardingRatingReview {
  id: string;
  name: string;
  handle: string;
  rating: number;
  review: string;
  initials: string;
}

/** Social-proof reviews shown on the onboarding rating page. */
export class OnboardingRatingCatalog {
  static readonly socialProofCopy = "Loved by Muslims rebuilding their salah";

  static readonly reviews: OnboardingRatingReview[] = [
    {
      id: "amina",
      name: "Amina K",
      handle: "@amina.k",
      rating: 5,
      review:
        "The wake receipts finally got me up for Fajr. I have not missed a morning prayer in weeks.",
      initials: "AK",
    },
    {
      id: "yusuf",
      name: "Yusuf R",
      handle: "@yusuf.r",
      rating: 5,
      review:
        "Simple, calm, and actually keeps me consistent. My streak is the longest it has ever been.",
      initials: "YR",
    },
    {
      id: "anonymous",
      name: "Anonymous",
      handle: "",
      rating: 5,
      review:
        "I used to skip Asr when work got busy. Gentle reminders and a clear plan changed that.",
      initials: "A",
    },
  ];
}
