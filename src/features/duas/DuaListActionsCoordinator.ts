import { Alert } from "react-native";
import { haptics } from "@/core/haptics/HapticsManager";
import { DuaCollection } from "./dua.types";

interface ListActionHandlers {
  onRename: () => void;
  onDelete: () => void;
}

/** Presents rename / delete actions for a My Duas list tile. */
export class DuaListActionsCoordinator {
  present(collection: DuaCollection, handlers: ListActionHandlers): void {
    haptics.selection();
    Alert.alert(collection.name, undefined, [
      { text: "Rename", onPress: handlers.onRename },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => this.confirmDelete(collection, handlers.onDelete),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  }

  confirmDelete(collection: DuaCollection, onConfirm: () => void): void {
    haptics.warning();
    Alert.alert("Delete list?", `Delete "${collection.name}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          haptics.success();
          onConfirm();
        },
      },
    ]);
  }
}

export const duaListActionsCoordinator = new DuaListActionsCoordinator();
