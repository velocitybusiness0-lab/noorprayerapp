import { Ionicons } from "@expo/vector-icons";

export type DuaCustomListIconName = keyof typeof Ionicons.glyphMap;

export interface DuaCustomListIconStyle {
  icon: DuaCustomListIconName;
  /** Soft circle fill — distinct from sageMuted on saved cards. */
  circleColor: string;
  /** Glyph color — warm family, not sage accent. */
  glyphColor: string;
}

const OPTIONS: DuaCustomListIconStyle[] = [
  { icon: "albums-outline", circleColor: "#F0E4D4", glyphColor: "#C4894A" },
  { icon: "bookmark-outline", circleColor: "#E8DCE8", glyphColor: "#8B6B9E" },
  { icon: "folder-open-outline", circleColor: "#DCE8F0", glyphColor: "#4A7C9E" },
  { icon: "layers-outline", circleColor: "#E8E4D0", glyphColor: "#8A7A4A" },
  { icon: "ribbon-outline", circleColor: "#F0DCE0", glyphColor: "#B05A6A" },
  { icon: "file-tray-full-outline", circleColor: "#DCE8E0", glyphColor: "#4A8A6A" },
  { icon: "library-outline", circleColor: "#E4E0F0", glyphColor: "#6B5A9E" },
  { icon: "prism-outline", circleColor: "#F0E8D8", glyphColor: "#A87840" },
];

/** Distinct icon + tint pairs for user-created dua lists. */
export class DuaCustomListIconCatalog {
  static all(): DuaCustomListIconStyle[] {
    return OPTIONS;
  }

  static defaultStyle(): DuaCustomListIconStyle {
    return OPTIONS[0];
  }

  /** Next unused style, or round-robin when all are taken. */
  static pickNext(existingIcons: (string | undefined)[]): DuaCustomListIconStyle {
    const used = new Set(
      existingIcons.filter((icon): icon is string => Boolean(icon))
    );
    const unused = OPTIONS.find((option) => !used.has(option.icon));
    if (unused) return unused;
    return OPTIONS[existingIcons.length % OPTIONS.length] ?? OPTIONS[0];
  }

  static resolve(icon: string | undefined): DuaCustomListIconStyle {
    const match = OPTIONS.find((option) => option.icon === icon);
    return match ?? this.defaultStyle();
  }

  /** Stable style for legacy user lists that never persisted an icon. */
  static resolveForId(collectionId: string): DuaCustomListIconStyle {
    let hash = 0;
    for (let i = 0; i < collectionId.length; i += 1) {
      hash = (hash + collectionId.charCodeAt(i) * (i + 1)) % OPTIONS.length;
    }
    return OPTIONS[hash] ?? OPTIONS[0];
  }
}
