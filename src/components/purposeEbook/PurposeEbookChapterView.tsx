import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/primitives/ThemedText";
import { Button } from "@/components/primitives/Button";
import { PurposeEbookChapter } from "@/features/purposeEbook/purposeEbook.types";
import { PurposeEbookPresenter } from "@/features/purposeEbook/PurposeEbookPresenter";

interface PurposeEbookChapterViewProps {
  chapter: PurposeEbookChapter;
  hasPrevious: boolean;
  hasNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onBackToToc: () => void;
}

/** Calm chapter reader with section headings and next/prev controls. */
export function PurposeEbookChapterView({
  chapter,
  hasPrevious,
  hasNext,
  onPrevious,
  onNext,
  onBackToToc,
}: PurposeEbookChapterViewProps) {
  return (
    <View style={styles.wrap}>
      <ThemedText variant="caption" color="textTertiary" style={styles.progress}>
        {PurposeEbookPresenter.progressLabel(chapter)}
      </ThemedText>
      <ThemedText variant="caption" color="accent" style={styles.chapterLabel}>
        {PurposeEbookPresenter.chapterLabel(chapter)}
      </ThemedText>
      <ThemedText variant="title" style={styles.title}>
        {chapter.title}
      </ThemedText>

      {chapter.sections.map((section, index) => (
        <View key={`${chapter.id}-section-${index}`} style={styles.section}>
          {section.heading ? (
            <ThemedText variant="heading" style={styles.sectionHeading}>
              {section.heading}
            </ThemedText>
          ) : null}
          {section.paragraphs.map((paragraph, paragraphIndex) => (
            <ThemedText
              key={`${chapter.id}-p-${index}-${paragraphIndex}`}
              variant="body"
              color="textSecondary"
              style={styles.paragraph}
            >
              {paragraph}
            </ThemedText>
          ))}
        </View>
      ))}

      <View style={styles.nav}>
        <Button
          label="Previous"
          variant="secondary"
          onPress={onPrevious}
          disabled={!hasPrevious}
          style={styles.navBtn}
        />
        <Button
          label={hasNext ? "Next chapter" : "Back to contents"}
          onPress={hasNext ? onNext : onBackToToc}
          style={styles.navBtn}
        />
      </View>
      <Button label="Table of contents" variant="ghost" onPress={onBackToToc} style={styles.toc} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingBottom: 40 },
  progress: { marginBottom: 8, letterSpacing: 0.4 },
  chapterLabel: { marginBottom: 8, letterSpacing: 0.6, textTransform: "uppercase" },
  title: { marginBottom: 28, lineHeight: 38 },
  section: { marginBottom: 28 },
  sectionHeading: { marginBottom: 12, lineHeight: 28 },
  paragraph: { marginBottom: 14, lineHeight: 26 },
  nav: { flexDirection: "row", gap: 12, marginTop: 8 },
  navBtn: { flex: 1 },
  toc: { marginTop: 8 },
});
