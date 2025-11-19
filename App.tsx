/**
 * Flowodoro - Premium Minimalist Pomodoro Timer
 *
 * "Zen" Theme - Deep Indigo (#1c213c) and White (#FFFFFF)
 */

import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
} from "react-native";
import { useFlowodoroController } from "./hooks/useFlowodoroController";
import { AppMode } from "./types/state";
import { ZenTheme } from "./constants/theme";
import { SegmentedControl } from "./components/SegmentedControl";
import { CircularProgress } from "./components/CircularProgress";
import { SettingsModal } from "./components/SettingsModal";
import {
  PlayIcon,
  PauseIcon,
  SettingsIcon,
  ResetIcon,
} from "./components/Icons";

export default function App() {
  const {
    state,
    startTimer,
    pauseTimer,
    resetTimer,
    switchMode,
    playAudio,
    pauseAudio,
    setFocusDuration,
    setRestDuration,
    formatTime,
    isAudioPlaying,
  } = useFlowodoroController();

  const [settingsVisible, setSettingsVisible] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(1)).current;

  // Handle mode changes with fade animation
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });
  }, [state.currentMode]);

  const handleTimerToggle = () => {
    if (state.timerIsRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  };

  const handleAudioToggle = () => {
    if (isAudioPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  const progress =
    1 -
    state.timeRemaining /
      (state.isFocusCycle
        ? state.focusDuration * 60
        : state.restDuration * 60);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={ZenTheme.colors.background} />

      {/* Header - Segmented Control */}
      <View style={styles.header}>
        <SegmentedControl
          segments={[AppMode.FOCUS, AppMode.RELAX]}
          selectedSegment={state.currentMode}
          onSegmentChange={(mode) => switchMode(mode)}
        />
      </View>

      {/* Center Stage - Conditional Rendering */}
      <Animated.View style={[styles.centerStage, { opacity: fadeAnim }]}>
        {state.currentMode === AppMode.FOCUS ? (
          // FOCUS MODE: Circular Progress Timer
          <View style={styles.focusContainer}>
            {/* Settings Icon - Top Right */}
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => setSettingsVisible(true)}
              activeOpacity={0.7}
            >
              <SettingsIcon size={ZenTheme.icons.md} />
            </TouchableOpacity>

            {/* Circular Progress Bar */}
            <CircularProgress
              progress={progress}
              size={280}
              strokeWidth={8}
              onPress={handleTimerToggle}
            >
              <View style={styles.timerContent}>
                <Text style={styles.timerText}>{formatTime(state.timeRemaining)}</Text>
                <View style={styles.timerIcon}>
                  {state.timerIsRunning ? (
                    <PauseIcon size={ZenTheme.icons.lg} />
                  ) : (
                    <PlayIcon size={ZenTheme.icons.lg} />
                  )}
                </View>
                <Text style={styles.cycleLabel}>
                  {state.isFocusCycle ? "Focus Time" : "Rest Time"}
                </Text>
              </View>
            </CircularProgress>

            {/* Reset Button - Bottom Center */}
            <TouchableOpacity
              style={styles.resetButton}
              onPress={resetTimer}
              activeOpacity={0.7}
            >
              <ResetIcon size={ZenTheme.icons.md} />
            </TouchableOpacity>
          </View>
        ) : (
          // RELAX MODE: Minimal Audio Control
          <View style={styles.relaxContainer}>
            <Text style={styles.relaxTitle}>Relax Mode</Text>
            <Text style={styles.relaxSubtitle}>Take a break, listen to music</Text>

            {/* Large Play/Pause Button */}
            <TouchableOpacity
              style={styles.relaxAudioButton}
              onPress={handleAudioToggle}
              activeOpacity={0.8}
            >
              {isAudioPlaying ? (
                <PauseIcon size={ZenTheme.icons.xl * 2} />
              ) : (
                <PlayIcon size={ZenTheme.icons.xl * 2} />
              )}
            </TouchableOpacity>

            <Text style={styles.audioStatus}>
              {isAudioPlaying ? "Playing" : "Paused"}
            </Text>

            {/* Settings access in relax mode */}
            <TouchableOpacity
              style={styles.relaxSettingsButton}
              onPress={() => setSettingsVisible(true)}
              activeOpacity={0.7}
            >
              <SettingsIcon size={ZenTheme.icons.md} />
              <Text style={styles.relaxSettingsText}>Settings</Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>

      {/* Settings Modal */}
      <SettingsModal
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
        focusDuration={state.focusDuration}
        restDuration={state.restDuration}
        onFocusDurationChange={setFocusDuration}
        onRestDurationChange={setRestDuration}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ZenTheme.colors.background,
  },
  header: {
    paddingHorizontal: ZenTheme.spacing.xl,
    paddingTop: ZenTheme.spacing.lg,
    paddingBottom: ZenTheme.spacing.xl,
  },
  centerStage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: ZenTheme.spacing.lg,
  },

  // FOCUS MODE STYLES
  focusContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  settingsButton: {
    position: "absolute",
    top: -80,
    right: ZenTheme.spacing.xl,
    padding: ZenTheme.spacing.sm,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: ZenTheme.borderRadius.circle,
  },
  timerContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  timerText: {
    fontSize: ZenTheme.fontSize.timer,
    fontWeight: ZenTheme.fontWeight.light,
    color: ZenTheme.colors.text,
    fontFamily: "monospace",
    letterSpacing: -2,
  },
  timerIcon: {
    marginTop: ZenTheme.spacing.sm,
    marginBottom: ZenTheme.spacing.xs,
  },
  cycleLabel: {
    fontSize: ZenTheme.fontSize.sm,
    color: ZenTheme.colors.textSecondary,
    fontWeight: ZenTheme.fontWeight.medium,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  resetButton: {
    position: "absolute",
    bottom: -80,
    padding: ZenTheme.spacing.sm,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: ZenTheme.borderRadius.circle,
  },

  // RELAX MODE STYLES
  relaxContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  relaxTitle: {
    fontSize: ZenTheme.fontSize.xxxl,
    fontWeight: ZenTheme.fontWeight.light,
    color: ZenTheme.colors.text,
    marginBottom: ZenTheme.spacing.sm,
  },
  relaxSubtitle: {
    fontSize: ZenTheme.fontSize.md,
    color: ZenTheme.colors.textSecondary,
    marginBottom: ZenTheme.spacing.xxxl,
  },
  relaxAudioButton: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 2,
    borderColor: ZenTheme.colors.text,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: ZenTheme.spacing.lg,
  },
  audioStatus: {
    fontSize: ZenTheme.fontSize.md,
    color: ZenTheme.colors.textSecondary,
    marginTop: ZenTheme.spacing.md,
    fontWeight: ZenTheme.fontWeight.medium,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  relaxSettingsButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: ZenTheme.spacing.xxxl,
    paddingVertical: ZenTheme.spacing.sm,
    paddingHorizontal: ZenTheme.spacing.lg,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: ZenTheme.borderRadius.pill,
    gap: ZenTheme.spacing.xs,
  },
  relaxSettingsText: {
    fontSize: ZenTheme.fontSize.md,
    color: ZenTheme.colors.text,
    fontWeight: ZenTheme.fontWeight.medium,
  },
});
