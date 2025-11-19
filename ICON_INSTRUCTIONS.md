# App Icon Setup

## Replacing the Default Icon with Your Custom Icon

To use your custom white wave/planet icon as the Flowodoro app icon:

### 1. Prepare Your Icon

Your icon should be a **1024x1024 PNG** image with:
- Transparent or deep indigo (#1c213c) background
- White wave/planet design centered
- High contrast for visibility

### 2. Replace the Icon Files

Replace the following files in the `assets/` directory:

- **`icon.png`** - Main app icon (1024x1024)
- **`adaptive-icon.png`** - Android adaptive icon (1024x1024)
- **`splash-icon.png`** - Splash screen icon (1024x1024)
- **`favicon.png`** - Web favicon (48x48 or larger)

### 3. Icon Guidelines

**iOS:**
- The system will automatically round the corners
- Use the full 1024x1024 canvas
- Keep important content away from edges (safe zone: 80% of canvas)

**Android:**
- Adaptive icon has a background color of #1c213c
- The foreground image should be centered
- System may apply circular or rounded square mask

**Splash Screen:**
- Background color is #1c213c (deep indigo)
- Icon will be centered on this background
- Use `resizeMode: "contain"` to prevent distortion

### 4. Quick Icon Generation

If you need to generate icons from your source image:

```bash
# Install expo-cli if not already installed
npm install -g expo-cli

# Generate all icon sizes (optional)
npx expo-generate-splash-screen
```

### 5. Current Configuration

The app is configured in `app.json` with:
- Background color: `#1c213c` (Zen theme deep indigo)
- Icon path: `./assets/icon.png`
- User interface style: `dark`

### 6. Testing Your Icon

After replacing the icon files:

```bash
# Clear cache and rebuild
npm start -- --clear

# Or rebuild the app
npm run ios
npm run android
```

The icon should now appear on your device's home screen and app switcher.

---

**Design Tip:** The white wave/planet icon will look stunning against the deep indigo background, creating a premium, minimalist aesthetic that perfectly matches the Flowodoro "Zen" theme.
