import React from "react";
import { StyleSheet, View } from "react-native";
import { OnboardingOption } from "@/features/onboarding/onboarding.types";
import { OnboardingOptionRow } from "./OnboardingOptionRow";

interface OnboardingOptionListProps {
  options: OnboardingOption[];
  spacing?: "normal" | "relaxed" | "loose";
  selectedId?: string;
  selectedIds?: string[];
  multi?: boolean;
  onSelect: (id: string) => void;
}

/** Vertical list of pill answer rows for onboarding questions. */
export function OnboardingOptionList({
  options,
  spacing = "normal",
  selectedId,
  selectedIds = [],
  multi = false,
  onSelect,
}: OnboardingOptionListProps) {
  const gap = spacing === "loose" ? 16 : spacing === "relaxed" ? 14 : 12;
  const isSelected = (id: string) =>
    multi ? selectedIds.includes(id) : selectedId === id;

  return (
    <View style={[styles.wrap, { gap }]}>
      {options.map((option) => (
        <OnboardingOptionRow
          key={option.id}
          label={option.label}
          selected={isSelected(option.id)}
          onPress={() => onSelect(option.id)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    maxWidth: 360,
    alignSelf: "center",
  },
});
