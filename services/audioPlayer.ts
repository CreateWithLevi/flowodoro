/**
 * Audio Player Service
 *
 * Manages the audio stream playback using expo-av.
 * This service is responsible for loading, playing, and pausing the audio stream.
 *
 * CRITICAL: Configured for background audio playback on iOS.
 * - AVAudioSession category: Playback
 * - Background modes: Audio enabled
 * - Continues playing when screen locks or app is backgrounded
 */

import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from "expo-av";
import { AVPlaybackStatus } from "expo-av";

const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 1000; // Start with 1 second

export class AudioPlayerService {
  private sound: Audio.Sound | null = null;
  private isLoaded: boolean = false;
  private isPlaying: boolean = false;
  private currentURL: string = "";
  private audioSessionConfigured: boolean = false;

  /**
   * Configure AVAudioSession for background playback
   *
   * Category: AVAudioSessionCategoryPlayback (expo-av: "playback")
   * Mode: AVAudioSessionModeDefault
   * Options: Allow background playback and mixing
   *
   * Includes retry logic with exponential backoff
   */
  private async configureAudioSession(retryAttempt: number = 0): Promise<void> {
    try {
      console.log(`[AudioSession] Configuring audio session (attempt ${retryAttempt + 1}/${MAX_RETRY_ATTEMPTS})...`);

      // CRITICAL: Configure AVAudioSession for continuous background playback
      await Audio.setAudioModeAsync({
        // iOS: Allow playback in silent mode (hardware mute switch)
        playsInSilentModeIOS: true,

        // iOS/Android: Keep audio active when app is backgrounded or screen locks
        staysActiveInBackground: true,

        // iOS: Interrupt other apps' audio (we're the primary audio source)
        interruptionModeIOS: InterruptionModeIOS.DoNotMix,

        // Android: Lower volume of other apps when we play
        shouldDuckAndroid: true,

        // Android: Keep playing when notifications come in
        interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,

        // Android: Request audio focus for music playback
        playThroughEarpieceAndroid: false,
      });

      this.audioSessionConfigured = true;
      console.log("[AudioSession] ✅ Audio session configured successfully");
    } catch (error) {
      console.error(`[AudioSession] ❌ Failed to configure audio session (attempt ${retryAttempt + 1}):`, error);

      // Retry with exponential backoff
      if (retryAttempt < MAX_RETRY_ATTEMPTS - 1) {
        const delay = RETRY_DELAY_MS * Math.pow(2, retryAttempt);
        console.log(`[AudioSession] Retrying in ${delay}ms...`);

        await new Promise(resolve => setTimeout(resolve, delay));
        return this.configureAudioSession(retryAttempt + 1);
      } else {
        console.error("[AudioSession] ❌ Max retry attempts reached. Audio session configuration failed.");
        throw error;
      }
    }
  }

  /**
   * Initialize the audio player with a stream URL
   */
  async initialize(streamURL: string): Promise<void> {
    try {
      console.log("[AudioPlayer] Initializing audio player...");

      // Step 1: Configure audio session (with retry logic)
      if (!this.audioSessionConfigured) {
        await this.configureAudioSession();
      }

      // Step 2: Load the sound
      console.log(`[AudioPlayer] Loading audio stream: ${streamURL}`);
      const { sound } = await Audio.Sound.createAsync(
        { uri: streamURL },
        { shouldPlay: false },
        this.onPlaybackStatusUpdate
      );

      this.sound = sound;
      this.currentURL = streamURL;
      this.isLoaded = true;
      console.log("[AudioPlayer] ✅ Audio player initialized successfully");
    } catch (error) {
      console.error("[AudioPlayer] ❌ Failed to initialize audio player:", error);
      throw error;
    }
  }

  /**
   * Playback status update callback
   */
  private onPlaybackStatusUpdate = (status: AVPlaybackStatus): void => {
    if (status.isLoaded) {
      this.isPlaying = status.isPlaying;
    }
  };

  /**
   * Play the audio stream
   *
   * Will continue playing in background and when screen is locked
   */
  async play(): Promise<void> {
    if (!this.sound || !this.isLoaded) {
      console.error("[AudioPlayer] ❌ Cannot play: Audio player not initialized");
      throw new Error("Audio player not initialized");
    }

    try {
      console.log("[AudioPlayer] ▶️ Playing audio...");
      await this.sound.playAsync();
      this.isPlaying = true;
      console.log("[AudioPlayer] ✅ Audio playing (will continue in background)");
    } catch (error) {
      console.error("[AudioPlayer] ❌ Failed to play audio:", error);
      throw error;
    }
  }

  /**
   * Pause the audio stream
   */
  async pause(): Promise<void> {
    if (!this.sound || !this.isLoaded) {
      console.error("[AudioPlayer] ❌ Cannot pause: Audio player not initialized");
      throw new Error("Audio player not initialized");
    }

    try {
      console.log("[AudioPlayer] ⏸ Pausing audio...");
      await this.sound.pauseAsync();
      this.isPlaying = false;
      console.log("[AudioPlayer] ✅ Audio paused");
    } catch (error) {
      console.error("[AudioPlayer] ❌ Failed to pause audio:", error);
      throw error;
    }
  }

  /**
   * Stop and unload the audio
   */
  async stop(): Promise<void> {
    if (this.sound) {
      try {
        console.log("[AudioPlayer] ⏹ Stopping audio...");
        await this.sound.stopAsync();
        await this.sound.unloadAsync();
        console.log("[AudioPlayer] ✅ Audio stopped and unloaded");
      } catch (error) {
        console.error("[AudioPlayer] ❌ Failed to stop audio:", error);
      } finally {
        this.sound = null;
        this.isLoaded = false;
        this.isPlaying = false;
      }
    }
  }

  /**
   * Check if audio is currently playing
   */
  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  /**
   * Check if audio is loaded
   */
  getIsLoaded(): boolean {
    return this.isLoaded;
  }

  /**
   * Get the current stream URL
   */
  getCurrentURL(): string {
    return this.currentURL;
  }

  /**
   * Change the stream URL (will reload the audio)
   */
  async changeStream(newURL: string): Promise<void> {
    const wasPlaying = this.isPlaying;
    await this.stop();
    await this.initialize(newURL);
    if (wasPlaying) {
      await this.play();
    }
  }
}

// Singleton instance
export const audioPlayer = new AudioPlayerService();
