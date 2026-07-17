import { OnboardingStep } from "../onboarding.types";

export const ONBOARDING_SETUP_STEPS: OnboardingStep[] = [
  {
    id: "proud-one-year",
    type: "multi-choice",
    title: "What would make you proud one year from now?",
    layout: "stack-3",
    requiresSelection: true,
    options: [
      { id: "discipline", label: "Build discipline" },
      { id: "allah", label: "Strengthen my relationship with Allah" },
      { id: "five-salah", label: "Pray all 5 salah" },
      { id: "goals", label: "Achieve my goals" },
    ],
  },
  {
    id: "track-goals",
    type: "multi-choice",
    title: "How do you track your goals?",
    layout: "stack-3",
    optionSpacing: "loose",
    requiresSelection: true,
    options: [
      { id: "none", label: "I don't" },
      { id: "mental", label: "Mental notes" },
      { id: "notes", label: "Notes app" },
    ],
  },
  {
    id: "want-change",
    type: "multi-choice",
    title: "How badly do you want to change?",
    layout: "grid-2",
    requiresSelection: true,
    options: [
      { id: "cant-explain", label: "I can't explain how much" },
      { id: "more-than-ever", label: "More than ever" },
    ],
  },
  {
    id: "miraj-help",
    type: "feature-slideshow",
    title: "Allow Miraj to help you",
    continueLabel: "Allow and continue",
    features: [
      {
        icon: "notifications-outline",
        title: "Smart prayer reminders",
        body: "Gentle nudges at salah time so you never drift.",
      },
      {
        icon: "shield-outline",
        title: "Distraction blocking",
        body: "Block apps at prayer time. Scan to unblock when you're ready.",
      },
      {
        icon: "flame-outline",
        title: "Progress tracking",
        body: "Streaks and goals that keep you moving forward.",
      },
      {
        icon: "location-outline",
        title: "Accurate prayer times",
        body: "Location for precise times and qibla direction.",
      },
      {
        icon: "camera-outline",
        title: "Scan to confirm",
        body: "Camera for object hunt when dismissing alarms.",
      },
    ],
  },
  {
    id: "name",
    type: "name",
    title: "What can we call you?",
    body: "We will use this to personalize your experience.",
    continueLabel: "Continue",
    pastel: "white",
  },
  {
    id: "faith-prayer",
    type: "message",
    title: "Every prayer is a chance to come back",
    body: "Missing prayers doesn't define you. What matters is the effort to improve today.",
    pastel: "white",
  },
  {
    id: "calculation",
    type: "calculation",
    title: "Building your plan",
    calculationDurationMs: 6000,
    calculationQuotes: [
      {
        title: "Every return begins with one sincere step",
        source: "Miraj Reflection",
      },
      {
        title: "Allah opens doors when you decide to come back",
        source: "Reminder",
      },
      {
        title: "Small acts done consistently can rebuild a life",
        source: "Daily Discipline",
      },
    ],
  },
  {
    id: "bad-news",
    type: "downtrend",
    title: "A few habits may be holding you back",
    bullets: [
      "Inconsistent prayer habits",
      "Lack of structure",
      "Difficulty staying disciplined",
    ],
    continueLabel: "Continue",
  },
  {
    id: "urgency-hope-slides",
    type: "slideshow",
    slides: [
      {
        graphic: "domino",
        title: "Missing salah compounds fast",
        body: "One missed prayer leads to another. Poor choices stack up, your discipline weakens, and you find yourself slipping further from where you want to be.",
        pastel: "hardRed",
      },
      {
        graphic: "hourglass",
        title: "This is your moment",
        body: "Don't guilt trip yourself. Just create urgency. Today can be different.",
        pastel: "hardRed",
      },
      {
        graphic: "summit",
        title: "Success is a journey",
        body: "Every step forward counts. With the right system and consistent effort, you'll build the discipline to transform your salah and become your best self.",
        checks: [
          "Praying all 5 salah",
          "Better discipline",
          "More peace of mind",
          "Stronger connection with Allah",
        ],
        pastel: "deepBlue",
      },
    ],
    pastel: "hardRed",
  },
  {
    id: "green-hope",
    type: "hope-screen",
    title: "You can change",
    body: "Allah never lets you down. Your next salah is still waiting for you, and every day is a fresh chance to show up.",
    continueLabel: "Continue",
    pastel: "green",
  },
  {
    id: "plan-ambition",
    type: "multi-choice",
    title: "How ambitious should your plan be?",
    layout: "stack-3",
    optionSpacing: "loose",
    requiresSelection: true,
    options: [
      { id: "gentle", label: "Gentle start" },
      { id: "balanced", label: "Balanced" },
      { id: "full", label: "Full commitment" },
    ],
  },
  {
    id: "choose-goals",
    type: "multi-choice",
    title: "Choose your goals",
    layout: "stack-3",
    optionSpacing: "loose",
    requiresSelection: true,
    options: [
      { id: "five-daily", label: "Pray all 5 daily prayers" },
      { id: "discipline", label: "Build discipline" },
      { id: "quran", label: "Read Quran daily" },
      { id: "dhikr", label: "Remember Allah more" },
    ],
  },
  {
    id: "streak",
    type: "streak",
    title: "Stay motivated with a consistent daily routine",
    body: "Build a streak, one day at a time.",
    continueLabel: "Start my journey",
    pastel: "white",
  },
];
