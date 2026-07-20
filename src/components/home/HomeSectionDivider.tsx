import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "@/core/theme";

/** Faint hairline between major home-tab sections. */
export function HomeSectionDivider() {
  const theme = useTheme();

  return (
    <View style={[styles.line, { backgroundColor: theme.colors.hairline }]} />
  );
}

const styles = StyleSheet.create({
  line: {
    height: StyleSheet.hairlineWidth,
    alignSelf: "stretch",
    marginTop: 20,
    marginBottom: 4,
  },
});
