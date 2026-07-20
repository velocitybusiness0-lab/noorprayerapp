import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/primitives/ThemedText";
import { OnboardingPageDotIndicator } from "@/components/onboarding/OnboardingPageDotIndicator";
import {
  ONBOARDING_INK,
  OnboardingPastelPalette,
} from "@/features/onboarding/OnboardingPastelPalette";
import { OnboardingSlideshowController } from "@/features/onboarding/OnboardingSlideshowController";
import { OnboardingSlideshowPagerScroller } from "@/features/onboarding/OnboardingSlideshowPagerScroller";
import { useTheme } from "@/core/theme";
import { OnboardingStep, OnboardingSlide } from "@/features/onboarding/onboarding.types";
import { OnboardingSlideGraphic } from "./OnboardingSlideGraphic";

interface OnboardingSlideshowStepProps {
  step: OnboardingStep;
  activeSlideIndex: number;
  onActiveSlideChange?: (index: number) => void;
}

/**
 * Horizontal swipe pager for urgency / Miraj welcome slides.
 * Progress / Continue chrome stay in the shell; only slide pages move.
 */
export function OnboardingSlideshowStep({
  step,
  activeSlideIndex,
  onActiveSlideChange,
}: OnboardingSlideshowStepProps) {
  const slides = step.slides ?? [];
  const centerContent = step.contentPlacement === "center";
  const listRef = useRef<FlatList<OnboardingSlide>>(null);
  const reportedIndexRef = useRef(
    OnboardingSlideshowController.clampIndex(activeSlideIndex, slides.length)
  );
  const layoutReadyRef = useRef(false);
  const [pageWidth, setPageWidth] = useState(0);
  const [pageHeight, setPageHeight] = useState(0);
  const safeIndex = OnboardingSlideshowController.clampIndex(
    activeSlideIndex,
    slides.length
  );
  const activePastel = OnboardingSlideshowController.pastelAt(
    slides,
    safeIndex,
    step.pastel ?? "hardRed"
  );
  const darkDots = OnboardingPastelPalette.isDarkTone(activePastel);

  useEffect(() => {
    reportedIndexRef.current = OnboardingSlideshowController.clampIndex(
      activeSlideIndex,
      slides.length
    );
  }, [step.id, slides.length]);

  useEffect(() => {
    if (!layoutReadyRef.current) return;
    if (!OnboardingSlideshowPagerScroller.canScroll(pageWidth, slides.length)) {
      return;
    }
    if (reportedIndexRef.current === safeIndex) return;
    reportedIndexRef.current = safeIndex;
    OnboardingSlideshowPagerScroller.scrollToIndex(
      listRef.current,
      safeIndex,
      slides.length,
      pageWidth,
      true
    );
  }, [pageWidth, safeIndex, slides.length]);

  const emitIndex = useCallback(
    (index: number) => {
      const next = OnboardingSlideshowController.clampIndex(index, slides.length);
      if (next === reportedIndexRef.current) return;
      reportedIndexRef.current = next;
      onActiveSlideChange?.(next);
    },
    [onActiveSlideChange, slides.length]
  );

  const syncIndexFromOffset = useCallback(
    (offsetX: number) => {
      if (pageWidth <= 0) return;
      emitIndex(
        OnboardingSlideshowController.indexFromOffset(offsetX, pageWidth)
      );
    },
    [emitIndex, pageWidth]
  );

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      syncIndexFromOffset(event.nativeEvent.contentOffset.x);
    },
    [syncIndexFromOffset]
  );

  const onMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      syncIndexFromOffset(event.nativeEvent.contentOffset.x);
    },
    [syncIndexFromOffset]
  );

  const onScrollToIndexFailed = useCallback(
    (info: { index: number; averageItemLength: number }) => {
      OnboardingSlideshowPagerScroller.retryFailedIndex(
        listRef.current,
        info.index,
        slides.length,
        pageWidth,
        info.averageItemLength
      );
    },
    [pageWidth, slides.length]
  );

  if (slides.length === 0) return null;

  return (
    <View style={styles.wrap}>
      {step.brandLabel && !centerContent ? (
        <ThemedText variant="title" style={styles.brand}>
          {step.brandLabel}
        </ThemedText>
      ) : null}

      <View
        style={styles.list}
        onLayout={(event) => {
          const { width, height } = event.nativeEvent.layout;
          if (width > 0 && width !== pageWidth) setPageWidth(width);
          if (height > 0 && height !== pageHeight) setPageHeight(height);
          if (width > 0) layoutReadyRef.current = true;
        }}
      >
        {pageWidth > 0 ? (
          <FlatList
            ref={listRef}
            data={slides}
            horizontal
            pagingEnabled
            bounces={false}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => `${step.id}-${index}`}
            style={{ width: pageWidth }}
            getItemLayout={(_, index) => ({
              length: pageWidth,
              offset: OnboardingSlideshowPagerScroller.offsetForIndex(
                index,
                pageWidth
              ),
              index,
            })}
            onScroll={onScroll}
            scrollEventThrottle={16}
            onMomentumScrollEnd={onMomentumScrollEnd}
            onScrollToIndexFailed={onScrollToIndexFailed}
            initialScrollIndex={safeIndex > 0 ? safeIndex : undefined}
            extraData={safeIndex}
            renderItem={({ item }) => (
              <SlidePage
                slide={item}
                width={pageWidth}
                height={pageHeight}
                centerContent={centerContent}
                brandLabel={centerContent ? step.brandLabel : undefined}
              />
            )}
          />
        ) : null}
      </View>

      <View style={styles.dotsWrap}>
        <OnboardingPageDotIndicator
          count={slides.length}
          activeIndex={safeIndex}
          activeColor={darkDots ? "#FFFFFF" : ONBOARDING_INK}
          inactiveColor={
            darkDots ? "rgba(255,255,255,0.35)" : "rgba(61,56,50,0.22)"
          }
        />
      </View>
    </View>
  );
}

