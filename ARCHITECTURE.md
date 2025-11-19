# Flowodoro - State Machine Architecture

## Overview

Flowodoro is an autonomous Pomodoro timer with a dual-mode audio player built on a robust state machine architecture. The system automatically manages focus/rest cycles and synchronizes audio playback with the timer state.

## Core Architecture

### 1. Data Schema (Backend Variables)

All application state is strictly typed using TypeScript. The state is defined in `types/state.ts`:

```typescript
interface FlowodoroState {
  currentMode: AppMode;      // "FOCUS" | "RELAX"
  focusDuration: number;     // Minutes (default: 25)
  restDuration: number;      // Minutes (default: 5)
  timeRemaining: number;     // Seconds (default: 1500)
  timerIsRunning: boolean;   // Default: false
  isFocusCycle: boolean;     // Default: true
  streamURL: string;         // Audio stream URL
}
```

**Default Values:**
- `currentMode`: `AppMode.FOCUS`
- `focusDuration`: `25` minutes
- `restDuration`: `5` minutes
- `timeRemaining`: `1500` seconds (25 * 60)
- `timerIsRunning`: `false`
- `isFocusCycle`: `true`
- `streamURL`: `"https://coderadio-admin-v2.freecodecamp.org/listen/coderadio/radio.mp3"`

### 2. State Machine Implementation

The state machine is implemented using React's `useReducer` hook with a pure reducer function (`state/reducer.ts`). This ensures predictable state transitions and makes the logic testable.

#### State Transitions

**Actions:**
- `START` - Start the timer
- `PAUSE` - Pause the timer
- `RESET` - Reset timer to current cycle's full duration
- `SWITCH_MODE` - Switch between FOCUS and RELAX modes
- `TICK` - Decrement time by 1 second
- `CYCLE_COMPLETE` - Handle transition between focus and rest cycles

### 3. Business Logic (The Controller)

The controller is implemented in `hooks/useFlowodoroController.ts` and orchestrates all business logic.

#### Mode Switching Logic

**Switching to RELAX:**
- Stops the running timer
- Does NOT stop audio if it's playing
- Preserves current audio state

**Switching to FOCUS:**
- Resets timer display to `focusDuration`
- Does NOT auto-start the timer
- User must manually start

```typescript
const switchMode = async (newMode: AppMode) => {
  dispatch({ type: TimerAction.SWITCH_MODE, payload: newMode });
  // Audio state is preserved, timer is stopped/reset but not started
};
```

#### The Autonomous Timer Loop

The autonomous loop is the heart of Flowodoro. It runs continuously when `timerIsRunning` is `true`.

**Implementation Details:**

```typescript
useEffect(() => {
  if (state.timerIsRunning) {
    timerRef.current = setInterval(() => {
      dispatch({ type: TimerAction.TICK });
    }, 1000);
  }
  return () => clearInterval(timerRef.current);
}, [state.timerIsRunning]);
```

**Cycle Completion Logic:**

The system watches for `timeRemaining === 0` and automatically handles transitions:

**Condition A: Focus Cycle Ended**
- When `timeRemaining === 0` AND `isFocusCycle === true`
- Actions:
  1. Set `isFocusCycle = false`
  2. Set `timeRemaining = restDuration * 60`
  3. **PAUSE the audio player** (Silence = Rest)
  4. **Auto-start rest countdown** (timer continues running)

**Condition B: Rest Cycle Ended**
- When `timeRemaining === 0` AND `isFocusCycle === false`
- Actions:
  1. Set `isFocusCycle = true`
  2. Set `timeRemaining = focusDuration * 60`
  3. **PLAY the audio player** (Music = Focus)
  4. **Auto-start focus countdown** (timer continues running)

```typescript
useEffect(() => {
  const handleCycleCompletion = async () => {
    if (state.timeRemaining === 0 && state.timerIsRunning) {
      if (state.isFocusCycle) {
        // Focus ended -> Start rest
        await audioPlayer.pause();
      } else {
        // Rest ended -> Start focus
        await audioPlayer.play();
      }
      dispatch({ type: TimerAction.CYCLE_COMPLETE });
    }
  };
  handleCycleCompletion();
}, [state.timeRemaining, state.timerIsRunning, state.isFocusCycle]);
```

