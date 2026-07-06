import React, { useEffect } from "react";
import { Modal, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { haptics } from "@/core/haptics/HapticsManager";
import { ThemedText } from "@/components/primitives/ThemedText";
import { ConfettiBurst } from "@/components/celebration/ConfettiBurst";

interface NamazCompletionCelebrationProps {
  visible: boolean;
  onFinished: () => void;
}

/** Full-screen confetti and message when all five namaz are logged. */
export function NamazCompletionCelebration({ visible, onFinished }: NamazCompletionCelebrationProps) {
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (!visible) return;
    haptics.success();
    scale.value = withSequence(
      withTiming(1.05, { duration: 220, easing: Easing.out(Easing.quad) }),
      withTiming(1, { duration: 160 })
    );
    opacity.value = withTiming(1, { duration: 220 });
    const timer = setTimeout(onFinished, 2600);
    return () => clearTimeout(timer);
  }, [visible, onFinished, opacity, scale]);

  const labelStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onFinished}>
      <View style={styles.backdrop}>
        <ConfettiBurst active={visible} />
        <Animated.View style={labelStyle}>
          <ThemedText variant="title" color="accent" style={styles.label}>
            Namazes Completed
          </ThemedText>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(247,244,239,0.72)",
    alignItems: "center",
    justifyContent: "center",
  },
  label: { textAlign: "center", letterSpacing: 0.3 },
});
