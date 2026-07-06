import React from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Circle, Line, Path } from "react-native-svg";
import { useTheme } from "@/core/theme";
import { progressBetween } from "@/core/utils/time";

interface SunPathArcProps {
  sunrise: Date;
  sunset: Date;
  width: number;
  height?: number;
}

/** Bell-curve sun path with a marker at the sun's current position. */
export function SunPathArc({ sunrise, sunset, width, height = 90 }: SunPathArcProps) {
  const theme = useTheme();
  const now = Date.now();
  const t = progressBetween(sunrise.getTime(), sunset.getTime(), now);
  const isDay = now >= sunrise.getTime() && now <= sunset.getTime();

  const baseY = height - 12;
  const topY = 12;
  const p0 = { x: 6, y: baseY };
  const p1 = { x: width / 2, y: topY - 18 };
  const p2 = { x: width - 6, y: baseY };

  // Point on the quadratic Bezier at parameter t.
  const mt = 1 - t;
  const markerX = mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x;
  const markerY = mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y;

  return (
    <View style={styles.wrap}>
      <Svg width={width} height={height}>
        <Line
          x1={0}
          y1={baseY}
          x2={width}
          y2={baseY}
          stroke={theme.colors.hairline}
          strokeWidth={1}
        />
        <Path
          d={`M ${p0.x} ${p0.y} Q ${p1.x} ${p1.y} ${p2.x} ${p2.y}`}
          stroke={theme.colors.arcTrack}
          strokeWidth={2}
          strokeDasharray="4 5"
          fill="none"
        />
        {isDay && (
          <Circle cx={markerX} cy={markerY} r={5} fill={theme.colors.warmGlow} />
        )}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center" },
});
