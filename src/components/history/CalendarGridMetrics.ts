const DEFAULT_MAX_CELL = 28;

/**
 * Fits a 7-column grid inside `containerWidth`.
 * Day boxes scale up to `maxCellSize` so the grid fills space without huge cells.
 */
export function fittedCalendarGridMetrics(
  containerWidth: number,
  columns = 7,
  gap = 4,
  maxCellSize = DEFAULT_MAX_CELL
): { cellSize: number; gridWidth: number } {
  const ideal = Math.floor((containerWidth - gap * (columns - 1)) / columns);
  const cellSize = Math.max(10, Math.min(maxCellSize, ideal));
  const gridWidth = columns * cellSize + gap * (columns - 1);
  return { cellSize, gridWidth };
}

export const CALENDAR_MAX_CELL = DEFAULT_MAX_CELL;

/** Day boxes sized to exactly fill the container width. */
export function fullWidthCalendarGridMetrics(
  containerWidth: number,
  columns = 7,
  gap = 4
): { cellSize: number; gridWidth: number } {
  const cellSize = Math.max(
    10,
    Math.floor((containerWidth - gap * (columns - 1)) / columns)
  );
  const gridWidth = columns * cellSize + gap * (columns - 1);
  return { cellSize, gridWidth };
}
