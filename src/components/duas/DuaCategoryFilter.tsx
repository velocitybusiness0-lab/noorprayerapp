import React from "react";
import { Pressable, ScrollView, StyleSheet } from "react-native";
import { useTheme } from "@/core/theme";
import { ThemedText } from "@/components/primitives/ThemedText";
import { DuaCatalog } from "@/features/duas/DuaCatalog";
import { DuaCategoryId } from "@/features/duas/dua.types";

interface DuaCategoryFilterProps {
  selected: DuaCategoryId | null;
  onChange: (id: DuaCategoryId | null) => void;
}

/** Horizontal category chips for suggested duas. */
export function DuaCategoryFilter({ selected, onChange }: DuaCategoryFilterProps) {
  const theme = useTheme();
  const categories = DuaCatalog.categories();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      <Chip
        label="All"
        active={selected === null}
        onPress={() => onChange(null)}
        activeColor={theme.colors.accent}
        idleBg={theme.colors.sageMuted}
        idleBorder={theme.colors.border}
      />
      {categories.map((category) => (
        <Chip
          key={category.id}
          label={category.label}
          active={selected === category.id}
          onPress={() => onChange(category.id)}
          activeColor={theme.colors.accent}
          idleBg={theme.colors.sageMuted}
          idleBorder={theme.colors.border}
        />
      ))}
    </ScrollView>
  );
}

function Chip({
  label,
  active,
  onPress,
  activeColor,
  idleBg,
  idleBorder,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  activeColor: string;
  idleBg: string;
  idleBorder: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: active ? activeColor : idleBg,
          borderColor: active ? activeColor : idleBorder,
        },
      ]}
    >
      <ThemedText
        variant="caption"
        style={{ color: active ? "#FFFFFF" : undefined }}
        color={active ? undefined : "textSecondary"}
      >
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { gap: 8, paddingVertical: 4, paddingRight: 16 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
