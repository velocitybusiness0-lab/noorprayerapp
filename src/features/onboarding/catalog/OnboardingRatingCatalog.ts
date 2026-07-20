import { ImageSourcePropType } from "react-native";

export interface OnboardingRatingReview {
  id: string;
  name: string;
  handle: string;
  rating: number;
  review: string;
  initials: string;
  avatarSource: ImageSourcePropType;
}

/** Social-proof reviews shown on the onboarding rating page. */
export class OnboardingRatingCatalog {
  static readonly socialProofCopy = "Loved by Muslims rebuilding consistent salah";

  static readonly reviews: OnboardingRatingReview[] = [
    {
      id: "amina",
      name: "Amina K",
      handle: "@amina.k",
      rating: 5,
      review:
        "The prayer alarm with object hunt finally gets me out of bed for Fajr. I have not missed a morning prayer in weeks.",
      initials: "AK",
      avatarSource: require("../../../../assets/onboarding/avatars/amina.png"),
    },
    {
      id: "yusuf",
      name: "Yusuf R",
      handle: "@yusuf.r",
      rating: 5,
      review:
        "Confirming namaz after I pray keeps me honest, and my streak is the longest it has ever been.",
      initials: "YR",
      avatarSource: require("../../../../assets/onboarding/avatars/yusuf.png"),
    },
    {
      id: "sara",
      name: "Sara M",
      handle: "@sara.m",
      rating: 5,
      review:
        "Accurate prayer times and the Qibla finder mean I never guess the direction. The duas library is a blessing too.",
      initials: "SM",
      avatarSource: require("../../../../assets/onboarding/avatars/sara.png"),
    },
  ];
}