interface SlidePageProps {
  slide: OnboardingSlide;
  width: number;
  height: number;
  centerContent: boolean;
  brandLabel?: string;
}

function SlidePage({
  slide,
  width,
  height,
  centerContent,
  brandLabel,
}: SlidePageProps) {
  const theme = useTheme();
  const pastel = OnboardingPastelPalette.forTone(slide.pastel ?? "default", theme.isDark);
  const textColor = pastel.text;
  const mutedColor = pastel.textMuted;
  const visual = slide.graphic ? (
    <View style={[styles.graphicWrap, centerContent && styles.graphicWrapCentered]}>
      <OnboardingSlideGraphic type={slide.graphic} />
    </View>
  ) : slide.icon ? (
    <View style={styles.iconWrap}>
      <Ionicons
        name={slide.icon as keyof typeof Ionicons.glyphMap}
        size={88}
        color={textColor}
      />
    </View>
  ) : null;

  return (
    <View
      style={[
        styles.page,
        centerContent && styles.pageCentered,
        { width, height: height > 0 ? height : undefined },
      ]}
    >
      {!centerContent ? <View style={styles.upperSpacer} /> : null}

      {centerContent ? visual : null}

      {brandLabel ? (
        <ThemedText
          variant="title"
          style={[
            styles.brandInline,
            centerContent && styles.brandInlineCentered,
            { color: textColor },
          ]}
        >
          {brandLabel}
        </ThemedText>
      ) : null}

      {!centerContent ? visual : null}

      <View style={[styles.textBlock, centerContent && styles.textBlockCentered]}>
        {slide.title ? (
          <ThemedText
            variant="title"
            style={[
              styles.title,
              centerContent && styles.titleCentered,
              { color: textColor },
            ]}
          >
            {slide.title}
          </ThemedText>
        ) : null}

        {slide.body ? (
          <ThemedText
            variant="body"
            style={[
              styles.body,
              centerContent && styles.bodyCentered,
              { color: mutedColor },
            ]}
          >
            {slide.body}
          </ThemedText>
        ) : null}

        {slide.checks?.length ? (
          <View style={styles.checks}>
            {slide.checks.map((line) => (
              <ThemedText key={line} variant="bodyStrong" style={{ color: textColor }}>
                ✓ {line}
              </ThemedText>
            ))}
          </View>
        ) : null}
      </View>

      {!centerContent ? <View style={styles.dotSpacer} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    marginHorizontal: -20,
  },
  brand: {
    color: ONBOARDING_INK,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 4,
    letterSpacing: 0.4,
  },
  brandInline: {
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: 0.4,
  },
  brandInlineCentered: {
    fontSize: 22,
    lineHeight: 28,
    marginTop: 4,
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  list: {
    flex: 1,
  },
  page: {
    alignItems: "center",
    paddingHorizontal: 32,
    paddingBottom: 12,
  },
  pageCentered: {
    justifyContent: "center",
    paddingHorizontal: 36,
    paddingBottom: 28,
  },
  upperSpacer: {
    height: 36,
  },
  iconWrap: {
    marginBottom: 20,
  },
  graphicWrap: {
    marginBottom: 16,
  },
  graphicWrapCentered: {
    marginBottom: 20,
  },
  textBlock: {
    alignItems: "center",
    width: "100%",
    marginTop: 8,
  },
  textBlockCentered: {
    marginTop: 0,
  },
  title: {
    textAlign: "center",
    fontSize: 26,
    lineHeight: 32,
    marginBottom: 16,
  },
  titleCentered: {
    fontSize: 28,
    lineHeight: 34,
    marginBottom: 14,
  },
  body: {
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 320,
  },
  bodyCentered: {
    lineHeight: 25,
    maxWidth: 300,
  },
  checks: {
    marginTop: 20,
    gap: 10,
    alignItems: "center",
  },
  dotSpacer: {
    flex: 1,
    minHeight: 16,
  },
  dotsWrap: {
    marginBottom: 8,
  },
});
