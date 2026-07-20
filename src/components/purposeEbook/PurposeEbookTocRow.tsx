import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/core/theme";
import { haptics } from "@/core/haptics/HapticsManager";
import { ThemedText } from "@/components/primitives/ThemedText";
import { PurposeEbookChapter } from "@/features/purposeEbook/purposeEbook.types";
import { PurposeEbookPresenter } from "@/features/purposeEbook/PurposeEbookPresenter";

interface PurposeEbookTocRowProps {
  chapter: PurposeEbookChapter;
  isCompleted: boolean;
  onPress: (chapterId: string) => void;
}

/** Single table-of-contents row for one chapter. */
export function PurposeEbookTocRow({ chapter, isCompleted, onPress }: PurposeEbookTocRowProps) {
  const theme = useTheme();

  const rowBackground = isCompleted ? theme.colors.sageMuted : theme.colors.surface;
  const rowBorder = isCompleted ? theme.colors.border : theme.colors.hairline;
  const numberBackground = isCompleted ? "rgba(107,158,136,0.22)" : theme.colors.sageMuted;
  const titleColor = isCompleted ? "accent" : "textPrimary";
  const labelColor = isCompleted ? "accent" : "textTertiary";

  return (
    <Pressable
      onPress={() => {
        haptics.selection();
        onPress(chapter.id);
      }}
      style={[
        styles.row,
        {
          backgroundColor: rowBackground,
          borderColor: rowBorder,
          borderRadius: theme.radii.lg,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={PurposeEbookPresenter.tocRowAccessibilityLabel(chapter, isCompleted)}
    >
      <View
        style={[
          styles.numberWrap,
          { backgroundColor: numberBackground, borderRadius: theme.radii.md },
        ]}
      >
        <ThemedText variant="bodyStrong" color="accent">
          {String(chapter.number).padStart(2, "0")}
        </ThemedText>
      </View>
      <View style={styles.copy}>
        <ThemedText variant="caption" color={labelColor}>
          {PurposeEbookPresenter.chapterLabel(chapter)}
        </ThemedText>
        <ThemedText variant="bodyStrong" color={titleColor} style={styles.title}>
          {PurposeEbookPresenter.tocRowTitle(chapter)}
        </ThemedText>
      </View>
      {isCompleted ? (
        <View
          style={[
            styles.checkWrap,
            { backgroundColor: theme.colors.accent, borderRadius: theme.radii.pill },
          ]}
        >
          <Ionicons name="checkmark" size={16} color={theme.colors.onAccent} />
        </View>
      ) : (
        <Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 10,
  },
  numberWrap: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  copy: { flex: 1, gap: 4 },
  title: { lineHeight: 22 },
  checkWrap: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
});
