import React, { useMemo, useState } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import Svg, { Circle, Path, Text as SvgText } from "react-native-svg";
import { ThemedText } from "@/components/primitives/ThemedText";
import { OnboardingBenefitsGraphCatalog } from "@/features/onboarding/OnboardingBenefitsGraphCatalog";
import {
  OnboardingBenefitsGraphLayout,
  OnboardingBenefitsGraphPathBuilder,
} from "@/features/onboarding/OnboardingBenefitsGraphPathBuilder";
import { OnboardingBenefitsGraphTheme } from "@/features/onboarding/OnboardingBenefitsGraphTheme";

interface OnboardingBenefitsComparisonChartProps {
  plotWidth: number;
  height?: number;
}

const DEFAULT_HEIGHT = 248;

/** Week 1–3 dual-path comparison chart for the benefits beat. */
export function OnboardingBenefitsComparisonChart({
  plotWidth,
  height = DEFAULT_HEIGHT,
}: OnboardingBenefitsComparisonChartProps) {
  const withMiraj = OnboardingBenefitsGraphCatalog.withMirajSeries();
  const willpower = OnboardingBenefitsGraphCatalog.willpowerSeries();
  const missIndices = OnboardingBenefitsGraphCatalog.willpowerMissIndices();
  const theme = OnboardingBenefitsGraphTheme;

  const layout: OnboardingBenefitsGraphLayout = useMemo(
    () => ({
      width: plotWidth,
      height,
      paddingLeft: 12,
      paddingRight: 12,
      paddingTop: 34,
      paddingBottom: 28,
    }),
    [height, plotWidth]
  );

  const mirajPath = OnboardingBenefitsGraphPathBuilder.linePath(withMiraj, layout);
  const willpowerPath = OnboardingBenefitsGraphPathBuilder.linePath(willpower, layout);
  const willpowerArea = OnboardingBenefitsGraphPathBuilder.areaPath(willpower, layout);
  const mirajEnd = OnboardingBenefitsGraphPathBuilder.plotPoint(
    withMiraj.points[withMiraj.points.length - 1],
    layout
  );
  const mirajStart = OnboardingBenefitsGraphPathBuilder.plotPoint(withMiraj.points[0], layout);
  const willpowerEnd = OnboardingBenefitsGraphPathBuilder.plotPoint(
    willpower.points[willpower.points.length - 1],
    layout
  );

  if (plotWidth <= 0) return <View style={{ height }} />;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.chartSurface,
          borderColor: theme.chartBorder,
        },
      ]}
    >
      <View style={styles.legendRow}>
        <ThemedText variant="caption" style={{ color: theme.missLegend }}>
          {OnboardingBenefitsGraphCatalog.missMarkerLabel}
        </ThemedText>
        <ThemedText variant="caption" style={{ color: theme.brandMark }}>
          Miraj
        </ThemedText>
      </View>

      <Svg width={plotWidth} height={height}>
        <Path d={willpowerArea} fill={theme.willpowerArea} />
        <Path
          d={willpowerPath}
          stroke={willpower.color}
          strokeWidth={2.5}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d={mirajPath}
          stroke={withMiraj.color}
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <Circle
          cx={mirajStart.x}
          cy={mirajStart.y}
          r={5}
          stroke={withMiraj.color}
          strokeWidth={2}
          fill={theme.startDot}
        />
        <Circle cx={mirajEnd.x} cy={mirajEnd.y} r={7} fill={withMiraj.color} />

        {missIndices.map((index) => {
          const point = willpower.points[index];
          if (!point) return null;
          const plotted = OnboardingBenefitsGraphPathBuilder.plotPoint(point, layout);
          return (
            <SvgText
              key={`miss-${index}`}
              x={plotted.x}
              y={plotted.y - 10}
              fill={willpower.color}
              fontSize={12}
              fontWeight="700"
              textAnchor="middle"
            >
              ✕
            </SvgText>
          );
        })}

        <SvgText
          x={Math.min(plotWidth - 8, mirajEnd.x - 6)}
          y={mirajEnd.y - 14}
          fill={withMiraj.color}
          fontSize={12}
          fontWeight="700"
          textAnchor="end"
        >
          {withMiraj.label}
        </SvgText>
        <SvgText
          x={Math.max(8, willpowerEnd.x)}
          y={willpowerEnd.y + 18}
          fill={willpower.color}
          fontSize={11}
          fontWeight="600"
          textAnchor="end"
        >
          {willpower.label}
        </SvgText>
        <SvgText
          x={Math.max(8, willpowerEnd.x - 4)}
          y={willpowerEnd.y - 16}
          fill={willpower.color}
          fontSize={10}
          fontWeight="600"
          textAnchor="end"
        >
          Same cycle
        </SvgText>
      </Svg>

      <View style={styles.weekRow}>
        {OnboardingBenefitsGraphCatalog.weekLabels.map((label) => (
          <ThemedText key={label} variant="caption" style={{ color: theme.mutedLabel }}>
            {label}
          </ThemedText>
        ))}
      </View>
    </View>
  );
}

/** Measures available width then renders the comparison chart. */
export function OnboardingBenefitsComparisonChartHost() {
  const [plotWidth, setPlotWidth] = useState(0);

  const onLayout = (event: LayoutChangeEvent) => {
    const next = Math.max(0, event.nativeEvent.layout.width - 32);
    setPlotWidth(next);
  };

  return (
    <View style={styles.host} onLayout={onLayout}>
      <OnboardingBenefitsComparisonChart plotWidth={plotWidth} />
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    width: "100%",
  },
  card: {
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  legendRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
    paddingHorizontal: 2,
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    marginTop: 2,
  },
});
