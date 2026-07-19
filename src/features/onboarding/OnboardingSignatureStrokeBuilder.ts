/** Builds SVG path strings from continuous pan points. */
export class OnboardingSignatureStrokeBuilder {
  static startPath(x: number, y: number): string {
    return `M ${this.round(x)} ${this.round(y)}`;
  }

  static appendPoint(path: string, x: number, y: number): string {
    return `${path} L ${this.round(x)} ${this.round(y)}`;
  }

  private static round(value: number): number {
    return Math.round(value * 10) / 10;
  }
}
