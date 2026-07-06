import React from "react";
import { Screen } from "@/components/primitives/Screen";
import { ThemedText } from "@/components/primitives/ThemedText";
import { StreakSummaryCard } from "@/components/history/StreakSummaryCard";
import { CompletionHeatmap } from "@/components/history/CompletionHeatmap";
import { RewardCard } from "@/components/history/RewardCard";
import { useHistory } from "@/features/history/historyStore";

export default function HistoryScreen() {
  const { streak, reward, completions } = useHistory();

  return (
    <Screen scroll tabBarPadding>
      <ThemedText variant="title">Streaks</ThemedText>
      <ThemedText variant="body" color="textSecondary">
        Keep every day complete to grow your streak.
      </ThemedText>

      <StreakSummaryCard streak={streak} />
      <RewardCard reward={reward} />
      <CompletionHeatmap completions={completions} />
    </Screen>
  );
}
