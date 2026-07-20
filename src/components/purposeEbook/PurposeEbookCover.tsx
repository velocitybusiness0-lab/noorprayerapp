import React from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/core/theme";
import { ThemedText } from "@/components/primitives/ThemedText";
import { Button } from "@/components/primitives/Button";
import { PurposeEbookPresenter } from "@/features/purposeEbook/PurposeEbookPresenter";

interface PurposeEbookCoverProps {
  chapterCount: number;
  onBegin: () => void;
}

/** Book cover hero above the table of contents. */
export function PurposeEbookCover({ chapterCount, onBegin }: PurposeEbookCoverProps) {
  const theme = useTheme();
  const meta = PurposeEbookPresenter.meta();

  return (
    <View style={styles.wrap}>
      <LinearGradient
        colors={[theme.colors.sageMuted, theme.colors.sand, theme.colors.background]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={[styles.panel, { borderRadius: theme.radii.xl }]}
      >
        <ThemedText variant="caption" color="textSecondary" style={styles.eyebrow}>
          Companion guide
        </ThemedText>
        <ThemedText variant="title" style={styles.title}>
          {meta.title}
        </ThemedText>
        <ThemedText variant="body" color="textSecondary" style={styles.subtitle}>
          {meta.subtitle}
        </ThemedText>
        <ThemedText variant="caption" color="textTertiary" style={styles.count}>
          {`${chapterCount} chapters`}
        </ThemedText>
        <Button label="Begin reading" onPress={onBegin} style={styles.cta} />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 28 },
  panel: {
    paddingVertical: 36,
    paddingHorizontal: 28,
    minHeight: 260,
    justifyContent: "center",
  },
  eyebrow: {
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 14,
  },
  title: {
    marginBottom: 10,
    lineHeight: 38,
  },
  subtitle: {
    lineHeight: 26,
    marginBottom: 18,
    maxWidth: 280,
  },
  count: { marginBottom: 22 },
  cta: { alignSelf: "flex-start" },
});
