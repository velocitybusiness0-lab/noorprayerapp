import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from "react-native";
import { useTheme } from "@/core/theme";
import { ThemedText } from "@/components/primitives/ThemedText";
import { OnboardingPastelPalette } from "@/features/onboarding/OnboardingPastelPalette";
import { OnboardingStep, OnboardingSlide } from "@/features/onboarding/onboarding.types";

interface OnboardingFaithSlideshowStepProps {
  step: OnboardingStep;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");

/** Faith messages as swipeable slideshow. */
export function OnboardingFaithSlideshowStep({ step }: OnboardingFaithSlideshowStepProps) {
  const theme = useTheme();
  const slides = step.slides ?? [];
  const [index, setIndex] = useState(0);

  const onScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(event.nativeEvent.contentOffset.x / (SCREEN_WIDTH - 48));
    setIndex(next);
  };

  return (
    <View style={styles.wrap}>
      <FlatList
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => String(i)}
        onMomentumScrollEnd={onScrollEnd}
        snapToInterval={SCREEN_WIDTH - 48}
        decelerationRate="fast"
        renderItem={({ item }) => (
          <FaithSlide slide={item} isDark={theme.isDark} />
        )}
      />

      <View style={styles.dots}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor:
                  i === index ? theme.colors.accent : theme.colors.hairline,
                width: i === index ? 20 : 8,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

function FaithSlide({
  slide,
  isDark,
}: {
  slide: OnboardingSlide;
  isDark: boolean;
}) {
  const pastel = OnboardingPastelPalette.forTone(slide.pastel ?? "lavender", isDark);

  return (
    <View
      style={[
        styles.page,
        { width: SCREEN_WIDTH - 48, backgroundColor: pastel.bg },
      ]}
    >
      <ThemedText variant="heading" style={[styles.title, { color: pastel.text }]}>
        {slide.title}
      </ThemedText>
      {slide.body ? (
        <ThemedText variant="body" style={[styles.body, { color: pastel.textMuted }]}>
          {slide.body}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  page: {
    borderRadius: 20,
    minHeight: 320,
    justifyContent: "center",
    alignItems: "center",
    padding: 28,
    gap: 16,
  },
  title: {
    textAlign: "center",
  },
  body: {
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 280,
  },
  dots: {
    flexDirection: "row",
    gap: 6,
    marginTop: 20,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
});
