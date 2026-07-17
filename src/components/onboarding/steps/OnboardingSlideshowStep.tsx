import React from "react";
import { Dimensions, FlatList, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { ThemedText } from "@/components/primitives/ThemedText";
import { OnboardingPastelPalette } from "@/features/onboarding/OnboardingPastelPalette";
import { useTheme } from "@/core/theme";
import { OnboardingStep, OnboardingSlide } from "@/features/onboarding/onboarding.types";
import { OnboardingSlideGraphic } from "./OnboardingSlideGraphic";

interface OnboardingSlideshowStepProps {
  step: OnboardingStep;
  onActiveSlideChange?: (index: number) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const PAGE_WIDTH = SCREEN_WIDTH;
const DOT = 8;
const DOT_GAP = 10;

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<OnboardingSlide>);

/** Full-screen red → blue slideshow matching reference layout. */
export function OnboardingSlideshowStep({
  step,
  onActiveSlideChange,
}: OnboardingSlideshowStepProps) {
  const slides = step.slides ?? [];
  const scrollX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / PAGE_WIDTH);
    onActiveSlideChange?.(index);
  };

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: (scrollX.value / PAGE_WIDTH) * (DOT + DOT_GAP) }],
  }));

  const dotTrackWidth = slides.length * DOT + (slides.length - 1) * DOT_GAP;

  return (
    <View style={styles.wrap}>
      <AnimatedFlatList
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => String(i)}
        onScroll={scrollHandler}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={PAGE_WIDTH}
        disableIntervalMomentum
        renderItem={({ item }) => <SlidePage slide={item} />}
      />

      <View style={[styles.dotRow, { width: dotTrackWidth }]}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, { marginRight: index < slides.length - 1 ? DOT_GAP : 0 }]}
          />
        ))}
        <Animated.View style={[styles.dotActive, indicatorStyle]} />
      </View>
    </View>
  );
}

function SlidePage({ slide }: { slide: OnboardingSlide }) {
  const theme = useTheme();
  const pastel = OnboardingPastelPalette.forTone(slide.pastel ?? "default", theme.isDark);
  const textColor = pastel.text;
  const mutedColor = pastel.textMuted;

  return (
    <View style={[styles.page, { width: PAGE_WIDTH, backgroundColor: pastel.bg }]}>
      <View style={styles.upperSpacer} />

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

      <View style={styles.dotSpacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    marginHorizontal: -20,
  },
  page: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 32,
    paddingBottom: 12,
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
  dotRow: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 8,
    position: "relative",
    height: DOT,
  },
  dot: {
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  dotActive: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 22,
    height: DOT,
    borderRadius: DOT / 2,
    backgroundColor: "#FFFFFF",
  },
});
