import { useEffect, useState } from "react";
import { OnboardingTypewriter } from "@/features/onboarding/OnboardingTypewriter";

interface TypingRevealResult {
  titleText: string;
  bodyText: string;
  isComplete: boolean;
  showBodyFade: boolean;
}

type BodyRevealMode = "typing" | "fade";

/** Types title; body types or fades in after title completes. */
export function useTypingReveal(
  title: string,
  body?: string,
  bodyReveal: BodyRevealMode = "typing"
): TypingRevealResult {
  const [titleText, setTitleText] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [showBodyFade, setShowBodyFade] = useState(false);

  useEffect(() => {
    const typewriter = new OnboardingTypewriter();

    const run = async () => {
      setIsComplete(false);
      setShowBodyFade(false);
      setBodyText("");

      if (bodyReveal === "fade" && body) {
        await typewriter.run(title, undefined, {
          onTitleProgress: setTitleText,
          onBodyProgress: () => undefined,
          onComplete: () => {
            setShowBodyFade(true);
            setIsComplete(true);
          },
        });
        return;
      }

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
  }, [body, bodyReveal, title]);

  return { titleText, bodyText, isComplete, showBodyFade };
}
