import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useTheme } from "@/core/theme";
import { useHideTabBar } from "@/features/navigation/useHideTabBar";
import { stackBackNavigator } from "@/features/navigation/StackBackNavigator";
import { PurposeEbookCatalog } from "@/features/purposeEbook/PurposeEbookCatalog";
import { PurposeEbookManager } from "@/features/purposeEbook/PurposeEbookManager";
import { PurposeEbookPresenter } from "@/features/purposeEbook/PurposeEbookPresenter";
import { PurposeEbookRoutes } from "@/features/purposeEbook/PurposeEbookRoutes";
import { PurposeEbookChrome } from "@/components/purposeEbook/PurposeEbookChrome";
import { PurposeEbookChapterView } from "@/components/purposeEbook/PurposeEbookChapterView";
import { PurposeEbookReaderScroll } from "@/components/purposeEbook/PurposeEbookReaderScroll";
import { ThemedText } from "@/components/primitives/ThemedText";
import { Button } from "@/components/primitives/Button";

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/** Single-chapter reader with previous, next, and TOC navigation. */
export default function PurposeEbookChapterScreen() {
  useHideTabBar("purpose-ebook-chapter");
  const theme = useTheme();
  const params = useLocalSearchParams<{ chapterId?: string }>();
  const chapterId = firstParam(params.chapterId) ?? "";

  const chapter = useMemo(() => PurposeEbookCatalog.byId(chapterId), [chapterId]);
  const adjacent = useMemo(
    () => PurposeEbookPresenter.adjacentIds(chapterId),
    [chapterId]
  );

  if (!chapter) {
    return (
      <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
        <PurposeEbookChrome
          title="Chapter"
          onBack={() => stackBackNavigator.goBack(PurposeEbookRoutes.cover())}
        />
        <View style={styles.missing}>
          <ThemedText variant="body" color="textSecondary">
            This chapter could not be found.
          </ThemedText>
          <Button
            label="Back to contents"
            onPress={() => router.replace(PurposeEbookRoutes.cover())}
            style={styles.missingBtn}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <PurposeEbookChrome
        title={PurposeEbookPresenter.chapterLabel(chapter)}
        onBack={() => stackBackNavigator.goBack(PurposeEbookRoutes.cover())}
      />
      <PurposeEbookReaderScroll
        chapterId={chapter.id}
        contentContainerStyle={[
          styles.content,
          { paddingHorizontal: theme.spacing.lg, paddingBottom: theme.spacing.xxxl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <PurposeEbookChapterView
          chapter={chapter}
          hasPrevious={Boolean(adjacent.previousId)}
          hasNext={Boolean(adjacent.nextId)}
          onPrevious={() => PurposeEbookManager.goToAdjacent(chapter.id, "previous")}
          onNext={() => PurposeEbookManager.goToAdjacent(chapter.id, "next")}
          onBackToToc={() => router.replace(PurposeEbookRoutes.cover())}
        />
      </PurposeEbookReaderScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingTop: 24 },
  missing: { padding: 24, gap: 16 },
  missingBtn: { alignSelf: "flex-start" },
});
