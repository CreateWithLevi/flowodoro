/**
 * Flowodoro - Autonomous Pomodoro Timer with Dual-Mode Audio Player
 *
 * This is a demonstration app showing the Flowodoro state machine in action.
 */

import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from "react-native";
import { useFlowodoroController } from "./hooks/useFlowodoroController";
import { AppMode } from "./types/state";

export default function App() {
  const {
    state,
    startTimer,
    pauseTimer,
    resetTimer,
    switchMode,
    playAudio,
    pauseAudio,
    formatTime,
    isAudioPlaying,
  } = useFlowodoroController();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      {/* App Title */}
      <Text style={styles.title}>Flowodoro</Text>
      <Text style={styles.subtitle}>Autonomous Pomodoro Timer</Text>

      {/* Current Mode Display */}
      <View style={styles.modeContainer}>
        <Text style={styles.modeLabel}>Current Mode:</Text>
        <Text
          style={[
            styles.modeText,
            state.currentMode === AppMode.FOCUS ? styles.focusMode : styles.relaxMode,
          ]}
        >
          {state.currentMode}
        </Text>
      </View>

      {/* Cycle Indicator */}
      <View style={styles.cycleContainer}>
        <Text style={styles.cycleLabel}>Active Cycle:</Text>
        <Text style={styles.cycleText}>
          {state.isFocusCycle ? "FOCUS" : "REST"}
        </Text>
      </View>

      {/* Timer Display */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{formatTime(state.timeRemaining)}</Text>
        <Text style={styles.timerStatus}>
          {state.timerIsRunning ? "Running" : "Paused"}
        </Text>
      </View>

      {/* Timer Controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.startButton]}
          onPress={startTimer}
          disabled={state.timerIsRunning}
        >
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.pauseButton]}
          onPress={pauseTimer}
          disabled={!state.timerIsRunning}
        >
          <Text style={styles.buttonText}>Pause</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.resetButton]}
          onPress={resetTimer}
        >
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      {/* Mode Switching */}
      <View style={styles.modeSwitchContainer}>
        <Text style={styles.sectionTitle}>Switch Mode:</Text>
        <View style={styles.modeSwitchButtons}>
          <TouchableOpacity
            style={[
              styles.button,
              styles.modeButton,
              state.currentMode === AppMode.FOCUS && styles.activeMode,
            ]}
            onPress={() => switchMode(AppMode.FOCUS)}
          >
            <Text style={styles.buttonText}>Focus</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.modeButton,
              state.currentMode === AppMode.RELAX && styles.activeMode,
            ]}
            onPress={() => switchMode(AppMode.RELAX)}
          >
            <Text style={styles.buttonText}>Relax</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Audio Controls */}
      <View style={styles.audioContainer}>
        <Text style={styles.sectionTitle}>Audio Controls:</Text>
        <Text style={styles.audioStatus}>
          Status: {isAudioPlaying ? "Playing" : "Paused"}
        </Text>
        <View style={styles.audioButtons}>
          <TouchableOpacity
            style={[styles.button, styles.audioButton]}
            onPress={playAudio}
          >
            <Text style={styles.buttonText}>Play</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.audioButton]}
            onPress={pauseAudio}
          >
            <Text style={styles.buttonText}>Pause</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* State Debug Info */}
      <View style={styles.debugContainer}>
        <Text style={styles.debugTitle}>State Machine Debug:</Text>
        <Text style={styles.debugText}>Focus Duration: {state.focusDuration}m</Text>
        <Text style={styles.debugText}>Rest Duration: {state.restDuration}m</Text>
        <Text style={styles.debugText}>
          Stream: {state.streamURL.substring(0, 40)}...
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#eee",
    textAlign: "center",
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#aaa",
    textAlign: "center",
    marginBottom: 30,
  },
  modeContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  modeLabel: {
    fontSize: 14,
    color: "#aaa",
    marginBottom: 5,
  },
  modeText: {
    fontSize: 28,
    fontWeight: "bold",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  focusMode: {
    color: "#ff6b6b",
    backgroundColor: "#ff6b6b22",
  },
  relaxMode: {
    color: "#4ecdc4",
    backgroundColor: "#4ecdc422",
  },
  cycleContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  cycleLabel: {
    fontSize: 12,
    color: "#888",
  },
  cycleText: {
    fontSize: 18,
    color: "#eee",
    fontWeight: "600",
  },
  timerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  timerText: {
    fontSize: 72,
    fontWeight: "bold",
    color: "#eee",
    fontFamily: "monospace",
  },
  timerStatus: {
    fontSize: 16,
    color: "#888",
    marginTop: 10,
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
    marginBottom: 30,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 90,
    alignItems: "center",
  },
  startButton: {
    backgroundColor: "#5cb85c",
  },
  pauseButton: {
    backgroundColor: "#f0ad4e",
  },
  resetButton: {
    backgroundColor: "#d9534f",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modeSwitchContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    color: "#aaa",
    textAlign: "center",
    marginBottom: 10,
  },
  modeSwitchButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
  },
  modeButton: {
    backgroundColor: "#444",
    minWidth: 100,
  },
  activeMode: {
    backgroundColor: "#667eea",
  },
  audioContainer: {
    marginBottom: 30,
  },
  audioStatus: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginBottom: 10,
  },
  audioButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
  },
  audioButton: {
    backgroundColor: "#764ba2",
    minWidth: 100,
  },
  debugContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#0f0f1e",
    borderRadius: 8,
  },
  debugTitle: {
    fontSize: 14,
    color: "#888",
    marginBottom: 8,
    fontWeight: "600",
  },
  debugText: {
    fontSize: 12,
    color: "#666",
    fontFamily: "monospace",
    marginBottom: 4,
  },
});
