# Flowodoro

**Autonomous Pomodoro Timer with Dual-Mode Audio Player**

A robust iOS app built with Expo/React Native that implements an autonomous Pomodoro timer with integrated audio streaming. The app automatically manages focus and rest cycles while synchronizing background music with your productivity flow.

## Features

- **Autonomous Timer**: Automatically transitions between focus and rest cycles
- **Dual-Mode Audio**: Music plays during focus, silence during rest
- **Premium Design**: "Zen" theme with deep indigo (#1c213c) and white aesthetics
- **State Machine Architecture**: Robust, predictable state management
- **Type-Safe**: Built with TypeScript for reliability
- **Background Playback**: Audio continues in background
- **Manual Controls**: Full control over timer and audio
- **Smooth Animations**: 300ms fade transitions for calming UX

## Design System

Flowodoro implements a premium, minimalist "Zen" theme:

- **Color Palette**: Deep Indigo (#1c213c) background with Pure White (#FFFFFF) text
- **Typography**: Clean sans-serif with lightweight fonts for large displays
- **Animations**: Smooth 300ms opacity fades for all transitions
- **Conditional UI**: Different layouts for FOCUS (circular timer) and RELAX (audio player) modes
- **Accessibility**: AAA color contrast, 44pt minimum touch targets

For complete design documentation, see [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md).

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo Go app (for testing on device)

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

### Run on Device

```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

Or scan the QR code with Expo Go app on your phone.

## How It Works

### The Autonomous Loop

Once you press **Start**, Flowodoro runs autonomously:

1. **Focus Period** (25 min default)
   - Timer counts down
   - Music plays automatically
   - When timer hits 0:00 → Auto-switch to rest

2. **Rest Period** (5 min default)
   - Timer counts down
   - Music pauses automatically (silence = rest)
   - When timer hits 0:00 → Auto-switch to focus

3. **Repeat**
   - Cycles continue indefinitely
   - No intervention needed
   - Manual pause available anytime

### Mode Switching

**Focus Mode**
- Dedicated focus work time
- Reset timer to focus duration
- Does NOT auto-start (manual start required)

**Relax Mode**
- Free-form relaxation
- Stops timer
- Audio state preserved

### Audio Control

- **Automatic**: Syncs with focus/rest cycles
- **Manual**: Play/Pause buttons always available
- **Stream**: Default is freeCodeCamp's CodeRadio
- **Background**: Continues when app is backgrounded

## Project Structure

```
flowodoro/
├── types/
│   └── state.ts                    # TypeScript type definitions
├── state/
│   └── reducer.ts                  # State machine logic
├── services/
│   └── audioPlayer.ts              # Audio player service
├── hooks/
│   └── useFlowodoroController.ts   # Main controller
├── App.tsx                         # Demo application
├── ARCHITECTURE.md                 # Detailed architecture docs
└── README.md                       # This file
```

## State Machine Variables

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `currentMode` | Enum | `FOCUS` | Current app mode (FOCUS/RELAX) |
| `focusDuration` | Number | `25` | Focus session length (minutes) |
| `restDuration` | Number | `5` | Rest session length (minutes) |
| `timeRemaining` | Number | `1500` | Current countdown (seconds) |
| `timerIsRunning` | Boolean | `false` | Is timer active |
| `isFocusCycle` | Boolean | `true` | Current cycle type |
| `streamURL` | String | CodeRadio | Audio stream URL |

## API Reference

### useFlowodoroController Hook

```typescript
const {
  state,              // Current state object
  startTimer,         // Start the countdown
  pauseTimer,         // Pause the countdown
  resetTimer,         // Reset to full duration
  switchMode,         // Switch FOCUS/RELAX
  playAudio,          // Play audio stream
  pauseAudio,         // Pause audio stream
  setFocusDuration,   // Change focus length
  setRestDuration,    // Change rest length
  formatTime,         // Format seconds as MM:SS
  isAudioPlaying,     // Audio playback status
} = useFlowodoroController();
```

### Example Usage

```typescript
import { useFlowodoroController } from './hooks/useFlowodoroController';
import { AppMode } from './types/state';

function TimerScreen() {
  const { state, startTimer, pauseTimer } = useFlowodoroController();

  return (
    <View>
      <Text>{formatTime(state.timeRemaining)}</Text>
      <Button
        title={state.timerIsRunning ? "Pause" : "Start"}
        onPress={state.timerIsRunning ? pauseTimer : startTimer}
      />
    </View>
  );
}
```

## Architecture

Flowodoro is built on a clean, maintainable architecture:

- **State Management**: React useReducer with pure functions
- **Type Safety**: Strict TypeScript throughout
- **Services**: Singleton audio player service
- **Separation of Concerns**: Logic, state, and UI decoupled

For detailed architecture documentation, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## Key Design Principles

1. **Autonomous Operation**: Minimal user intervention
2. **Predictable State**: Pure reducer functions
3. **Type Safety**: Compile-time guarantees
4. **Testability**: Pure functions, mockable services
5. **Separation**: State, logic, and UI are independent

## Configuration

### Change Focus/Rest Durations

```typescript
const { setFocusDuration, setRestDuration } = useFlowodoroController();

// Set 30-minute focus sessions
setFocusDuration(30);

// Set 10-minute rest breaks
setRestDuration(10);
```

### Change Audio Stream

Edit the `INITIAL_STATE` in `types/state.ts`:

```typescript
export const INITIAL_STATE: FlowodoroState = {
  // ...
  streamURL: "https://your-stream-url.com/radio.mp3",
};
```

## Troubleshooting

### Audio Not Playing

1. Check device volume
2. Ensure internet connection
3. Try a different stream URL
4. Check iOS silent mode switch

### Timer Not Starting

1. Check `state.timerIsRunning`
2. Verify `timeRemaining > 0`
3. Check console for errors

## Development

### Run Tests (when implemented)

```bash
npm test
```

### Type Checking

```bash
npx tsc --noEmit
```

### Linting

```bash
npm run lint
```

## Future Roadmap

- [ ] Notifications for cycle completion
- [ ] Statistics and productivity tracking
- [ ] Custom audio streams per mode
- [ ] Long break after 4 focus sessions
- [ ] Persistent state across app restarts
- [ ] Settings screen for durations
- [ ] Dark/light theme toggle
- [ ] Haptic feedback

## Contributing

This is a demonstration project showing best practices for:
- State machine architecture
- TypeScript in React Native
- Audio playback with expo-av
- Clean code organization

Feel free to fork and extend!

## License

MIT

## Credits

- Built with Expo and React Native
- Audio streaming powered by expo-av
- Default stream: freeCodeCamp's CodeRadio

---

**Built with precision for focused productivity.**
