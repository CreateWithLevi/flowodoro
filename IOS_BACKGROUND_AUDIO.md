# iOS Background Audio Configuration

## Overview

Flowodoro is configured for **persistent background audio playback**. The audio stream will NOT stop when:
- Screen locks
- App is backgrounded
- Device sleeps
- User switches to another app

## Critical Configuration

### 1. Background Modes Capability

**File**: `app.json`

```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "UIBackgroundModes": ["audio"]
      }
    }
  }
}
```

**What this does**:
- Enables iOS Background Modes capability
- Declares "Audio, AirPlay, and Picture in Picture" mode
- Allows app to continue running audio in background
- Required for audio to persist when screen locks

### 2. AVAudioSession Configuration

**File**: `services/audioPlayer.ts`

#### Category: Playback
```typescript
await Audio.setAudioModeAsync({
  playsInSilentModeIOS: true,        // Play even if mute switch is on
  staysActiveInBackground: true,      // Continue when backgrounded
  interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX
});
```

**AVAudioSession Mapping**:
- `playsInSilentModeIOS: true` → Category includes `AVAudioSessionCategoryOptionMixWithOthers`
- `staysActiveInBackground: true` → Session remains active in background
- Mode: `AVAudioSessionModeDefault`

#### Error Handling with Retry Logic
```typescript
private async configureAudioSession(retryAttempt: number = 0): Promise<void> {
  try {
    await Audio.setAudioModeAsync({ /* config */ });
    console.log("✅ Audio session configured");
  } catch (error) {
    if (retryAttempt < MAX_RETRY_ATTEMPTS - 1) {
      const delay = RETRY_DELAY_MS * Math.pow(2, retryAttempt);
      await new Promise(resolve => setTimeout(resolve, delay));
      return this.configureAudioSession(retryAttempt + 1);
    }
    throw error;
  }
}
```

**Retry Strategy**:
- Max attempts: 3
- Delay: 1s, 2s, 4s (exponential backoff)
- Logs success/failure for debugging

### 3. Signing & Provisioning

**Automatic with EAS Build**:
- Provisioning profile includes "Audio" entitlement
- Code signing handled by EAS
- Info.plist automatically includes `UIBackgroundModes`

**Manual (if needed)**:
In Xcode:
1. Select target → Signing & Capabilities
2. Click **+ Capability**
3. Add **Background Modes**
4. Check **Audio, AirPlay, and Picture in Picture**

## How It Works

### App Launch Sequence
```
1. App starts
   ↓
2. audioPlayer.initialize() called
   ↓
3. configureAudioSession() runs
   ↓
4. AVAudioSession set to Playback category
   ↓
5. Session activated (with retry logic)
   ↓
6. Audio stream loaded
   ↓
7. Ready to play in foreground AND background
```

### Background Playback Flow
```
User presses PLAY
   ↓
Audio starts playing
   ↓
User locks screen / backgrounds app
   ↓
iOS checks UIBackgroundModes
   ↓
"audio" mode found → Audio continues ✅
   ↓
User unlocks / returns to app
   ↓
Audio still playing seamlessly
```

## Testing Checklist

### Background Persistence Test
1. ✅ Start Flowodoro
2. ✅ Start focus session (audio plays)
3. ✅ **Lock screen** → Verify audio continues
4. ✅ **Unlock screen** → Verify audio still playing
5. ✅ **Press home button** → Verify audio continues
6. ✅ **Open another app** → Verify audio continues
7. ✅ **Kill another app** → Verify Flowodoro audio unaffected
8. ✅ **Receive notification** → Verify audio continues

### Control Center Integration
1. ✅ Start audio
2. ✅ Swipe up for Control Center
3. ✅ Verify Flowodoro appears in Now Playing
4. ✅ Test play/pause from Control Center
5. ✅ Test volume control

### Interruption Handling
1. ✅ Start audio
2. ✅ Receive phone call → Audio should pause
3. ✅ End call → Audio should resume (or stay paused)
4. ✅ Start Siri → Audio should duck (lower volume)

## Debugging Background Audio

### Check Configuration
```bash
# Verify app.json
cat app.json | grep -A 5 "UIBackgroundModes"

# Should output:
# "UIBackgroundModes": [
#   "audio"
# ]
```

