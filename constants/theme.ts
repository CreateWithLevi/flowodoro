/**
 * Flowodoro Design System - "Zen" Theme
 *
 * Premium, minimalist design system with deep indigo and white palette.
 */

export const ZenTheme = {
  colors: {
    background: "#1c213c", // Deep Indigo - All screens and modals
    text: "#FFFFFF", // White - All typography
    textSecondary: "#B8BDD9", // Light grey for secondary text
    accent: "#FFFFFF", // White accents
    progressTrack: "#2a3152", // Slightly lighter indigo for progress track
    progressFill: "#FFFFFF", // White progress fill
    buttonActive: "#FFFFFF", // White for active states
    buttonInactive: "rgba(255, 255, 255, 0.3)", // Semi-transparent white
    overlay: "rgba(28, 33, 60, 0.95)", // Modal overlay
    segmentedControlBg: "#1c213c", // Blends with background
    segmentedControlSelected: "#FFFFFF", // White/Light grey
    settingsModalBg: "#1c213c", // Same as background
  },

  spacing: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },

  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    xxxl: 48,
    timer: 72, // Large timer display
  },

  fontWeight: {
    light: "300" as const,
    regular: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
  },

  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    pill: 999, // Pill-shaped
    circle: 999, // Full circle
  },

  transitions: {
    duration: 300, // 0.3s
    easing: "ease-in-out" as const,
  },

  icons: {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
  },

  opacity: {
    disabled: 0.3,
    secondary: 0.7,
    overlay: 0.95,
  },
} as const;

export type ThemeType = typeof ZenTheme;
