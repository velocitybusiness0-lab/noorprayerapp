import React, { useCallback, useRef, useState } from "react";
import { LayoutChangeEvent, PanResponder, StyleSheet, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { ThemedText } from "@/components/primitives/ThemedText";
import { ONBOARDING_INK } from "@/features/onboarding/OnboardingPastelPalette";
import { OnboardingSignatureStrokeBuilder } from "@/features/onboarding/OnboardingSignatureStrokeBuilder";

interface OnboardingSignaturePadProps {
  strokeColor?: string;
  onSignatureChange?: (hasSignature: boolean) => void;
}

/**
 * Simple in-memory signature canvas — strokes are not persisted.
 * Uses PanResponder + SVG paths for the lightest drawing surface.
 */
export function OnboardingSignaturePad({
  strokeColor = ONBOARDING_INK,
  onSignatureChange,
}: OnboardingSignaturePadProps) {
  const [paths, setPaths] = useState<string[]>([]);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const activePathRef = useRef<string | null>(null);
  const hasSignatureRef = useRef(false);

  const emitSignatureChange = useCallback(
    (nextHasSignature: boolean) => {
      if (hasSignatureRef.current === nextHasSignature) return;
      hasSignatureRef.current = nextHasSignature;
      onSignatureChange?.(nextHasSignature);
    },
    [onSignatureChange]
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (event) => {
        const { locationX, locationY } = event.nativeEvent;
        activePathRef.current = OnboardingSignatureStrokeBuilder.startPath(
          locationX,
          locationY
        );
        setPaths((prev) => [...prev, activePathRef.current!]);
        emitSignatureChange(true);
      },
      onPanResponderMove: (event) => {
        const current = activePathRef.current;
        if (!current) return;
        const { locationX, locationY } = event.nativeEvent;
        const next = OnboardingSignatureStrokeBuilder.appendPoint(
          current,
          locationX,
          locationY
        );
        activePathRef.current = next;
        setPaths((prev) => {
          if (prev.length === 0) return [next];
          const copy = prev.slice();
          copy[copy.length - 1] = next;
          return copy;
        });
      },
      onPanResponderRelease: () => {
        activePathRef.current = null;
      },
      onPanResponderTerminate: () => {
        activePathRef.current = null;
      },
    })
  ).current;

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setSize({ width, height });
  };

  const showPlaceholder = paths.length === 0;

  return (
    <View
      style={styles.pad}
      onLayout={onLayout}
      {...panResponder.panHandlers}
    >
      {showPlaceholder ? (
        <View pointerEvents="none" style={styles.placeholderWrap}>
          <ThemedText variant="body" style={styles.placeholder}>
            Sign here
          </ThemedText>
        </View>
      ) : null}

      {size.width > 0 && size.height > 0 ? (
        <Svg width={size.width} height={size.height} style={StyleSheet.absoluteFill}>
          {paths.map((d, index) => (
            <Path
              key={`${index}-${d.slice(0, 24)}`}
              d={d}
              stroke={strokeColor}
              strokeWidth={2.5}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </Svg>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  pad: {
    width: "100%",
    minHeight: 180,
    flexGrow: 1,
    maxHeight: 260,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  placeholderWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholder: {
    color: "rgba(61,56,50,0.28)",
    fontSize: 22,
  },
});
