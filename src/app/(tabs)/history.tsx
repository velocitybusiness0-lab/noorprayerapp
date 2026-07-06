import React from "react";
import { Screen } from "@/components/primitives/Screen";
import { ThemedText } from "@/components/primitives/ThemedText";
import { CompletionHeatmap } from "@/components/history/CompletionHeatmap";
import { PlayerProgressCard } from "@/components/history/PlayerProgressCard";
import { StreakSummaryCard } from "@/components/history/StreakSummaryCard";
import { WeeklyNamazChart } from "@/components/history/WeeklyNamazChart";
import { useHistory } from "@/features/history/historyStore";

export default function HistoryScreen() {
  const { streak, progress, completions } = useHistory();

  return (
    <Screen scroll tabBarPadding>
      <ThemedText variant="title">Progress</ThemedText>
      <ThemedText variant="body" color="textSecondary">
        Tick namaz on Today to earn XP and level up.
      </ThemedText>

      <StreakSummaryCard streak={streak} totalNamaz={progress.totalNamaz} />
      <PlayerProgressCard progress={progress} />
      <WeeklyNamazChart completions={completions} />
      <CompletionHeatmap completions={completions} />
    </Screen>
  );
}
