import { DuaCategoryId } from "../dua.types";

/** Pastel browse-card presentation for the My Duas category grid. */
export interface DuaBrowseCategoryStyle {
  id: DuaCategoryId;
  shortLabel: string;
  icon: string;
  pastelBg: string;
  iconColor: string;
}

/** Browse categories shown in a 3-per-row grid on My Duas. */
export const DUA_BROWSE_CATEGORIES: DuaBrowseCategoryStyle[] = [
  {
    id: "health",
    shortLabel: "Health",
    icon: "heart-outline",
    pastelBg: "#E8F5E9",
    iconColor: "#4A7C59",
  },
  {
    id: "wealth",
    shortLabel: "Wealth",
    icon: "wallet-outline",
    pastelBg: "#FFF8E1",
    iconColor: "#B8860B",
  },
  {
    id: "protection",
    shortLabel: "Protection",
    icon: "shield-outline",
    pastelBg: "#E3F2FD",
    iconColor: "#3A6EA5",
  },
  {
    id: "family",
    shortLabel: "Family",
    icon: "people-outline",
    pastelBg: "#F3E5F5",
    iconColor: "#7B5EA7",
  },
  {
    id: "forgiveness",
    shortLabel: "Forgiveness",
    icon: "hand-left-outline",
    pastelBg: "#FFEBEE",
    iconColor: "#C45C6A",
  },
  {
    id: "travel",
    shortLabel: "Travel",
    icon: "airplane-outline",
    pastelBg: "#E0F7FA",
    iconColor: "#00838F",
  },
  {
    id: "morning-evening",
    shortLabel: "Morning",
    icon: "partly-sunny-outline",
    pastelBg: "#FFF3E0",
    iconColor: "#E65100",
  },
  {
    id: "sleep",
    shortLabel: "Sleep",
    icon: "moon-outline",
    pastelBg: "#EDE7F6",
    iconColor: "#5E35B1",
  },
  {
    id: "food",
    shortLabel: "Food",
    icon: "restaurant-outline",
    pastelBg: "#FBE9E7",
    iconColor: "#BF360C",
  },
];
