import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Stack, useLocalSearchParams, router } from "expo-router";
import { Screen } from "@/components/primitives/Screen";
import { ThemedText } from "@/components/primitives/ThemedText";
import { Button } from "@/components/primitives/Button";
import { DuaListRow } from "@/components/duas/DuaListRow";
import { DuaAddToListModal } from "@/components/duas/DuaAddToListModal";
import { DuaCollectionHeaderTitle } from "@/components/duas/DuaCollectionHeaderTitle";
import { DuaLibraryManager } from "@/features/duas/DuaLibraryManager";
import { useDuaLibrary } from "@/features/duas/duaLibraryStore";
import { DuaRoutes } from "@/features/duas/DuaRoutes";
import { stackBackNavigator } from "@/features/navigation/StackBackNavigator";
import { haptics } from "@/core/haptics/HapticsManager";
import { useTheme } from "@/core/theme";

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/** One personal dua collection — tap Add to attach catalog duas. */
export default function DuaCollectionScreen() {
  const theme = useTheme();
  const params = useLocalSearchParams<{ collectionId?: string }>();
  const collectionId = firstParam(params.collectionId) ?? "";
  const collections = useDuaLibrary((s) => s.collections);
  const favoriteIds = useDuaLibrary((s) => s.favoriteIds);
  const removeFromCollection = useDuaLibrary((s) => s.removeFromCollection);
  const toggleFavorite = useDuaLibrary((s) => s.toggleFavorite);
  const [addOpen, setAddOpen] = useState(false);

  const collection = collections.find((item) => item.id === collectionId);
  const duas = useMemo(
    () => DuaLibraryManager.entriesForIds(collection?.duaIds ?? []),
    [collection?.duaIds]
  );

  if (!collection) {
    return (
      <Screen>
        <Stack.Screen options={{ title: "Collection", headerShown: true }} />
        <ThemedText variant="body">Collection not found.</ThemedText>
        <Button
          label="Back"
          onPress={() => stackBackNavigator.goBack()}
          style={styles.back}
        />
      </Screen>
    );
  }

  const openAdd = () => {
    haptics.selection();
    setAddOpen(true);
  };

  return (
    <Screen scroll>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: () => <DuaCollectionHeaderTitle collection={collection} />,
          headerRight: () => (
            <Pressable onPress={openAdd} hitSlop={8} style={styles.headerAdd}>
              <ThemedText variant="bodyStrong" style={{ color: theme.colors.accent }}>
                Add
              </ThemedText>
            </Pressable>
          ),
        }}
      />

      {duas.length === 0 ? (
        <Pressable onPress={openAdd} style={styles.empty}>
          <ThemedText variant="body" color="textSecondary">
            Empty. Tap Add to attach duas.
          </ThemedText>
        </Pressable>
      ) : (
        <View>
          {duas.map((dua) => (
            <DuaListRow
              key={dua.id}
              dua={dua}
              saved
              favorite={favoriteIds.includes(dua.id)}
              onPress={() => router.push(DuaRoutes.detail(dua.id))}
              onToggleFavorite={() => toggleFavorite(dua.id)}
              onToggleSave={() => removeFromCollection(collection.id, dua.id)}
            />
          ))}
        </View>
      )}

      <DuaAddToListModal
        visible={addOpen}
        listName={collection.name}
        initialSelectedIds={collection.duaIds}
        onClose={() => setAddOpen(false)}
        onSave={(duaIds) => {
          DuaLibraryManager.setListDuas(collection.id, duaIds);
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { marginTop: 16 },
  headerAdd: { marginRight: 4, paddingHorizontal: 4 },
  empty: { paddingVertical: 24 },
});
