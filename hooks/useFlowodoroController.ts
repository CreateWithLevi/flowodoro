/**
 * Flowodoro Controller Hook
 *
 * This is the main controller that orchestrates the entire Flowodoro state machine.
 * It manages:
 * - State management via reducer
 * - Autonomous timer loop
 * - Audio player integration
 * - Cycle transitions (Focus <-> Rest)
 */

import { useEffect, useReducer, useRef, useCallback } from "react";
import { flowodoroReducer } from "../state/reducer";
import { INITIAL_STATE } from "../types/state";
import { TimerAction, AppMode } from "../types/state";
import { audioPlayer } from "../services/audioPlayer";

export function useFlowodoroController() {
  const [state, dispatch] = useReducer(flowodoroReducer, INITIAL_STATE);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isAudioInitialized = useRef(false);

  /**
   * Initialize the audio player on mount
   */
  useEffect(() => {
    const initAudio = async () => {
      if (!isAudioInitialized.current) {
        try {
          await audioPlayer.initialize(state.streamURL);
          isAudioInitialized.current = true;
        } catch (error) {
          console.error("Failed to initialize audio:", error);
        }
      }
    };

    initAudio();

    // Cleanup on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      audioPlayer.stop();
    };
  }, []);

  /**
   * THE AUTONOMOUS TIMER LOOP
   *
   * This effect runs the core timer logic:
   * - Ticks every second when timer is running
   * - Handles cycle completion
   * - Manages audio state based on cycle type
   */
  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Only run timer when timerIsRunning is TRUE
    if (state.timerIsRunning) {
      timerRef.current = setInterval(() => {
        dispatch({ type: TimerAction.TICK });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [state.timerIsRunning]);

  /**
   * CYCLE COMPLETION LOGIC
   *
   * Watches for when timeRemaining hits 0 and handles the transition
   */
  useEffect(() => {
    const handleCycleCompletion = async () => {
      if (state.timeRemaining === 0 && state.timerIsRunning) {
        // Condition A: Focus cycle ended
        if (state.isFocusCycle) {
          console.log("Focus cycle completed. Starting rest cycle.");
          // PAUSE the audio (Silence = Rest)
          try {
            await audioPlayer.pause();
          } catch (error) {
            console.error("Failed to pause audio:", error);
          }
        }
        // Condition B: Rest cycle ended
        else {
          console.log("Rest cycle completed. Starting focus cycle.");
          // PLAY the audio (Music = Focus)
          try {
            await audioPlayer.play();
          } catch (error) {
            console.error("Failed to play audio:", error);
          }
        }

        // Dispatch cycle completion to transition state
        // This will auto-start the next cycle
        dispatch({ type: TimerAction.CYCLE_COMPLETE });
      }
    };

    handleCycleCompletion();
  }, [state.timeRemaining, state.timerIsRunning, state.isFocusCycle]);

  /**
   * PUBLIC API: Start the timer
   */
  const startTimer = useCallback(async () => {
    dispatch({ type: TimerAction.START });

    // If starting a focus cycle, play audio
    if (state.isFocusCycle) {
      try {
        await audioPlayer.play();
      } catch (error) {
        console.error("Failed to play audio:", error);
      }
    }
  }, [state.isFocusCycle]);

  /**
   * PUBLIC API: Pause the timer
   */
  const pauseTimer = useCallback(() => {
    dispatch({ type: TimerAction.PAUSE });
  }, []);

  /**
   * PUBLIC API: Reset the timer
   */
  const resetTimer = useCallback(() => {
    dispatch({ type: TimerAction.RESET });
  }, []);

  /**
   * PUBLIC API: Switch mode
   *
   * Mode switching logic:
   * - RELAX: Stop timer, keep audio state
   * - FOCUS: Reset timer, don't auto-start
   */
  const switchMode = useCallback(async (newMode: AppMode) => {
    dispatch({ type: TimerAction.SWITCH_MODE, payload: newMode });

    // When switching to RELAX, audio state is preserved
    // When switching to FOCUS, timer is reset but not started
  }, []);

  /**
   * PUBLIC API: Play audio manually
   */
  const playAudio = useCallback(async () => {
    try {
      await audioPlayer.play();
    } catch (error) {
      console.error("Failed to play audio:", error);
    }
  }, []);

  /**
   * PUBLIC API: Pause audio manually
   */
  const pauseAudio = useCallback(async () => {
    try {
      await audioPlayer.pause();
    } catch (error) {
      console.error("Failed to pause audio:", error);
    }
  }, []);

  /**
   * PUBLIC API: Set focus duration
   */
  const setFocusDuration = useCallback((minutes: number) => {
    dispatch({ type: TimerAction.SET_FOCUS_DURATION, payload: minutes });
  }, []);

  /**
   * PUBLIC API: Set rest duration
   */
  const setRestDuration = useCallback((minutes: number) => {
    dispatch({ type: TimerAction.SET_REST_DURATION, payload: minutes });
  }, []);

  /**
   * Format time for display (MM:SS)
   */
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, []);

  return {
    // State
    state,

    // Timer controls
    startTimer,
    pauseTimer,
    resetTimer,

    // Mode switching
    switchMode,

    // Audio controls
    playAudio,
    pauseAudio,

    // Settings
    setFocusDuration,
    setRestDuration,

    // Utilities
    formatTime,
    isAudioPlaying: audioPlayer.getIsPlaying(),
  };
}
