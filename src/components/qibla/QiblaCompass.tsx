import React, { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Circle, Line, Text as SvgText } from "react-native-svg";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/core/theme";
import { ThemedText } from "@/components/primitives/ThemedText";
import { ContinuousAngleTracker } from "@/features/qibla/ContinuousAngleTracker";

interface QiblaCompassProps {
  heading: number;
  relativeAngle: number;
  aligned: boolean;
  size?: number;
}

const CARDINALS = [
  { label: "N", angle: 0 },
  { label: "E", angle: 90 },
  { label: "S", angle: 180 },
  { label: "W", angle: 270 },
];

/** Short ease only — ContinuousAngleTracker already prevents 0° teleports. */
const ROTATION_MS = 40;

/**
 * Circular compass with one rotation model (do not mix alternatives):
 * - Dial rotates by `-heading` so N/E/S/W stay world-aligned under the phone.
 * - Needle rotates by `relativeAngle` (= qiblaBearing − heading) so it points
 *   at the Kaaba; 0° = phone top faces qibla.
 * Both layers share the same heading, so they never double-count rotation.
 */
export function QiblaCompass({
  heading,
  relativeAngle,
  aligned,
  size = 300,
}: QiblaCompassProps) {
  const theme = useTheme();
  const dial = useSharedValue(0);
  const needle = useSharedValue(0);
  const dialTracker = useRef(new ContinuousAngleTracker());
  const needleTracker = useRef(new ContinuousAngleTracker());

  useEffect(() => {
    dial.value = withTiming(dialTracker.current.next(-heading), {
      duration: ROTATION_MS,
    });
  }, [heading, dial]);

  useEffect(() => {
    needle.value = withTiming(needleTracker.current.next(relativeAngle), {
      duration: ROTATION_MS,
    });
  }, [relativeAngle, needle]);

  const dialStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${dial.value}deg` }],
  }));
  const needleStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${needle.value}deg` }],
  }));

  const radius = size / 2;
  const center = radius;
  const ticks = Array.from({ length: 72 }, (_, i) => i * 5);

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      {/* Fixed top pointer */}
      <View style={styles.topPointer}>
        <Ionicons name="caret-down" size={22} color={theme.colors.textPrimary} />
      </View>

      {/* Rotating cardinal dial */}
      <Animated.View style={[StyleSheet.absoluteFill, dialStyle]}>
        <Svg width={size} height={size}>
          <Circle
            cx={center}
            cy={center}
            r={radius - 6}
            stroke={theme.colors.hairline}
            strokeWidth={1}
            fill="none"
          />
          {ticks.map((angle) => {
            const major = angle % 90 === 0;
            const rad = (angle * Math.PI) / 180;
            const outer = radius - 8;
            const inner = outer - (major ? 16 : 8);
            return (
              <Line
                key={angle}
                x1={center + outer * Math.sin(rad)}
                y1={center - outer * Math.cos(rad)}
                x2={center + inner * Math.sin(rad)}
                y2={center - inner * Math.cos(rad)}
                stroke={major ? theme.colors.textSecondary : theme.colors.arcTrack}
                strokeWidth={major ? 2 : 1}
              />
            );
          })}
          {CARDINALS.map(({ label, angle }) => {
            const rad = (angle * Math.PI) / 180;
            const r = radius - 40;
            return (
              <SvgText
                key={label}
                x={center + r * Math.sin(rad)}
                y={center - r * Math.cos(rad) + 6}
                fill={label === "N" ? theme.colors.textPrimary : theme.colors.textTertiary}
                fontSize={16}
                fontWeight="600"
                textAnchor="middle"
              >
                {label}
              </SvgText>
            );
          })}
        </Svg>
      </Animated.View>

      {/* Qibla needle */}
      <Animated.View style={[StyleSheet.absoluteFill, styles.center, needleStyle]}>
        <View
          style={[
            styles.needle,
            {
              height: radius - 30,
              backgroundColor: aligned ? theme.colors.accent : theme.colors.textSecondary,
            },
          ]}
        />
        <View style={[styles.kaaba, { top: 8 }]}>
          <Ionicons
            name="cube"
            size={26}
            color={aligned ? theme.colors.accent : theme.colors.textPrimary}
          />
        </View>
      </Animated.View>

      {/* Center readout */}
      <View style={styles.readout} pointerEvents="none">
        <ThemedText variant="caption" color="textTertiary">
          {aligned ? "FACING QIBLA" : "TURN TO ALIGN"}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center" },
  center: { alignItems: "center", justifyContent: "flex-start" },
  topPointer: {
    position: "absolute",
    top: -18,
    zIndex: 10,
  },
  needle: {
    width: 2,
    marginTop: 30,
  },
  kaaba: {
    position: "absolute",
    alignSelf: "center",
  },
  readout: {
    position: "absolute",
    bottom: "50%",
    marginBottom: -50,
  },
});
