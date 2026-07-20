import React, { useCallback, useEffect, useRef } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  ScrollViewProps,
  StyleSheet,
} from "react-native";
import { PurposeEbookCompletionManager } from "@/features/purposeEbook/PurposeEbookCompletionManager";
import { PurposeEbookScrollCompletionDetector } from "@/features/purposeEbook/PurposeEbookScrollCompletionDetector";

interface PurposeEbookReaderScrollProps extends ScrollViewProps {
  chapterId?: string;
}

/** Scroll container with optional chapter-completion tracking. */
export function PurposeEbookReaderScroll({
  chapterId,
  children,
  contentContainerStyle,
  onScroll,
  onContentSizeChange,
  onLayout,
  style,
  ...rest
}: PurposeEbookReaderScrollProps) {
  const metricsRef = useRef({ layoutHeight: 0, contentHeight: 0, offsetY: 0 });
  const completionMarkedRef = useRef(false);

  useEffect(() => {
    completionMarkedRef.current = false;
  }, [chapterId]);

  const applyScrollEvaluation = useCallback(() => {
    if (!chapterId || completionMarkedRef.current) return;

    const evaluation = PurposeEbookScrollCompletionDetector.evaluate(metricsRef.current);
    if (evaluation.measured && evaluation.shouldMarkComplete) {
      completionMarkedRef.current = true;
      PurposeEbookCompletionManager.markChapterComplete(chapterId);
    }
  }, [chapterId]);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      metricsRef.current.offsetY = event.nativeEvent.contentOffset.y;
      applyScrollEvaluation();
      onScroll?.(event);
    },
    [applyScrollEvaluation, onScroll]
  );

  const handleContentSizeChange = useCallback(
    (width: number, height: number) => {
      metricsRef.current.contentHeight = height;
      applyScrollEvaluation();
      onContentSizeChange?.(width, height);
    },
    [applyScrollEvaluation, onContentSizeChange]
  );

  const handleLayout = useCallback(
    (event: Parameters<NonNullable<ScrollViewProps["onLayout"]>>[0]) => {
      metricsRef.current.layoutHeight = event.nativeEvent.layout.height;
      applyScrollEvaluation();
      onLayout?.(event);
    },
    [applyScrollEvaluation, onLayout]
  );

  return (
    <ScrollView
      {...rest}
      style={[styles.scroll, style]}
      contentContainerStyle={contentContainerStyle}
      onScroll={handleScroll}
      onContentSizeChange={handleContentSizeChange}
      onLayout={handleLayout}
      scrollEventThrottle={16}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
});
