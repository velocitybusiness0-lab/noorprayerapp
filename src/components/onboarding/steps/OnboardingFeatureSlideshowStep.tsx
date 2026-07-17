import React from "react";
import { Dimensions, FlatList, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useTheme } from "@/core/theme";
import { ONBOARDING_INK } from "@/features/onboarding/OnboardingPastelPalette";
import { ThemedText } from "@/components/primitives/ThemedText";
import { OnboardingFeatureSlide, OnboardingStep } from "@/features/onboarding/onboarding.types";

interface OnboardingFeatureSlideshowStepProps {
  step: OnboardingStep;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const PAGE_WIDTH = SCREEN_WIDTH - 48;
const DOT = 8;
const DOT_GAP = 8;

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<OnboardingFeatureSlide>);

/** Miraj feature carousel — icon cards with scroll-linked dots. */
export function OnboardingFeatureSlideshowStep({ step }: OnboardingFeatureSlideshowStepProps) {
  const features = step.features ?? [];
  const scrollX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: (scrollX.value / PAGE_WIDTH) * (DOT + DOT_GAP) }],
  }));

  return (
    <View style={styles.wrap}>
      <ThemedText variant="heading" style={styles.title}>
        {step.title}
      </ThemedText>

      <AnimatedFlatList
        data={features}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.title}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={PAGE_WIDTH}
        disableIntervalMomentum
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <FeatureCard feature={item} />}
      />

      <View
        style={[
          styles.dotRow,
          { width: features.length * DOT + (features.length - 1) * DOT_GAP },
        ]}
      >
        {features.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, { marginRight: index < features.length - 1 ? DOT_GAP : 0 }]}
          />
        ))}
        <Animated.View style={[styles.dotActive, indicatorStyle]} />
      </View>
    </View>
  );
}

function FeatureCard({ feature }: { feature: OnboardingFeatureSlide }) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          width: PAGE_WIDTH,
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: theme.colors.sageMuted }]}>
        <Ionicons
          name={feature.icon as keyof typeof Ionicons.glyphMap}
          size={32}
          color={theme.colors.accent}
        />
      </View>
      <ThemedText variant="title" style={styles.cardTitle}>
        {feature.title}
      </ThemedText>
      <ThemedText variant="body" style={styles.cardBody}>
        {feature.body}
      </ThemedText>
    </View>
  );
}

const ink = { color: ONBOARDING_INK };

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    paddingTop: 32,
    alignItems: "center",
  },
  title: {
    ...ink,
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  list: {
    alignItems: "center",
  },
  card: {
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 28,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 280,
    gap: 12,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  cardTitle: {
    ...ink,
    textAlign: "center",
  },
  cardBody: {
    ...ink,
    textAlign: "center",
    lineHeight: 22,
    opacity: 0.72,
  },
  dotRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    position: "relative",
    height: DOT,
  },
  dot: {
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
    backgroundColor: "rgba(61,56,50,0.18)",
  },
  dotActive: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 20,
    height: DOT,
    borderRadius: DOT / 2,
    backgroundColor: ONBOARDING_INK,
  },
});
