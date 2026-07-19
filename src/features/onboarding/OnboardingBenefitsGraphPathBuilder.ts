import {
  OnboardingBenefitsGraphPoint,
  OnboardingBenefitsGraphSeries,
} from "./OnboardingBenefitsGraphCatalog";

export interface OnboardingBenefitsGraphLayout {
  width: number;
  height: number;
  paddingLeft: number;
  paddingRight: number;
  paddingTop: number;
  paddingBottom: number;
}

/** Maps normalized series points into SVG path coordinates. */
export class OnboardingBenefitsGraphPathBuilder {
  static plotPoint(
    point: OnboardingBenefitsGraphPoint,
    layout: OnboardingBenefitsGraphLayout
  ): { x: number; y: number } {
    const plotWidth = layout.width - layout.paddingLeft - layout.paddingRight;
    const plotHeight = layout.height - layout.paddingTop - layout.paddingBottom;
    return {
      x: layout.paddingLeft + point.x * plotWidth,
      y: layout.paddingTop + (1 - point.y) * plotHeight,
    };
  }

  static linePath(
    series: OnboardingBenefitsGraphSeries,
    layout: OnboardingBenefitsGraphLayout
  ): string {
    return series.points
      .map((point, index) => {
        const plotted = this.plotPoint(point, layout);
        const command = index === 0 ? "M" : "L";
        return `${command} ${this.round(plotted.x)} ${this.round(plotted.y)}`;
      })
      .join(" ");
  }

  static areaPath(
    series: OnboardingBenefitsGraphSeries,
    layout: OnboardingBenefitsGraphLayout
  ): string {
    if (series.points.length === 0) return "";
    const line = this.linePath(series, layout);
    const first = this.plotPoint(series.points[0], layout);
    const last = this.plotPoint(series.points[series.points.length - 1], layout);
    const baseline = layout.height - layout.paddingBottom;
    return `${line} L ${this.round(last.x)} ${this.round(baseline)} L ${this.round(first.x)} ${this.round(baseline)} Z`;
  }

  private static round(value: number): number {
    return Math.round(value * 10) / 10;
  }
}
