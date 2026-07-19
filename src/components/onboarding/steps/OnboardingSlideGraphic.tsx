import React from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { OnboardingSlideGraphicPalette as Palette } from "@/features/onboarding/OnboardingSlideGraphicPalette";
import { OnboardingSlideGraphicType } from "@/features/onboarding/onboarding.types";

interface OnboardingSlideGraphicProps {
  type: OnboardingSlideGraphicType;
}

/** Large composed illustrations for urgency and hope slides. */
export function OnboardingSlideGraphic({ type }: OnboardingSlideGraphicProps) {
  if (type === "domino") return <CascadeMissGraphic />;
  if (type === "hourglass") return <ClockGapGraphic />;
  return <DawnHopeGraphic />;
}

/** Falling tiles + warning — “one miss becomes many”. */
function CascadeMissGraphic() {
  return (
    <View style={styles.canvas}>
      <View style={styles.halo}>
        <Ionicons name="warning" size={52} color={Palette.cream} />
      </View>
      <View style={styles.cascadeRow}>
        {[0, 1, 2, 3].map((index) => (
          <View
            key={index}
            style={[
              styles.cascadeTile,
              {
                transform: [{ rotate: `${-6 + index * 12}deg` }],
                opacity: 1 - index * 0.14,
                marginTop: index * 10,
              },
            ]}
          >
            <Ionicons
              name={index === 0 ? "ellipse" : "close"}
              size={index === 0 ? 14 : 18}
              color={index === 0 ? Palette.sage : Palette.cream}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

/** Clock + widening gap — “waiting makes it worse”. */
function ClockGapGraphic() {
  return (
    <View style={styles.canvas}>
      <View style={styles.halo}>
        <Ionicons name="time" size={54} color={Palette.cream} />
      </View>
      <View style={styles.gapRow}>
        <View style={[styles.gapPill, styles.gapPillLeft]} />
        <View style={styles.gapChannel}>
          <Ionicons name="remove" size={28} color={Palette.sageMuted} />
          <Ionicons name="arrow-forward" size={22} color={Palette.sage} />
        </View>
        <View style={[styles.gapPill, styles.gapPillRight]} />
      </View>
      <View style={styles.clockBadge}>
        <Ionicons name="alarm" size={22} color={Palette.sage} />
      </View>
    </View>
  );
}

/** Dawn + salah mark — hope / rebuild slide. */
function DawnHopeGraphic() {
  return (
    <View style={styles.canvas}>
      <View style={styles.dawnGlow} />
      <View style={styles.sunDisc}>
        <Ionicons name="sunny" size={44} color={Palette.cream} />
      </View>
      <View style={styles.hopeRow}>
        <View style={styles.hopeChip}>
          <Ionicons name="moon" size={26} color={Palette.sage} />
        </View>
        <View style={[styles.hopeChip, styles.hopeChipCenter]}>
          <Ionicons name="hand-left" size={28} color={Palette.cream} />
        </View>
        <View style={styles.hopeChip}>
          <Ionicons name="checkmark-circle" size={28} color={Palette.sage} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: {
    width: 240,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  halo: {
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: Palette.whiteSoft,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: Palette.sageMuted,
    marginBottom: 18,
  },
  cascadeRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  cascadeTile: {
    width: 40,
    height: 56,
    borderRadius: 10,
    backgroundColor: Palette.cream,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Palette.sage,
  },
  gapRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  gapPill: {
    width: 44,
    height: 64,
    borderRadius: 12,
    backgroundColor: Palette.cream,
    borderWidth: 2,
    borderColor: Palette.sageMuted,
  },
  gapPillLeft: {
    transform: [{ rotate: "-8deg" }],
  },
  gapPillRight: {
    transform: [{ rotate: "8deg" }],
    opacity: 0.85,
  },
  gapChannel: {
    width: 72,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  clockBadge: {
    position: "absolute",
    right: 18,
    top: 18,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Palette.cream,
    alignItems: "center",
    justifyContent: "center",
  },
  dawnGlow: {
    position: "absolute",
    top: 28,
    width: 160,
    height: 80,
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
    backgroundColor: Palette.whiteSoft,
  },
  sunDisc: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Palette.sage,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: Palette.cream,
    marginBottom: 16,
  },
  hopeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  hopeChip: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Palette.cream,
    alignItems: "center",
    justifyContent: "center",
  },
  hopeChipCenter: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Palette.sage,
    borderWidth: 3,
    borderColor: Palette.cream,
  },
});
