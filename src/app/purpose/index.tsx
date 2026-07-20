import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "@/core/theme";
import { useHideTabBar } from "@/features/navigation/useHideTabBar";
import { stackBackNavigator } from "@/features/navigation/StackBackNavigator";
import { PurposeEbookCatalog } from "@/features/purposeEbook/PurposeEbookCatalog";
import { PurposeEbookManager } from "@/features/purposeEbook/PurposeEbookManager";
import { PurposeEbookPresenter } from "@/features/purposeEbook/PurposeEbookPresenter";
import { usePurposeEbookCompletion } from "@/features/purposeEbook/purposeEbookCompletionStore";
import { PurposeEbookChrome } from "@/components/purposeEbook/PurposeEbookChrome";
import { PurposeEbookCover } from "@/components/purposeEbook/PurposeEbookCover";
import { PurposeEbookReaderScroll } from "@/components/purposeEbook/PurposeEbookReaderScroll";
import { PurposeEbookTocRow } from "@/components/purposeEbook/PurposeEbookTocRow";
import { ThemedText } from "@/components/primitives/ThemedText";

/** Cover and table of contents for the My Purpose companion guide. */
export default function PurposeEbookCoverScreen() {
  useHideTabBar("purpose-ebook");
  const theme = useTheme();
  const chapters = PurposeEbookPresenter.tocChapters();
  const meta = PurposeEbookPresenter.meta();
  const completedChapterIds = usePurposeEbookCompletion((state) => state.completedChapterIds);

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <PurposeEbookChrome
        title={meta.title}
        onBack={() => stackBackNavigator.goBack()}
      />
      <PurposeEbookReaderScroll
        contentContainerStyle={[
          styles.content,
          { paddingHorizontal: theme.spacing.lg, paddingBottom: theme.spacing.xxxl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <PurposeEbookCover
          chapterCount={PurposeEbookCatalog.count()}
          onBegin={() => PurposeEbookManager.openFirstChapter()}
        />
        <ThemedText variant="heading" style={styles.tocHeading}>
          Table of Contents
        </ThemedText>
        <ThemedText variant="body" color="textSecondary" style={styles.tocIntro}>
          Read one chapter at a time. Come back whenever your heart needs a reminder.
        </ThemedText>
        {chapters.map((chapter) => (
          <PurposeEbookTocRow
            key={chapter.id}
            chapter={chapter}
            isCompleted={completedChapterIds.includes(chapter.id)}
            onPress={(chapterId) => PurposeEbookManager.openChapter(chapterId)}
          />
        ))}
      </PurposeEbookReaderScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingTop: 20 },
  tocHeading: { marginBottom: 8 },
  tocIntro: { marginBottom: 18, lineHeight: 24 },
});
