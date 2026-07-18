import { Href } from "expo-router";

/** Typed path helpers for the My Duas feature. */
export class DuaRoutes {
  static library(): Href {
    return "/duas" as Href;
  }

  static detail(id: string): Href {
    return { pathname: "/duas/[id]", params: { id } } as Href;
  }

  static collection(collectionId: string): Href {
    return {
      pathname: "/duas/collection/[collectionId]",
      params: { collectionId },
    } as Href;
  }
}
