import React from "react";
import { Platform } from "react-native";
import { AndroidBlockingSection } from "./AndroidBlockingSection";
import { IosBlockingSection } from "./IosBlockingSection";

/** Routes app blocking settings to the platform-specific implementation. */
export function BlockingSection() {
  if (Platform.OS === "android") return <AndroidBlockingSection />;
  return <IosBlockingSection />;
}
