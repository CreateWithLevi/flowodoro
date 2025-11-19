# Flowodoro Design System - "Zen" Theme

## Overview

The Flowodoro design system implements a premium, minimalist aesthetic with a focus on clarity, calm, and focus. The "Zen" theme uses a deep indigo and white color palette to create a sophisticated, distraction-free environment.

## Color Palette

### Primary Colors

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| **Deep Indigo** | `#1c213c` | All backgrounds, screens, modals |
| **Pure White** | `#FFFFFF` | All typography, primary accents, icons |
| **Light Grey** | `#B8BDD9` | Secondary text, subtle labels |
| **Progress Track** | `#2a3152` | Inactive progress indicator |

### Semantic Colors

- **Background**: `#1c213c` - Used universally across all screens
- **Text Primary**: `#FFFFFF` - High contrast, clean readability
- **Text Secondary**: `#B8BDD9` - Lower hierarchy text
- **Accent**: `#FFFFFF` - Buttons, active states, highlights
- **Overlay**: `rgba(28, 33, 60, 0.95)` - Modal backgrounds

## Typography

### Font System

- **Family**: System default sans-serif (San Francisco on iOS, Roboto on Android)
- **Style**: Clean, lightweight, modern
- **Weights**:
  - Light (300) - Large headings, timer display
  - Regular (400) - Body text
  - Medium (500) - Labels, secondary text
  - Semibold (600) - Buttons, important labels
  - Bold (700) - Emphasis (rarely used)

### Type Scale

| Size | Value | Usage |
|------|-------|-------|
| xs | 12px | Slider labels, metadata |
| sm | 14px | Cycle labels, secondary info |
| md | 16px | Body text, buttons |
| lg | 20px | Section titles, settings values |
| xl | 24px | Modal titles |
| xxl | 32px | Screen titles |
| xxxl | 48px | Large headlines |
| **timer** | **72px** | Main timer display |

### Typography Rules