### Enable Logging
All audio operations log to console:
- `[AudioSession]` - Session configuration
- `[AudioPlayer]` - Playback operations

Example logs:
```
[AudioSession] Configuring audio session (attempt 1/3)...
[AudioSession] ✅ Audio session configured successfully
[AudioPlayer] Initializing audio player...
[AudioPlayer] ✅ Audio player initialized successfully
[AudioPlayer] ▶️ Playing audio...
[AudioPlayer] ✅ Audio playing (will continue in background)
```

### Common Issues

#### Audio Stops When Locked
**Cause**: `UIBackgroundModes` not set
**Fix**: Check `app.json`, rebuild app

#### Audio Doesn't Play at All
**Cause**: Audio session not configured
**Fix**: Check logs for `[AudioSession]` errors

#### Silent Mode Switch Disables Audio
**Cause**: `playsInSilentModeIOS` not set
**Fix**: Already configured in `audioPlayer.ts`

## Configuration Summary

| Setting | Location | Value | Purpose |
|---------|----------|-------|---------|
| UIBackgroundModes | `app.json` | `["audio"]` | Enable background capability |
| playsInSilentModeIOS | `audioPlayer.ts` | `true` | Play when mute switch on |
| staysActiveInBackground | `audioPlayer.ts` | `true` | Continue in background |
| interruptionModeIOS | `audioPlayer.ts` | `DO_NOT_MIX` | Don't mix with other audio |
| Category | `audioPlayer.ts` | `Playback` | AVAudioSessionCategoryPlayback |
| Retry attempts | `audioPlayer.ts` | `3` | Error recovery |

## iOS Permissions

### Required Permissions
- ✅ **Background Modes (Audio)** - Configured in `app.json`
- ✅ **Audio Session** - Configured at runtime

### NOT Required
- ❌ Microphone access (we only play, not record)
- ❌ Notifications (optional for future)
- ❌ Location services

## Build Requirements

### For TestFlight / App Store
```bash
# Build with EAS (includes background modes)
eas build --platform ios --profile testflight

# Verify capabilities in built IPA
# Xcode will automatically include UIBackgroundModes
```

### For Local Development
```bash
# Run with Expo Go (limited background support)
npm start

# Or run in development build
eas build --profile development --platform ios
```

**Note**: Expo Go has limitations with background audio. Use a development build or TestFlight for full testing.

## Architecture

```
┌─────────────────────────────────────────────┐
│           Flowodoro App                     │
├─────────────────────────────────────────────┤
│  useFlowodoroController Hook                │
│    ↓                                        │
│  AudioPlayerService (Singleton)             │
│    ↓                                        │
│  configureAudioSession()                    │
│    - Category: Playback                     │
│    - Mode: Default                          │
│    - Active: TRUE                           │
│    - Retry: 3 attempts                      │
│    ↓                                        │
│  Audio.setAudioModeAsync()                  │
│    ↓                                        │
│  expo-av (React Native)                     │
│    ↓                                        │
│  AVFoundation (iOS Native)                  │
│    ↓                                        │
│  AVAudioSession.sharedInstance()            │
│    - setCategory(.playback)                 │
│    - setActive(true)                        │
├─────────────────────────────────────────────┤
│  UIBackgroundModes: ["audio"]               │
│  (Info.plist)                               │
└─────────────────────────────────────────────┘
```

## Platform Support

| Platform | Background Audio | Status |
|----------|------------------|--------|
| iOS | ✅ Full support | Configured |
| Android | ✅ Full support | Configured |
| Web | ⚠️ Limited | Depends on browser |

## References

- **Apple Docs**: [Enabling Background Audio](https://developer.apple.com/documentation/avfoundation/media_playback/configuring_your_app_for_media_playback)
- **Expo Docs**: [expo-av Audio](https://docs.expo.dev/versions/latest/sdk/audio/)
- **Background Modes**: [iOS Capabilities](https://developer.apple.com/documentation/xcode/configuring-background-execution-modes)

---

**✅ Flowodoro is fully configured for persistent background audio playback on iOS. No additional configuration needed.**
