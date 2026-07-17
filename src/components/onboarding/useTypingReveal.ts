import { useEffect, useState } from "react";
import { haptics } from "@/core/haptics/HapticsManager";

const CHAR_MS = 18;
const HAPTIC_EVERY = 4;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface TypingRevealResult {
  titleText: string;
  bodyText: string;
  isComplete: boolean;
}

/** Types title then body with light haptic ticks. */
export function useTypingReveal(title: string, body?: string): TypingRevealResult {
  const [titleText, setTitleText] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const typeLine = async (line: string, apply: (value: string) => void) => {
      for (let index = 0; index <= line.length; index += 1) {
        if (cancelled) return;
        apply(line.slice(0, index));
        if (index > 0 && index % HAPTIC_EVERY === 0) haptics.selection();
        await wait(CHAR_MS);
      }
    };

    const run = async () => {
      setTitleText("");
      setBodyText("");
      setIsComplete(false);

      await typeLine(title, setTitleText);
      if (cancelled) return;

      if (body) {
        await wait(180);
        await typeLine(body, setBodyText);
      }

      if (!cancelled) {
        haptics.impact();
        setIsComplete(true);
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [body, title]);

  return { titleText, bodyText, isComplete };
}