### 4. Audio Player Integration

The audio player is implemented as a singleton service (`services/audioPlayer.ts`) using `expo-av`.

**Features:**
- Binds audio source to `streamURL`
- Provides `play()` and `pause()` methods
- Maintains audio state independently
- Supports background playback
- Handles stream URL changes

**Audio Configuration:**
```typescript
await Audio.setAudioModeAsync({
  playsInSilentModeIOS: true,
  staysActiveInBackground: true,
  shouldDuckAndroid: true,
});
```

**Integration with State Machine:**
- Audio state is synchronized with cycle transitions
- Manual play/pause controls are always available
- Audio continues during mode switches (unless explicitly paused)

## File Structure

```
flowodoro/
├── types/
│   └── state.ts              # Type definitions and enums
├── state/
│   └── reducer.ts            # State machine reducer
├── services/
│   └── audioPlayer.ts        # Audio player service
├── hooks/
│   └── useFlowodoroController.ts  # Main controller hook
└── App.tsx                   # Demo application
```

## Key Design Decisions

### 1. Separation of Concerns
- **Types**: Strict TypeScript definitions
- **State**: Pure reducer functions (no side effects)
- **Services**: Audio player isolated from state
- **Controller**: Orchestrates state + services + effects

### 2. Autonomous Operation
- Timer runs independently once started
- Automatic cycle transitions
- No user intervention required between cycles
- Audio syncs automatically with cycles

### 3. Type Safety
- All state strictly typed
- Discriminated union for actions
- No magic strings or numbers

### 4. Predictable State
- Immutable state updates
- Pure reducer functions
- Single source of truth
- Easy to test and debug

## Usage Example

```typescript
import { useFlowodoroController } from './hooks/useFlowodoroController';

function MyComponent() {
  const {
    state,
    startTimer,
    pauseTimer,
    switchMode,
    playAudio,
    pauseAudio,
  } = useFlowodoroController();

  return (
    <View>
      <Text>Time: {formatTime(state.timeRemaining)}</Text>
      <Text>Mode: {state.currentMode}</Text>
      <Text>Cycle: {state.isFocusCycle ? 'FOCUS' : 'REST'}</Text>

      <Button onPress={startTimer} title="Start" />
      <Button onPress={pauseTimer} title="Pause" />
      <Button onPress={() => switchMode(AppMode.FOCUS)} title="Focus Mode" />
      <Button onPress={() => switchMode(AppMode.RELAX)} title="Relax Mode" />
      <Button onPress={playAudio} title="Play Audio" />
      <Button onPress={pauseAudio} title="Pause Audio" />
    </View>
  );
}
```

## Testing the State Machine

The state machine can be tested independently:

```typescript
import { flowodoroReducer } from './state/reducer';
import { INITIAL_STATE, TimerAction } from './types/state';

// Test timer start
let state = flowodoroReducer(INITIAL_STATE, { type: TimerAction.START });
expect(state.timerIsRunning).toBe(true);

// Test cycle completion
state = { ...state, timeRemaining: 0, isFocusCycle: true };
state = flowodoroReducer(state, { type: TimerAction.CYCLE_COMPLETE });
expect(state.isFocusCycle).toBe(false);
expect(state.timeRemaining).toBe(5 * 60);
```

## Future Enhancements

Potential additions to the state machine:

1. **Long break cycles**: Add a 4th cycle for extended breaks
2. **Notification system**: Alert when cycles complete
3. **Analytics**: Track focus time and productivity
4. **Custom audio URLs**: Allow user-defined streams
5. **Persistence**: Save state to AsyncStorage
6. **Configurable durations**: UI for changing focus/rest times

## Performance Considerations

- Timer uses `setInterval` for 1-second ticks (acceptable for this use case)
- Audio player maintains single instance (singleton pattern)
- State updates are minimal and predictable
- No unnecessary re-renders (React.memo could be added to child components)

## Conclusion

The Flowodoro state machine provides a robust, type-safe foundation for an autonomous Pomodoro timer. The separation of concerns, predictable state transitions, and automatic cycle management make it maintainable and extensible.
