import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { haptics } from "@/core/haptics/HapticsManager";
import { ThemedText } from "@/components/primitives/ThemedText";
import { Button } from "@/components/primitives/Button";
import { ScanTarget } from "@/features/scan/scanTargets";
import { MIRAJ_DEV_BUILD_ID, openDevBuildInstallPage } from "@/features/scan/DevBuildInstall";
import { ScanDevBuildGuide } from "@/features/scan/ScanDevBuildGuide";
import {
  ObjectHuntTargetPickerModal,
  ObjectHuntTargetPill,
} from "@/components/scan/ObjectHuntTargetPickerModal";
import { objectHuntTargets } from "@/features/scan/ObjectHuntTargetPool";

const FRAME_SIZE = 260;
const MISSION_CONTENT_WIDTH = FRAME_SIZE - 40;

interface ScanOverlayProps {
  missionTarget: ScanTarget | null;
  targets: ScanTarget[];
  isAutomatic: boolean;
  needsDevBuild: boolean;
  scanning: boolean;
  message: string;
  streakProgress: { current: number; required: number };
  succeeded: boolean;
  showCloseButton?: boolean;
  onClose?: () => void;
  onChangeMissionTarget?: (target: ScanTarget) => void;
}

/** Object-hunt guidance over the camera. */
export function ScanOverlay({
  missionTarget,
  targets,
  isAutomatic,
  needsDevBuild,
  scanning,
  message,
  streakProgress,
  succeeded,
  showCloseButton = false,
  onClose,
  onChangeMissionTarget,
}: ScanOverlayProps) {
  const insets = useSafeAreaInsets();
  const [pickerVisible, setPickerVisible] = useState(false);
  const rejected = !succeeded && message.startsWith("Not accepted");
  const wrongMission = !succeeded && message.startsWith("Wrong item");
  const iconName = (missionTarget?.icon ?? "scan-outline") as keyof typeof Ionicons.glyphMap;
  const huntTargets = objectHuntTargets();

  return (
    <View style={styles.fill} pointerEvents="box-none">
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        {showCloseButton && onClose ? (
          <Pressable
            onPress={() => {
              haptics.selection();
              onClose();
            }}
            hitSlop={12}
            style={styles.closeButton}
            accessibilityRole="button"
            accessibilityLabel="Close"
          >
            <Ionicons name="close" size={26} color="#FFFFFF" />
          </Pressable>
        ) : null}
        <ThemedText variant="bodyStrong" style={styles.white}>
          Object hunt
        </ThemedText>
        {!succeeded && missionTarget && onChangeMissionTarget ? (
          <ObjectHuntTargetPill
            label={missionTarget.label}
            onPress={() => setPickerVisible(true)}
          />
        ) : null}
      </View>

      <View style={styles.reticle}>
        <View
          style={[
            styles.frame,
            (rejected || wrongMission) && styles.frameRejected,
            streakProgress.current > 0 && styles.frameLocking,
          ]}
        />
        {succeeded ? (
          <View style={styles.status}>
            <Ionicons name="checkmark-circle" size={40} color="#FFFFFF" />
            <ThemedText variant="heading" style={[styles.white, styles.boxedText]}>
              Mission complete
            </ThemedText>
          </View>
        ) : missionTarget ? (
          <View style={styles.mission}>
            <Ionicons name={iconName} size={36} color="#FFFFFF" />
            <ThemedText
              variant="heading"
              style={[styles.white, styles.boxedText]}
              numberOfLines={2}
            >
              Find: {missionTarget.label}
            </ThemedText>
            <ThemedText
              variant="body"
              style={[styles.white, styles.boxedText]}
              numberOfLines={3}
            >
              {missionTarget.instruction}
            </ThemedText>
            {isAutomatic && streakProgress.current > 0 ? (
              <ThemedText variant="caption" style={[styles.white, styles.boxedText]}>
                Locking in… {streakProgress.current}/{streakProgress.required}
              </ThemedText>
            ) : null}
          </View>
        ) : (
          <View style={styles.mission}>
            <ThemedText
              variant="caption"
              style={[styles.white, styles.accepted, styles.boxedText]}
              numberOfLines={2}
            >
              Accepted: {targets.map((t) => t.label).join(" · ")}
            </ThemedText>
            <ThemedText
              variant="body"
              style={[styles.white, styles.boxedText]}
              numberOfLines={2}
            >
              Wrong item? Alarm keeps ringing.
            </ThemedText>
          </View>
        )}
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        {!succeeded && (
          <ThemedText
            variant="caption"
            style={[
              styles.white,
              styles.footerMessage,
              (rejected || wrongMission) && styles.rejectedText,
            ]}
            numberOfLines={3}
          >
            {scanning ? message : message}
          </ThemedText>
        )}
        {!succeeded && needsDevBuild ? (
          <>
            <ThemedText
              variant="caption"
              style={[styles.white, styles.devBuildHint]}
              numberOfLines={4}
            >
              {ScanDevBuildGuide.summary} Install build {MIRAJ_DEV_BUILD_ID} — Metro reload
              cannot add native modules.
            </ThemedText>
            <Button
              label={`Install build ${MIRAJ_DEV_BUILD_ID}`}
              variant="secondary"
              onPress={openDevBuildInstallPage}
              style={styles.manualButton}
            />
          </>
        ) : null}
      </View>

      {missionTarget && onChangeMissionTarget ? (
        <ObjectHuntTargetPickerModal
          visible={pickerVisible}
          targets={huntTargets}
          selectedTarget={missionTarget}
          onSelect={onChangeMissionTarget}
          onClose={() => setPickerVisible(false)}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { ...StyleSheet.absoluteFillObject, justifyContent: "space-between" },
  white: { color: "#FFFFFF", textAlign: "center" },
  header: {
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
  },
  closeButton: {
    position: "absolute",
    left: 16,
    top: 0,
    zIndex: 1,
  },
  reticle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    paddingHorizontal: 24,
  },
  frame: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.85)",
  },
  frameRejected: { borderColor: "rgba(255,120,120,0.95)" },
  frameLocking: { borderColor: "rgba(120,255,180,0.95)" },
  status: {
    position: "absolute",
    width: MISSION_CONTENT_WIDTH,
    maxWidth: "100%",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 8,
  },
  mission: {
    position: "absolute",
    width: MISSION_CONTENT_WIDTH,
    maxWidth: "100%",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 8,
  },
  boxedText: {
    alignSelf: "stretch",
    flexShrink: 1,
    flexWrap: "wrap",
    textAlign: "center",
  },
  accepted: { opacity: 0.85 },
  footer: {
    paddingHorizontal: 24,
    gap: 14,
    alignItems: "center",
    alignSelf: "stretch",
  },
  footerMessage: {
    alignSelf: "stretch",
    flexShrink: 1,
    paddingHorizontal: 8,
  },
  devBuildHint: { opacity: 0.9, alignSelf: "stretch", maxWidth: 320 },
  manualButton: { alignSelf: "stretch" },
  rejectedText: { color: "#FFB4B4" },
});
