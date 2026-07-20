import { Href } from "expo-router";

/** Typed path helpers for the My Purpose eBook. */
export class PurposeEbookRoutes {
  static cover(): Href {
    return "/purpose" as Href;
  }

  static chapter(chapterId: string): Href {
    return {
      pathname: "/purpose/[chapterId]",
      params: { chapterId },
    } as Href;
  }
}
