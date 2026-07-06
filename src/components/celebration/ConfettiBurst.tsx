import React, { useEffect } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

const COLORS = ["#6B9E88", "#E8C84A", "#D4847C", "#A8C8DC", "#D4A574"];
const PARTICLE_COUNT = 36;

interface ParticleSpec {
  left: number;
  delay: number;
  drift: number;
  color: string;
  size: number;
}

function buildParticles(width: number): ParticleSpec[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, index) => ({
    left: Math.random() * width,
    delay: Math.random() * 280,
    drift: (Math.random() - 0.5) * 120,
    color: COLORS[index % COLORS.length],
    size: 6 + Math.random() * 6,
  }));
}

function ConfettiPiece({ spec, height }: { spec: ParticleSpec; height: number }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      spec.delay,
      withTiming(1, { duration: 1800, easing: Easing.out(Easing.quad) })
    );
  }, [progress, spec.delay]);

  const style = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    transform: [
      { translateX: spec.drift * progress.value },
      { translateY: progress.value * height * 0.85 },
      { rotate: `${progress.value * 360}deg` },
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.piece,
        style,
        {
          left: spec.left,
          width: spec.size,
          height: spec.size * 0.6,
          backgroundColor: spec.color,
        },
      ]}
    />
  );
}

interface ConfettiBurstProps {
  active: boolean;
}

/** Lightweight falling confetti burst. */
export function ConfettiBurst({ active }: ConfettiBurstProps) {
  const { width, height } = useWindowDimensions();
  if (!active) return null;

  const particles = buildParticles(width);

  return (
    <View pointerEvents="none" style={styles.layer}>
      {particles.map((spec, index) => (
        <ConfettiPiece key={`${spec.left}-${index}`} spec={spec} height={height * 0.45} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  piece: {
    position: "absolute",
    top: 0,
    borderRadius: 2,
  },
});
