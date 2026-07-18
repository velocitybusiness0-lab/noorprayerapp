import React, { useCallback } from "react";
import { FlatList, ListRenderItem, StyleSheet, View, useWindowDimensions } from "react-native";
import { ThemedText } from "@/components/primitives/ThemedText";
import { ReminderQuotePage } from "./ReminderQuotePage";
import { MotivationReminder } from "@/features/motivation/motivation.types";

interface ReminderFeedProps {
  items: MotivationReminder[];
}

/** Vertical full-screen paging feed of motivation quotes. */
export function ReminderFeed({ items }: ReminderFeedProps) {
  const { height } = useWindowDimensions();

  const renderItem = useCallback<ListRenderItem<MotivationReminder>>(
    ({ item }) => <ReminderQuotePage reminder={item} height={height} />,
    [height]
  );

  if (items.length === 0) {
    return (
      <View style={[styles.empty, { height }]}>
        <ThemedText variant="body" color="textSecondary" style={styles.emptyText}>
          Turn on at least one reminder type in settings.
        </ThemedText>
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      pagingEnabled
      showsVerticalScrollIndicator={false}
      bounces
      decelerationRate="fast"
      getItemLayout={(_, index) => ({
        length: height,
        offset: height * index,
        index,
      })}
    />
  );
}

const styles = StyleSheet.create({
  empty: {
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    textAlign: "center",
    lineHeight: 22,
  },
});
