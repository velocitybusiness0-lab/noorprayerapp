/** Semicircle layout math for the next-prayer arc hero card. */
export class PrayerArcGeometry {
  constructor(
    readonly cx: number,
    readonly cy: number,
    readonly radius: number
  ) {}

  pointAt(fraction: number): { x: number; y: number } {
    const theta = Math.PI - fraction * Math.PI;
    return {
      x: this.cx + this.radius * Math.cos(theta),
      y: this.cy - this.radius * Math.sin(theta),
    };
  }

  fullTrackPath(): string {
    const { cx, cy, radius } = this;
    return `M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`;
  }

  activeTrackPath(progress: number): string | null {
    if (progress <= 0) return null;
    if (progress >= 1) return this.fullTrackPath();

    const start = this.pointAt(0);
    const end = this.pointAt(progress);
    const largeArc = progress > 0.5 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${this.radius} ${this.radius} 0 ${largeArc} 1 ${end.x} ${end.y}`;
  }
}
