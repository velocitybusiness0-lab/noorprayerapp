/**
 * Partitions benefit chips into the reference staggered pattern:
 * top 2, middle 3, bottom 2 — each row centered by the view layer.
 */
export class OnboardingPersonalizedPlanBenefitChipRowLayout {
  static readonly pattern = [2, 3, 2] as const;

  static rows<T>(chips: readonly T[]): readonly (readonly T[])[] {
    return this.rowsForPattern(chips, this.pattern);
  }

  static rowsForPattern<T>(
    chips: readonly T[],
    pattern: readonly number[]
  ): readonly (readonly T[])[] {
    const result: T[][] = [];
    let offset = 0;

    for (const size of pattern) {
      if (offset >= chips.length) break;
      result.push(chips.slice(offset, offset + size));
      offset += size;
    }

    if (offset < chips.length) {
      result.push(chips.slice(offset));
    }

    return result;
  }

  /** Keeps full chip borders on-screen inside a full-width centered row. */
  static maxWidthPercent(rowSize: number): `${number}%` {
    if (rowSize >= 3) return "31%";
    if (rowSize === 2) return "46%";
    return "100%";
  }
}
