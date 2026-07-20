import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ImpactFeedbackStyle } from "expo-haptics";
import { ThemedText } from "@/components/primitives/ThemedText";
import { OnboardingPageDotIndicator } from "@/components/onboarding/OnboardingPageDotIndicator";
import {
  ONBOARDING_INK,
  OnboardingPastelPalette,
} from "@/features/onboarding/OnboardingPastelPalette";
import { OnboardingSlideshowController } from "@/features/onboarding/OnboardingSlideshowController";
import { OnboardingSlideshowPagerScroller } from "@/features/onboarding/OnboardingSlideshowPagerScroller";
import { haptics } from "@/core/haptics/HapticsManager";
import { useTheme } from "@/core/theme";
import { OnboardingStep, OnboardingSlide } from "@/features/onboarding/onboarding.types";
import { OnboardingSlideGraphic } from "./OnboardingSlideGraphic";

export interface OnboardingSlideshowStepHandle {
  /** Scrolls to the next slide; returns false when already on the last slide. */
  scrollToNext: () => boolean;
}

interface OnboardingSlideshowStepProps {
  step: OnboardingStep;
  activeSlideIndex: number;
  onActiveSlideChange?: (index: number) => void;
}

/**
 * Horizontal swipe pager for urgency / Miraj welcome slides.
 * Shell pastel syncs from scroll events so red→blue never flashes early.
 */
export const OnboardingSlideshowStep = forwardRef<
  OnboardingSlideshowStepHandle,
  OnboardingSlideshowStepProps
>(function OnboardingSlideshowStep(
  { step, activeSlideIndex, onActiveSlideChange },
  ref
) {
  const slides = step.slides ?? [];
  const centerContent = step.contentPlacement === "center";
  const brandAtTop = Boolean(step.brandLabel);
  const listRef = useRef<FlatList<OnboardingSlide>>(null);
  const reportedIndexRef = useRef(
    OnboardingSlideshowController.clampIndex(activeSlideIndex, slides.length)
  );
  const layoutReadyRef = useRef(false);
  const pageWidthRef = useRef(0);
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
  const dotColor = darkDots ? "#FFFFFF" : ONBOARDING_INK;

  useEffect(() => {
    reportedIndexRef.current = OnboardingSlideshowController.clampIndex(
      activeSlideIndex,
      slides.length
    );
  }, [activeSlideIndex, slides.length]);

  // Invalidate reported index when the slideshow step changes so the pager
  // scroll effect cannot early-return while FlatList still shows the prior offset.
  useEffect(() => {
    reportedIndexRef.current = -1;
  }, [step.id]);

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
      false
    );
  }, [pageWidth, safeIndex, slides.length, step.id]);

  const emitIndex = useCallback(
    (index: number, fromUserSwipe: boolean) => {
      const next = OnboardingSlideshowController.clampIndex(index, slides.length);
      if (next === reportedIndexRef.current) return;
      reportedIndexRef.current = next;
      if (fromUserSwipe) {
        haptics.impact(ImpactFeedbackStyle.Light);
      }
      onActiveSlideChange?.(next);
    },
    [onActiveSlideChange, slides.length]
  );

  const syncIndexFromOffset = useCallback(
    (offsetX: number, fromUserSwipe: boolean) => {
      if (pageWidthRef.current <= 0) return;
      emitIndex(
        OnboardingSlideshowController.indexFromOffset(offsetX, pageWidthRef.current),
        fromUserSwipe
      );
    },
    [emitIndex]
  );

  const onMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      syncIndexFromOffset(event.nativeEvent.contentOffset.x, true);
    },
    [syncIndexFromOffset]
  );

  const onScrollToIndexFailed = useCallback(
    (info: { index: number; averageItemLength: number }) => {
      OnboardingSlideshowPagerScroller.retryFailedIndex(
        listRef.current,
        info.index,
        slides.length,
        pageWidthRef.current,
        info.averageItemLength
      );
    },
    [slides.length]
  );

  useImperativeHandle(
    ref,
    () => ({
      scrollToNext: () => {
        const count = slides.length;
        const current = reportedIndexRef.current;
        const next = OnboardingSlideshowController.nextSlideIndex(current, count);
        if (next === null) return false;
        if (!OnboardingSlideshowPagerScroller.canScroll(pageWidthRef.current, count)) {
          return false;
        }
        OnboardingSlideshowPagerScroller.scrollToIndex(
          listRef.current,
          next,
          count,
          pageWidthRef.current,
          true
        );
        return true;
      },
    }),
    [slides.length]
  );

  if (slides.length === 0) return null;

  return (
    <View style={styles.wrap}>
      {brandAtTop ? (
        <ThemedText variant="title" style={[styles.brandTop, { color: dotColor }]}>
          {step.brandLabel}
        </ThemedText>
      ) : null}

      <View
        style={styles.list}
        onLayout={(event) => {
          const { width, height } = event.nativeEvent.layout;
          if (width > 0) {
            pageWidthRef.current = width;
            if (width !== pageWidth) setPageWidth(width);
            layoutReadyRef.current = true;
          }
          if (height > 0 && height !== pageHeight) setPageHeight(height);
        }}
      >
        {pageWidth > 0 ? (
          <FlatList
            key={step.id}
            ref={listRef}
            data={slides}
            horizontal
            pagingEnabled
            bounces={false}
            decelerationRate="fast"
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
            onMomentumScrollEnd={onMomentumScrollEnd}
            onScrollToIndexFailed={onScrollToIndexFailed}
            initialScrollIndex={safeIndex > 0 ? safeIndex : undefined}
            extraData={`${step.id}:${safeIndex}`}
            renderItem={({ item }) => (
              <SlidePage
                slide={item}
                width={pageWidth}
                height={pageHeight}
                centerContent={centerContent}
              />
            )}
          />
        ) : null}
      </View>

      <View style={styles.dotsWrap}>
        <OnboardingPageDotIndicator
          count={slides.length}
          activeIndex={safeIndex}
          activeColor={dotColor}
          inactiveColor={darkDots ? "rgba(255,255,255,0.35)" : "rgba(61,56,50,0.22)"}
        />
      </View>
    </View>
  );
});

interface SlidePageProps {
  slide: OnboardingSlide;
  width: number;
  height: number;
  centerContent: boolean;
}

function SlidePage({ slide, width, height, centerContent }: SlidePageProps) {
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
      {visual}

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
  brandTop: {
    textAlign: "center",
    marginTop: 4,
    marginBottom: 8,
    letterSpacing: 0.4,
    fontSize: 22,
    lineHeight: 28,
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
    paddingBottom: 20,
  },
  upperSpacer: {
    height: 28,
  },
  iconWrap: {
    marginBottom: 20,
  },
  graphicWrap: {
    marginBottom: 16,
  },
  graphicWrapCentered: {
    marginBottom: 18,
  },
  textBlock: {
    alignItems: "center",
    width: "100%",
    marginTop: 8,
  },
  textBlockCentered: {
    marginTop: 4,
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
    minHeight: 12,
  },
  dotsWrap: {
    marginBottom: 8,
  },
});
