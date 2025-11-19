/**
 * Flowodoro State Reducer
 *
 * This reducer implements the core business logic and state transitions
 * for the Flowodoro state machine.
 */

import { FlowodoroState, StateAction, TimerAction, AppMode } from "../types/state";

/**
 * Pure reducer function that handles all state transitions
 *
 * @param state - Current state
 * @param action - Action to perform
 * @returns New state
 */
export function flowodoroReducer(
  state: FlowodoroState,
  action: StateAction
): FlowodoroState {
  switch (action.type) {
    case TimerAction.START:
      return {
        ...state,
        timerIsRunning: true,
      };

    case TimerAction.PAUSE:
      return {
        ...state,
        timerIsRunning: false,
      };

    case TimerAction.RESET:
      // Reset to the current cycle's full duration
      return {
        ...state,
        timeRemaining: state.isFocusCycle
          ? state.focusDuration * 60
          : state.restDuration * 60,
        timerIsRunning: false,
      };

    case TimerAction.SWITCH_MODE:
      // Mode switching logic
      if (action.payload === AppMode.RELAX) {
        // Switching to RELAX: Stop timer, keep audio state as-is
        return {
          ...state,
          currentMode: AppMode.RELAX,
          timerIsRunning: false,
        };
      } else {
        // Switching to FOCUS: Reset timer display, don't auto-start
        return {
          ...state,
          currentMode: AppMode.FOCUS,
          timeRemaining: state.focusDuration * 60,
          timerIsRunning: false,
        };
      }

    case TimerAction.TICK:
      // Decrement time remaining (happens every second when timer is running)
      if (state.timeRemaining > 0) {
        return {
          ...state,
          timeRemaining: state.timeRemaining - 1,
        };
      }
      return state;

    case TimerAction.CYCLE_COMPLETE:
      // Handle cycle completion (Focus -> Rest or Rest -> Focus)
      if (state.isFocusCycle) {
        // Focus cycle just ended, switch to rest
        return {
          ...state,
          isFocusCycle: false,
          timeRemaining: state.restDuration * 60,
          timerIsRunning: true, // Auto-continue the countdown
        };
      } else {
        // Rest cycle just ended, switch to focus
        return {
          ...state,
          isFocusCycle: true,
          timeRemaining: state.focusDuration * 60,
          timerIsRunning: true, // Auto-continue the countdown
        };
      }

    case TimerAction.SET_FOCUS_DURATION:
      return {
        ...state,
        focusDuration: action.payload,
        // If currently in a focus cycle and timer isn't running, update timeRemaining
        ...(state.isFocusCycle && !state.timerIsRunning
          ? { timeRemaining: action.payload * 60 }
          : {}),
      };

    case TimerAction.SET_REST_DURATION:
      return {
        ...state,
        restDuration: action.payload,
        // If currently in a rest cycle and timer isn't running, update timeRemaining
        ...(!state.isFocusCycle && !state.timerIsRunning
          ? { timeRemaining: action.payload * 60 }
          : {}),
      };

    default:
      return state;
  }
}
