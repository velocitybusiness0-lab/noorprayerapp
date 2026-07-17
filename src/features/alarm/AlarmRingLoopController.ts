import { NativeModules } from "react-native";
import { alarmSessionCoordinator } from "./AlarmSessionCoordinator";

const ALARM_LOOP = require("../../../assets/sounds/alarm_loop.wav");

type AudioPlayer = {
  loop: boolean;
  play: () => void;
  pause: () => void;
  release?: () => void;
};

type ExpoAudioBindings = {
  AudioPlayer: new (
    source: unknown,
    updateInterval?: number,
    keepAudioSessionActive?: boolean
  ) => AudioPlayer;
  setAudioModeAsync: (mode: {
    playsInSilentMode?: boolean;
    shouldPlayInBackground?: boolean;
    interruptionMode?: string;
  }) => Promise<void>;
  setIsAudioActiveAsync?: (active: boolean) => Promise<void>;
};

function loadExpoAudio(): ExpoAudioBindings | null {
  if (!NativeModules.ExpoAudio) return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require("expo-audio");
    if (!mod.AudioModule?.AudioPlayer) return null;
    return {
      AudioPlayer: mod.AudioModule.AudioPlayer,
      setAudioModeAsync: mod.setAudioModeAsync,
      setIsAudioActiveAsync: mod.setIsAudioActiveAsync,
    };
  } catch {
    return null;
  }
}

/**
 * Loops bundled alarm audio on the ring and scan screens until dismiss.
 * Always runs while the alarm session is active — AlarmKit may not audibly
 * alert when the app is already foregrounded on repeat fires.
 */
class AlarmRingLoopController {
  private audio: ExpoAudioBindings | null | undefined;
  private player: AudioPlayer | null = null;
  private activeAlarmId: string | null = null;
  private starting: Promise<void> | null = null;

  private getAudio(): ExpoAudioBindings | null {
    if (this.audio === undefined) this.audio = loadExpoAudio();
    return this.audio;
  }

  async ensurePlaying(alarmId: string): Promise<void> {
    if (!alarmSessionCoordinator.isActive(alarmId)) return;

    const audio = this.getAudio();
    if (!audio) return;

    if (this.activeAlarmId === alarmId && this.player) {
      this.player.play();
      return;
    }

    if (this.starting) {
      await this.starting;
      if (this.activeAlarmId === alarmId && this.player) this.player.play();
      return;
    }

    this.starting = this.startLoop(audio, alarmId);
    try {
      await this.starting;
    } finally {
      this.starting = null;
    }
  }

  async stop(): Promise<void> {
    this.activeAlarmId = null;
    await this.disposePlayer();
  }

  private async disposePlayer(): Promise<void> {
    if (!this.player) return;
    try {
      this.player.pause();
      this.player.release?.();
    } catch {
      // Player may already be released.
    }
    this.player = null;
  }

  private async startLoop(audio: ExpoAudioBindings, alarmId: string): Promise<void> {
    await this.disposePlayer();

    await audio.setIsAudioActiveAsync?.(true);
    await audio.setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      interruptionMode: "mixWithOthers",
    });

    const player = new audio.AudioPlayer(ALARM_LOOP, 500, true);
    player.loop = true;
    player.play();
    this.player = player;
    this.activeAlarmId = alarmId;
  }
}

export const alarmRingLoop = new AlarmRingLoopController();
