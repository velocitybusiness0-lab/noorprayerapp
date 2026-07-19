import { useEffect, useState } from "react";
import { OnboardingTypewriter } from "@/features/onboarding/OnboardingTypewriter";

interface TypingRevealResult {
  titleText: string;
  bodyText: string;
  isComplete: boolean;
}

/** Types title then body via OnboardingTypewriter (light haptic ticks). */
export function useTypingReveal(title: string, body?: string): TypingRevealResult {
  const [titleText, setTitleText] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const typewriter = new OnboardingTypewriter();

    const run = async () => {
      setIsComplete(false);
      await typewriter.run(title, body, {
        onTitleProgress: setTitleText,
        onBodyProgress: setBodyText,
        onComplete: () => setIsComplete(true),
      });
    };

    void run();

    return () => {
      typewriter.cancel();
    };
  }, [body, title]);

  return { titleText, bodyText, isComplete };
}
