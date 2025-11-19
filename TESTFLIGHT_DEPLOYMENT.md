# Flowodoro - TestFlight Deployment Guide

## Overview

This guide covers building and deploying Flowodoro to Apple TestFlight for iOS beta testing. The app is configured with **background audio capabilities** to ensure music continues playing when the screen locks or the app is backgrounded.

## Prerequisites

### 1. Apple Developer Account
- Active Apple Developer Program membership ($99/year)
- Access to App Store Connect
- Apple ID with proper permissions

### 2. Development Environment
- macOS (required for iOS builds)
- Xcode installed (latest stable version)
- Node.js v16 or higher
- npm or yarn
- Expo CLI installed globally

### 3. EAS CLI
```bash
npm install -g eas-cli
```

## Step 1: Configure App Store Connect

### 1.1 Create App Record
1. Log in to [App Store Connect](https://appstoreconnect.apple.com)
2. Go to **My Apps** → **+** (Add New App)
3. Fill in the details:
   - **Platform**: iOS
   - **Name**: Flowodoro
   - **Primary Language**: English (US)
   - **Bundle ID**: `com.flowodoro.app` (or your custom bundle ID)
   - **SKU**: `flowodoro-ios` (or your preference)

### 1.2 Note Your App Information
You'll need:
- **Apple ID** (email address)
- **ASC App ID** (numeric ID from App Store Connect URL)
- **Apple Team ID** (found in Membership section)

## Step 2: Update Configuration Files

### 2.1 Update Bundle Identifier (if needed)
If you want a custom bundle ID, update `app.json`:

```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.yourname.flowodoro"
    }
  }
}
```

### 2.2 Update EAS Configuration
Edit `eas.json` and update the `submit` section:

```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "1234567890",
        "appleTeamId": "ABC123XYZ"
      }
    }
  }
}
```

## Step 3: Authenticate with EAS

```bash
# Login to Expo account
eas login

# Authenticate with Apple
eas device:create
```

Follow the prompts to sign in with your Apple Developer credentials.

## Step 4: Build for TestFlight

### 4.1 First-Time Setup
```bash
# Configure EAS project
eas build:configure
```

This will:
- Link your project to EAS
- Set up credentials
- Configure iOS provisioning

### 4.2 Create TestFlight Build
```bash
# Build for TestFlight
eas build --platform ios --profile testflight
```

**This will:**
1. Bundle your JavaScript code
2. Compile native iOS code
3. Sign with your provisioning profile
4. Upload to EAS servers
5. Provide a download link

**Build time**: Approximately 10-20 minutes

### 4.3 Monitor Build Progress
```bash
# Check build status
eas build:list

# View build details
eas build:view [build-id]
```

Or visit: https://expo.dev/accounts/[your-account]/projects/flowodoro/builds

## Step 5: Submit to TestFlight

### 5.1 Automatic Submission
```bash
# Submit directly to TestFlight
eas submit --platform ios --latest
```

### 5.2 Manual Submission
If automatic submission fails:

1. Download the `.ipa` file from EAS build
2. Open **Transporter** app on macOS
3. Drag and drop the `.ipa` file
4. Click **Deliver**

## Step 6: Configure TestFlight in App Store Connect

### 6.1 Add Test Information
1. Go to App Store Connect → Your App → TestFlight
2. Select your build (may take 5-10 minutes to process)
3. Fill in **Test Information**:
   - Beta App Description
   - Feedback Email
   - What to Test notes

### 6.2 Export Compliance
For Flowodoro (audio streaming app):
- **Does your app use encryption?** → Yes
- **Does it use encryption beyond what's provided by Apple?** → No
- This qualifies for exemption under CCATS

### 6.3 Add Internal Testers
1. Go to **App Store Connect** → **Users and Access**
2. Add internal testers (up to 100)
3. They'll receive an email invite

### 6.4 Add External Testers (Optional)
1. Create a test group
2. Add external tester emails (up to 10,000)
3. Submit for review (required for external testing)

## Step 7: Install on Test Devices

### 7.1 For Testers
1. Install **TestFlight** app from App Store
2. Accept email invitation
3. Tap **Install** in TestFlight app

### 7.2 Testing Background Audio
**CRITICAL TEST**: Verify background audio continues:

1. Open Flowodoro
2. Start a focus session (audio should play)
3. **Lock the screen** → Audio should continue
4. **Press home button** → Audio should continue
5. **Open another app** → Audio should continue
6. **Receive a notification** → Audio should continue

✅ If audio stops, check:
- `app.json` has `UIBackgroundModes: ["audio"]`
- Audio session is configured in `audioPlayer.ts`
- App has been rebuilt with these settings

## Background Audio Configuration

### What's Already Configured

✅ **Info.plist** (`app.json`):
```json
{
  "ios": {
    "infoPlist": {
      "UIBackgroundModes": ["audio"]
    }
  }
}
```

✅ **AVAudioSession** (`services/audioPlayer.ts`):
- Category: `AVAudioSessionCategoryPlayback`
- Plays in silent mode: Enabled
- Stays active in background: Enabled
- Retry logic: 3 attempts with exponential backoff

✅ **Interruption Handling**:
- iOS: `INTERRUPTION_MODE_IOS_DO_NOT_MIX`
- Android: `INTERRUPTION_MODE_ANDROID_DO_NOT_MIX`

### Capabilities Summary
| Capability | Status | Purpose |
|------------|--------|---------|
| Background Modes | ✅ Enabled | Allow background execution |
| Audio | ✅ Enabled | Continue playing when locked |
| AirPlay | ✅ Enabled | Stream to external devices |
| Picture in Picture | ✅ Enabled | iOS audio session requirement |

## Troubleshooting

### Build Fails
```bash
# Clear cache and retry
eas build:cancel
rm -rf node_modules
npm install
eas build --platform ios --profile testflight --clear-cache
```

### Audio Stops in Background
1. Verify `app.json` has `UIBackgroundModes: ["audio"]`
2. Check logs: `console.log` statements in `audioPlayer.ts`
3. Rebuild with `eas build --platform ios --profile testflight`

### Credentials Issues
```bash
# Reset credentials
eas credentials
```

Select:
- iOS → Production → Remove provisioning profile
- Rebuild to generate new credentials

### App Rejected from TestFlight
Common reasons:
1. **Missing Privacy Policy** → Add to App Store Connect
2. **Export Compliance** → Complete questionnaire
3. **Crash on Launch** → Check error logs in Xcode

## Version Management

### Increment Version
Edit `app.json`:

```json
{
  "expo": {
    "version": "1.0.1",
    "ios": {
      "buildNumber": "2"
    }
  }
}
```

**Rules**:
- `version`: User-facing version (1.0.0, 1.1.0, 2.0.0)
- `buildNumber`: Internal build number (1, 2, 3, ...)
- Each TestFlight build requires a unique `buildNumber`

### Rebuild and Submit
```bash
# After version change
eas build --platform ios --profile testflight
eas submit --platform ios --latest
```

## Production Release

### When Ready for App Store
1. Create App Store screenshots (required sizes)
2. Write app description and keywords
3. Set pricing (Free for Flowodoro)
4. Submit for review:
   ```bash
   eas build --platform ios --profile production
   eas submit --platform ios --latest
   ```

5. In App Store Connect:
   - Select build
   - Add screenshots
   - Submit for review

**Review time**: 24-48 hours typically

## Cost Summary

| Item | Cost | Frequency |
|------|------|-----------|
| Apple Developer Program | $99 | Yearly |
| EAS Build (Free tier) | $0 | Monthly* |
| EAS Build (Paid) | $29+ | Monthly |
| App Store listing | $0 | One-time |

*Free tier: 30 builds/month (sufficient for testing)

## Commands Reference

```bash
# Build for TestFlight
eas build --platform ios --profile testflight

# Submit to TestFlight
eas submit --platform ios --latest

# Check build status
eas build:list

# View credentials
eas credentials

# Update project
eas update

# Clear cache
eas build --clear-cache

# Cancel build
eas build:cancel
```

## Next Steps

After successful TestFlight deployment:

1. ✅ Invite beta testers
2. ✅ Gather feedback on background audio
3. ✅ Test on various iOS devices (iPhone SE, iPhone 15 Pro, iPad)
4. ✅ Monitor crash reports in App Store Connect
5. ✅ Iterate and submit new builds
6. ✅ Prepare for production release

## Support Resources

- **EAS Build Docs**: https://docs.expo.dev/build/introduction/
- **TestFlight Guide**: https://developer.apple.com/testflight/
- **App Store Connect**: https://appstoreconnect.apple.com
- **Expo Forums**: https://forums.expo.dev

---

**Flowodoro is now configured for persistent background audio playback. The audio stream will continue seamlessly when the screen locks or the app is backgrounded, providing an uninterrupted focus experience.** 🎵
