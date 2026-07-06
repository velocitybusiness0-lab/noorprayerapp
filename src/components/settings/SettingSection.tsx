import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/primitives/ThemedText";
import { Card } from "@/components/primitives/Card";

interface SettingSectionProps {
  title: string;
  children: React.ReactNode;
}

/** Titled group of setting rows inside a surface card. */
export function SettingSection({ title, children }: SettingSectionProps) {
  return (
    <View style={styles.wrap}>
      <ThemedText variant="caption" color="textTertiary" style={styles.title}>
        {title.toUpperCase()}
      </ThemedText>
      <Card>{children}</Card>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 24 },
  title: { marginBottom: 8, marginLeft: 4, letterSpacing: 1 },
});
