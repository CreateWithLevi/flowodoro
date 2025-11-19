/**
 * Audio Player Service
 *
 * Manages the audio stream playback using expo-av.
 * This service is responsible for loading, playing, and pausing the audio stream.
 */

import { Audio } from "expo-av";
import { AVPlaybackStatus } from "expo-av";

export class AudioPlayerService {
  private sound: Audio.Sound | null = null;
  private isLoaded: boolean = false;
  private isPlaying: boolean = false;
  private currentURL: string = "";

  /**
   * Initialize the audio player with a stream URL
   */
  async initialize(streamURL: string): Promise<void> {
    try {
      // Set audio mode for continuous playback
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });

      // Load the sound
      const { sound } = await Audio.Sound.createAsync(
        { uri: streamURL },
        { shouldPlay: false },
        this.onPlaybackStatusUpdate
      );

      this.sound = sound;
      this.currentURL = streamURL;
      this.isLoaded = true;
    } catch (error) {
      console.error("Failed to initialize audio player:", error);
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
   */
  async play(): Promise<void> {
    if (!this.sound || !this.isLoaded) {
      throw new Error("Audio player not initialized");
    }

    try {
      await this.sound.playAsync();
      this.isPlaying = true;
    } catch (error) {
      console.error("Failed to play audio:", error);
      throw error;
    }
  }

  /**
   * Pause the audio stream
   */
  async pause(): Promise<void> {
    if (!this.sound || !this.isLoaded) {
      throw new Error("Audio player not initialized");
    }

    try {
      await this.sound.pauseAsync();
      this.isPlaying = false;
    } catch (error) {
      console.error("Failed to pause audio:", error);
      throw error;
    }
  }

  /**
   * Stop and unload the audio
   */
  async stop(): Promise<void> {
    if (this.sound) {
      try {
        await this.sound.stopAsync();
        await this.sound.unloadAsync();
      } catch (error) {
        console.error("Failed to stop audio:", error);
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
