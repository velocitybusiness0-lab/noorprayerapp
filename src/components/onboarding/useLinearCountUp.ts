import { useEffect, useState } from "react";

/** Linear count-up for stat reveals. */
export function useLinearCountUp(target: number, durationMs: number, delayMs = 0): number {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    setDisplay(0);
    if (target <= 0) return;

    let frame = 0;
    let startTime = 0;
    let delayTimer: ReturnType<typeof setTimeout> | undefined;

    const tick = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      setDisplay(Math.round(progress * target));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    delayTimer = setTimeout(() => {
      frame = requestAnimationFrame(tick);
    }, delayMs);

    return () => {
      if (delayTimer) clearTimeout(delayTimer);
      cancelAnimationFrame(frame);
    };
  }, [delayMs, durationMs, target]);

  return display;
}
