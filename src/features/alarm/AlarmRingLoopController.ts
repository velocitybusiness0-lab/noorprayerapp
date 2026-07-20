import { alarmSessionCoordinator } from "./AlarmSessionCoordinator";
import { alarmRingAudioPolicy } from "./AlarmRingAudioPolicy";

const ALARM_LOOP = require("../../../assets/sounds/alarm_loop.wav");

type AudioPlayer = {
  loop: boolean;
  playing?: boolean;
  play: () => void;
  pause: () => void;
  remove?: () => void;
  release?: () => void;
};

type ExpoAudioBindings = {
  createPlayer: (source: unknown) => AudioPlayer;
  setAudioModeAsync: (mode: {
    playsInSilentMode?: boolean;
    shouldPlayInBackground?: boolean;
    interruptionMode?: string;
  }) => Promise<void>;
  setIsAudioActiveAsync?: (active: boolean) => Promise<void>;
};

function loadExpoAudio(): ExpoAudioBindings | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require("expo-audio");

    if (typeof mod.createAudioPlayer === "function") {
      return {
        createPlayer: (source) =>
          mod.createAudioPlayer(source, { updateInterval: 500, keepAudioSessionActive: true }),
        setAudioModeAsync: mod.setAudioModeAsync,
        setIsAudioActiveAsync: mod.setIsAudioActiveAsync,
      };
    }

    if (mod.AudioModule?.AudioPlayer) {
      return {
        createPlayer: (source) => new mod.AudioModule.AudioPlayer(source, 500, true),
        setAudioModeAsync: mod.setAudioModeAsync,
        setIsAudioActiveAsync: mod.setIsAudioActiveAsync,
      };
    }

    return null;
  } catch (error) {
    if (__DEV__) console.warn("[AlarmRingLoop] expo-audio unavailable", error);
    return null;
  }
}

/**
 * In-app loop only when AlarmKit is not owning the alarm.
 * Never starts during an AlarmKit dismiss flow — that would swap ringtones.
 */
class AlarmRingLoopController {
  private audio: ExpoAudioBindings | null | undefined;
  private player: AudioPlayer | null = null;
  private activeAlarmIdField: string | null = null;
  private starting: Promise<void> | null = null;

  private getAudio(): ExpoAudioBindings | null {
    if (this.audio === undefined) this.audio = loadExpoAudio();
    return this.audio;
  }

  async ensurePlaying(alarmId: string): Promise<void> {
    if (!alarmSessionCoordinator.isActive(alarmId)) {
      alarmSessionCoordinator.onAlarmFired(alarmId);
    }

    if (!alarmRingAudioPolicy.shouldPlayInAppLoop(alarmId)) {
      if (this.player) {
        if (__DEV__) {
          console.info(`[AlarmRingLoop] AlarmKit owns audio — no in-app loop for ${alarmId}`);
        }
        await this.disposePlayer();
        this.activeAlarmIdField = null;
      }
      return;
    }

    const audio = this.getAudio();
    if (!audio) {
      if (__DEV__) console.warn("[AlarmRingLoop] No audio module — cannot play alarm sound");
      return;
    }

    if (this.activeAlarmIdField === alarmId && this.player) {
      if (this.resumePlayer()) return;
    }

    if (this.starting) {
      await this.starting;
      if (this.activeAlarmIdField === alarmId && this.player && this.resumePlayer()) return;
    }

    this.starting = this.startLoop(audio, alarmId);
    try {
      await this.starting;
    } finally {
      this.starting = null;
    }
  }

  /** Alarm id currently driving the in-app fallback loop, if any. */
  get activeAlarmId(): string | null {
    return this.activeAlarmIdField;
  }

  async stop(): Promise<void> {
    this.activeAlarmIdField = null;
    await this.disposePlayer();
  }

  private resumePlayer(): boolean {
    if (!this.player) return false;
    try {
      this.player.play();
      if (this.player.playing === false) return false;
      return true;
    } catch (error) {
      if (__DEV__) console.warn("[AlarmRingLoop] resume failed", error);
      return false;
    }
  }

  private async disposePlayer(): Promise<void> {
    if (!this.player) return;
    try {
      this.player.pause();
      this.player.remove?.();
      this.player.release?.();
    } catch {
      // Player may already be released.
    }
    this.player = null;
  }

  private async startLoop(audio: ExpoAudioBindings, alarmId: string): Promise<void> {
    await this.disposePlayer();

    try {
      await audio.setIsAudioActiveAsync?.(true);
      await audio.setAudioModeAsync({
        playsInSilentMode: true,
        shouldPlayInBackground: true,
        interruptionMode: "doNotMix",
      });

      const player = audio.createPlayer(ALARM_LOOP);
      player.loop = true;
      player.play();
      this.player = player;
      this.activeAlarmIdField = alarmId;
      if (__DEV__) console.info(`[AlarmRingLoop] playing in-app fallback for ${alarmId}`);
    } catch (error) {
      if (__DEV__) console.warn("[AlarmRingLoop] start failed", error);
      this.player = null;
      this.activeAlarmIdField = null;
    }
  }
}

export const alarmRingLoop = new AlarmRingLoopController();