1. All text is white (#FFFFFF) or light grey (#B8BDD9)
2. Maintain high contrast against deep indigo background
3. Use letter-spacing for uppercase labels (+1px)
4. Use negative letter-spacing for large numbers (-2px)
5. Lightweight fonts for large sizes (300 weight)

## Spacing System

Consistent spacing scale based on 8px grid:

| Token | Value | Usage |
|-------|-------|-------|
| xs | 8px | Tight spacing, icon gaps |
| sm | 12px | Button padding, compact elements |
| md | 16px | Standard padding, vertical rhythm |
| lg | 24px | Section spacing, comfortable padding |
| xl | 32px | Large sections, screen margins |
| xxl | 48px | Major section breaks |
| xxxl | 64px | Screen-level spacing |

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| sm | 8px | Small elements |
| md | 12px | Buttons, cards |
| lg | 16px | Modals, panels |
| xl | 24px | Large containers |
| pill | 999px | Pill-shaped buttons, segmented control |
| circle | 999px | Circular buttons, icons |

## Transitions & Animations

### Core Animation Values

- **Duration**: 300ms (0.3s)
- **Easing**: ease-in-out
- **Type**: Opacity fades for smooth, calming transitions

### Animation Guidelines

1. **Fade Transitions**: All UI element appearances/disappearances use opacity fades
2. **Mode Switching**: 150ms fade out → 150ms fade in (300ms total)
3. **Segmented Control**: 300ms slide animation for indicator
4. **Modal Presentation**: 300ms slide-up from bottom
5. **Button States**: Instant (no animation) for immediate feedback

### Implementation

```typescript
// Standard fade
Animated.timing(fadeAnim, {
  toValue: 1,
  duration: 300,
  useNativeDriver: true,
}).start();

// Smooth transitions on all element changes
opacity: fadeAnim
```

## Components

### 1. Segmented Control

**Location**: `components/SegmentedControl.tsx`

**Design Specs**:
- Pill-shaped container
- Background: #1c213c (blends with screen)
- Border: 1px rgba(255, 255, 255, 0.1)
- Selected indicator: rgba(255, 255, 255, 0.15) background
- Text: Light grey unselected, white selected
- Padding: 4px container, 12px/24px segment padding
- Animation: 300ms slide on selection

**Usage**: Mode switching (FOCUS/RELAX)

### 2. Circular Progress Bar

**Location**: `components/CircularProgress.tsx`

**Design Specs**:
- Size: 280px diameter
- Stroke width: 8px
- Track color: #2a3152 (lighter indigo)
- Progress color: #FFFFFF (white)
- Stroke linecap: Round (smooth ends)
- Rotation: -90° (start from top)
- Fully tappable area

**Interaction**: Tap entire circle to toggle timer

### 3. Settings Modal

**Location**: `components/SettingsModal.tsx`

**Design Specs**:
- Presentation: Half-sheet from bottom
- Background: #1c213c
- Border radius: 24px (top corners only)
- Handle bar: 40px × 4px, rgba(255, 255, 255, 0.3)
- Overlay: rgba(0, 0, 0, 0.5)
- Animation: 300ms slide-up

**Components**:
- Sliders: White track/thumb, indigo maximum track
- Labels: White primary, light grey secondary
- Done button: White background, indigo text

### 4. Icons

**Location**: `components/Icons.tsx`

**Available Icons**:
- PlayIcon - Triangle play symbol
- PauseIcon - Two vertical bars
- SettingsIcon - Gear/cog
- ResetIcon - Circular arrow

**Specs**:
- Default color: White (#FFFFFF)
- Sizes: 16px (sm), 24px (md), 32px (lg), 48px (xl)
- Style: Filled, minimal, clean
- Library: react-native-svg

## Conditional Rendering

### FOCUS Mode

**Visual Hierarchy**:
1. Circular progress bar (center stage)
2. Timer (72px, monospace, white)
3. Play/Pause icon (32px)
4. Cycle label (14px, uppercase, light grey)
5. Settings gear (top-right, subtle)
6. Reset arrow (bottom-center, subtle)

**Interaction**:
- Tap circle → Toggle timer
- Tap settings → Open modal
- Tap reset → Reset timer

### RELAX Mode

**Visual Hierarchy**:
1. "Relax Mode" title (48px, light weight)
2. Subtitle text (16px, light grey)
3. Large play/pause button (160px circle, 96px icon)
4. Audio status label (16px, uppercase)
5. Settings button (pill shape, bottom)

**Interaction**:
- Tap large circle → Toggle audio
- Tap settings → Open modal

**Key Difference**: Timer UI completely fades out, replaced by audio-focused minimal UI

## Layout Patterns

### Screen Structure

```
┌─────────────────────────────┐
│  [Segmented Control]        │ Header (24px padding)
│                             │
│                             │
│      [Center Content]       │ Flex: 1, centered
│                             │
│                             │
└─────────────────────────────┘
```

### FOCUS Layout

```
                 ⚙️ Settings

       ┌─────────────────┐
       │   ╱────╲   25:00│
       │  ╱      ╲       │  Circular Progress
       │ │   ▶️   │      │  (Tappable)
       │  ╲      ╱       │
       │   ╲____╱        │
       └─────────────────┘

           🔄 Reset
```

### RELAX Layout

```
       Relax Mode
   Take a break, listen to music

       ┌─────────────┐
       │      ⏸      │    Large Audio Control
       │             │    (Tappable)
       └─────────────┘

        P L A Y I N G

      [⚙️ Settings]
```

## Accessibility

### Color Contrast

- White text on deep indigo: **AAA compliant** (contrast ratio > 12:1)
- Light grey on deep indigo: **AA compliant** (contrast ratio > 7:1)
- All interactive elements meet WCAG 2.1 AA standards

### Touch Targets

- Minimum touch target: 44×44 points (iOS HIG)
- Circular progress: 280×280 (well above minimum)
- Settings/Reset buttons: 48×48 with padding
- Large audio button: 160×160 (generous)

### Animations

- All animations can be disabled via system preferences
- No essential information conveyed solely through animation
- Motion reduced: Instant transitions instead of fades

## Implementation Guidelines

### Component Creation

1. Import theme: `import { ZenTheme } from "../constants/theme"`
2. Use theme tokens: `color: ZenTheme.colors.text`
3. Follow spacing scale: `padding: ZenTheme.spacing.lg`
4. Apply transitions: `duration: ZenTheme.transitions.duration`

### Color Usage

```typescript
// ✅ Correct
backgroundColor: ZenTheme.colors.background

// ❌ Incorrect
backgroundColor: "#1c213c" // Hardcoded
```

### Animation Pattern

```typescript
// ✅ Correct - Smooth fade
Animated.timing(opacity, {
  toValue: 1,
  duration: ZenTheme.transitions.duration,
  useNativeDriver: true,
}).start();

// ❌ Incorrect - Too fast
duration: 100 // Not smooth enough
```

## Design Principles

1. **Minimalism**: Remove everything unnecessary
2. **Focus**: UI fades into background during work
3. **Clarity**: High contrast, readable at a glance
4. **Calm**: Smooth transitions, no jarring changes
5. **Premium**: Attention to detail, pixel-perfect execution

## File Structure

```
constants/
  └── theme.ts          # Design tokens (single source of truth)

components/
  ├── CircularProgress.tsx
  ├── SegmentedControl.tsx
  ├── SettingsModal.tsx
  └── Icons.tsx

App.tsx                 # Main application with conditional rendering
```

## Future Considerations

### Potential Enhancements

1. **Dark mode toggle**: Add light theme variant
2. **Custom themes**: User-selectable color schemes
3. **Haptic feedback**: Subtle vibrations on interactions
4. **Sound effects**: Gentle audio cues for transitions
5. **Micro-interactions**: Subtle button press animations

### Maintaining Consistency

- All new components must use `ZenTheme` tokens
- No hardcoded colors or sizes
- Test on various screen sizes (iPhone SE to iPad Pro)
- Verify contrast ratios for any new color combinations

---

**The Flowodoro "Zen" theme delivers a premium, minimalist experience that disappears into the background, allowing users to focus on what matters: their work.**
