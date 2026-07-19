import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/core/theme";
import { haptics } from "@/core/haptics/HapticsManager";
import { ONBOARDING_INK } from "@/features/onboarding/OnboardingPastelPalette";
import { ThemedText } from "@/components/primitives/ThemedText";
import { OnboardingOption, OnboardingOptionLayout } from "@/features/onboarding/onboarding.types";

interface OnboardingOptionGridProps {
  options: OnboardingOption[];
  layout?: OnboardingOptionLayout;
  spacing?: "normal" | "relaxed" | "loose";
  selectedId?: string;
  selectedIds?: string[];
  multi?: boolean;
  onSelect: (id: string) => void;
}

const SELECT_BLUE = "#3B82F6";
const TILE_BLACK = "#1A1A1A";

/** Mixed option styles: roomy grid tiles, pill stacks, and check rows. */
export function OnboardingOptionGrid({
  options,
  layout = "grid-2x2",
  spacing = "normal",
  selectedId,
  selectedIds = [],
  multi = false,
  onSelect,
}: OnboardingOptionGridProps) {
  const gap = spacing === "loose" ? 22 : spacing === "relaxed" ? 18 : 16;
  const isSelected = (id: string) =>
    multi ? selectedIds.includes(id) : selectedId === id;

  if (layout.startsWith("stack")) {
    return (
      <View style={[styles.wrap, { gap }]}>
        {options.map((option) => (
          <OptionPill
            key={option.id}
            label={option.label}
            selected={isSelected(option.id)}
            tall={spacing === "loose"}
            onPress={() => {
              haptics.selection();
              onSelect(option.id);
            }}
          />
        ))}
      </View>
    );
  }

  if (layout === "grid-2") {
    return (
      <View style={[styles.wrap, styles.row, { gap }]}>
        {options.slice(0, 2).map((option) => (
          <OptionTile
            key={option.id}
            label={option.label}
            selected={isSelected(option.id)}
            style={styles.tileWide}
            onPress={() => {
              haptics.selection();
              onSelect(option.id);
            }}
          />
        ))}
      </View>
    );
  }

  const rows = chunkPairs(options);

  return (
    <View style={[styles.wrap, { gap }]}>
      {rows.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={[styles.row, { gap }]}>
          {row.map((option) => (
            <OptionTile
              key={option.id}
              label={option.label}
              selected={isSelected(option.id)}
              style={styles.tileSquare}
              onPress={() => {
                haptics.selection();
                onSelect(option.id);
              }}
            />
          ))}
          {row.length === 1 ? <View style={styles.tileSquare} /> : null}
        </View>
      ))}
    </View>
  );
}

function OptionTile({
  label,
  selected,
  style,
  onPress,
}: {
  label: string;
  selected: boolean;
  style?: object;
  onPress: () => void;
}) {
  const theme = useTheme();
  const scale = useSharedValue(1);
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={[styles.tileFlex, style, animated]}>
      <Pressable
        onPressIn={() => {
          scale.value = withTiming(0.97, { duration: 80 });
        }}
        onPressOut={() => {
          scale.value = withTiming(1, { duration: 120 });
        }}
        onPress={onPress}
        style={[
          styles.tileInner,
          {
            borderRadius: theme.radii.lg,
            backgroundColor: selected ? TILE_BLACK : theme.colors.surface,
            borderColor: selected ? SELECT_BLUE : theme.colors.border,
            borderWidth: selected ? 2.5 : StyleSheet.hairlineWidth,
          },
        ]}
      >
        <ThemedText
          variant="bodyStrong"
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.75}
          style={{
            color: selected ? "#FFFFFF" : ONBOARDING_INK,
            textAlign: "center",
            width: "100%",
          }}
        >
          {label}
        </ThemedText>
      </Pressable>
    </Animated.View>
  );
}

function OptionPill({
  label,
  selected,
  tall,
  onPress,
}: {
  label: string;
  selected: boolean;
  tall: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={animated}>
      <Pressable
        onPressIn={() => {
          scale.value = withTiming(0.98, { duration: 80 });
        }}
        onPressOut={() => {
          scale.value = withTiming(1, { duration: 120 });
        }}
        onPress={onPress}
        style={[
          styles.pill,
          tall && styles.pillTall,
          {
            backgroundColor: selected ? TILE_BLACK : "#FFFFFF",
            borderColor: selected ? SELECT_BLUE : "rgba(61,56,50,0.14)",
            borderWidth: selected ? 2.5 : 1,
          },
        ]}
      >
        <ThemedText
          variant="bodyStrong"
          style={{ color: selected ? "#FFFFFF" : ONBOARDING_INK, flex: 1 }}
        >
          {label}
        </ThemedText>
        {selected ? (
          <Ionicons name="checkmark-circle" size={22} color={SELECT_BLUE} />
        ) : (
          <View style={styles.pillDot} />
        )}
      </Pressable>
    </Animated.View>
  );
}

function chunkPairs(options: OnboardingOption[]): OnboardingOption[][] {
  const rows: OnboardingOption[][] = [];
  for (let i = 0; i < options.length; i += 2) {
    rows.push(options.slice(i, i + 2));
  }
  return rows;
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    maxWidth: 340,
    alignSelf: "center",
  },
  row: {
    flexDirection: "row",
  },
  tileFlex: {
    flex: 1,
  },
  tileSquare: {
    minHeight: 96,
  },
  tileWide: {
    minHeight: 88,
  },
  tileInner: {
    flex: 1,
    minHeight: 88,
    paddingHorizontal: 12,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  pill: {
    width: "100%",
    minHeight: 58,
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  pillTall: {
    minHeight: 64,
  },
  pillDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: "rgba(61,56,50,0.22)",
  },
});
