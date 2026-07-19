import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  LayoutChangeEvent,
  StyleSheet,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
} from "react-native-reanimated";
import { ThemedText } from "@/components/primitives/ThemedText";
import { OnboardingPageDotIndicator } from "@/components/onboarding/OnboardingPageDotIndicator";
import {
  ONBOARDING_INK,
  OnboardingPastelPalette,
} from "@/features/onboarding/OnboardingPastelPalette";
import { OnboardingSlideshowController } from "@/features/onboarding/OnboardingSlideshowController";
import { useTheme } from "@/core/theme";
import { OnboardingStep, OnboardingSlide } from "@/features/onboarding/onboarding.types";
import { OnboardingSlideGraphic } from "./OnboardingSlideGraphic";

interface OnboardingSlideshowStepProps {
  step: OnboardingStep;
  activeSlideIndex: number;
  onActiveSlideChange?: (index: number) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const PAGE_WIDTH = SCREEN_WIDTH;

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<OnboardingSlide>);

/**
 * Full-bleed onboarding slideshow (urgency narrative or Miraj welcome).
 * Pages are transparent so shell pastel owns the background.
 */
export function OnboardingSlideshowStep({
  step,
  activeSlideIndex,
  onActiveSlideChange,
}: OnboardingSlideshowStepProps) {
  const slides = step.slides ?? [];
  const listRef = useRef<FlatList<OnboardingSlide>>(null);
  const reportedIndexRef = useRef(activeSlideIndex);
  const [pageHeight, setPageHeight] = useState(0);
  const centerContent = step.contentPlacement === "center";
  const activePastel = OnboardingSlideshowController.pastelAt(
    slides,
    activeSlideIndex,
    step.pastel ?? "hardRed"
  );
  const darkDots = OnboardingPastelPalette.isDarkTone(activePastel);

  useEffect(() => {
    if (reportedIndexRef.current === activeSlideIndex) return;
    reportedIndexRef.current = activeSlideIndex;
    listRef.current?.scrollToOffset({
      offset: activeSlideIndex * PAGE_WIDTH,
      animated: true,
    });
  }, [activeSlideIndex]);

  const emitIndex = (index: number) => {
    const safeIndex = OnboardingSlideshowController.clampIndex(index, slides.length);
    if (safeIndex === reportedIndexRef.current) return;
    reportedIndexRef.current = safeIndex;
    onActiveSlideChange?.(safeIndex);
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const index = Math.round(event.contentOffset.x / PAGE_WIDTH);
      runOnJS(emitIndex)(index);
    },
  });

  const onListLayout = (event: LayoutChangeEvent) => {
    const next = Math.round(event.nativeEvent.layout.height);
    if (next > 0 && next !== pageHeight) setPageHeight(next);
  };

  return (
    <View style={styles.wrap}>
      {step.brandLabel && !centerContent ? (
        <ThemedText variant="title" style={styles.brand}>
          {step.brandLabel}
        </ThemedText>
      ) : null}

      <AnimatedFlatList
        ref={listRef}
        style={styles.list}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => String(i)}
        onScroll={scrollHandler}
        onLayout={onListLayout}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={PAGE_WIDTH}
        disableIntervalMomentum
        getItemLayout={(_, index) => ({
          length: PAGE_WIDTH,
          offset: PAGE_WIDTH * index,
          index,
        })}
        renderItem={({ item }) => (
          <SlidePage
            slide={item}
            centerContent={centerContent}
            brandLabel={centerContent ? step.brandLabel : undefined}
            height={pageHeight}
          />
        )}
      />

      <View style={styles.dotsWrap}>
        <OnboardingPageDotIndicator
          count={slides.length}
          activeIndex={activeSlideIndex}
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
  centerContent: boolean;
  brandLabel?: string;
  height: number;
}

function SlidePage({ slide, centerContent, brandLabel, height }: SlidePageProps) {
  const theme = useTheme();
  const pastel = OnboardingPastelPalette.forTone(slide.pastel ?? "default", theme.isDark);
  const textColor = pastel.text;
  const mutedColor = pastel.textMuted;

  return (
    <View
      style={[
        styles.page,
        centerContent && styles.pageCentered,
        { width: PAGE_WIDTH, height: height > 0 ? height : undefined },
      ]}
    >
      {!centerContent ? <View style={styles.upperSpacer} /> : null}

      {brandLabel ? (
        <ThemedText variant="title" style={[styles.brandInline, { color: textColor }]}>
          {brandLabel}
        </ThemedText>
      ) : null}

      {slide.graphic ? (
        <View style={styles.graphicWrap}>
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
      ) : null}

      <View style={styles.textBlock}>
        {slide.title ? (
          <ThemedText variant="title" style={[styles.title, { color: textColor }]}>
            {slide.title}
          </ThemedText>
        ) : null}

        {slide.body ? (
          <ThemedText variant="body" style={[styles.body, { color: mutedColor }]}>
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
    paddingBottom: 24,
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
  textBlock: {
    alignItems: "center",
    width: "100%",
    marginTop: 8,
  },
  title: {
    textAlign: "center",
    fontSize: 26,
    lineHeight: 32,
    marginBottom: 16,
  },
  body: {
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 320,
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
