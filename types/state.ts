/**
 * Flowodoro State Machine Types
 *
 * This file defines all the strict types for the Flowodoro state machine.
 */

/**
 * The current mode of the app
 */
export enum AppMode {
  FOCUS = "FOCUS",
  RELAX = "RELAX",
}

/**
 * The complete application state
 */
export interface FlowodoroState {
  /** Current mode: FOCUS or RELAX */
  currentMode: AppMode;

  /** Focus session duration in minutes */
  focusDuration: number;

  /** Rest session duration in minutes */
  restDuration: number;

  /** Time remaining in current session (in seconds) */
  timeRemaining: number;

  /** Whether the timer is currently running */
  timerIsRunning: boolean;

  /** Whether we're currently in a focus cycle (vs rest cycle) */
  isFocusCycle: boolean;

  /** The URL of the audio stream */
  streamURL: string;
}

/**
 * Default initial state for the application
 */
export const INITIAL_STATE: FlowodoroState = {
  currentMode: AppMode.FOCUS,
  focusDuration: 25,
  restDuration: 5,
  timeRemaining: 25 * 60, // 1500 seconds
  timerIsRunning: false,
  isFocusCycle: true,
  streamURL: "https://coderadio-admin-v2.freecodecamp.org/listen/coderadio/radio.mp3",
};

/**
 * Actions that can be dispatched to modify state
 */
export enum TimerAction {
  START = "START",
  PAUSE = "PAUSE",
  RESET = "RESET",
  SWITCH_MODE = "SWITCH_MODE",
  TICK = "TICK",
  CYCLE_COMPLETE = "CYCLE_COMPLETE",
  SET_FOCUS_DURATION = "SET_FOCUS_DURATION",
  SET_REST_DURATION = "SET_REST_DURATION",
}

/**
 * Action payload types for type-safe dispatch
 */
export type StateAction =
  | { type: TimerAction.START }
  | { type: TimerAction.PAUSE }
  | { type: TimerAction.RESET }
  | { type: TimerAction.SWITCH_MODE; payload: AppMode }
  | { type: TimerAction.TICK }
  | { type: TimerAction.CYCLE_COMPLETE }
  | { type: TimerAction.SET_FOCUS_DURATION; payload: number }
  | { type: TimerAction.SET_REST_DURATION; payload: number };

/**
 * Audio player control interface
 */
export interface AudioControls {
  play: () => Promise<void>;
  pause: () => Promise<void>;
  isPlaying: boolean;
  isLoaded: boolean;
}
