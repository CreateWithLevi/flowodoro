/**
 * Settings Modal Component
 *
 * Half-sheet modal for adjusting focus and rest durations.
 */

import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import Slider from "@react-native-community/slider";
import { ZenTheme } from "../constants/theme";

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  focusDuration: number;
  restDuration: number;
  onFocusDurationChange: (value: number) => void;
  onRestDurationChange: (value: number) => void;
}

export function SettingsModal({
  visible,
  onClose,
  focusDuration,
  restDuration,
  onFocusDurationChange,
  onRestDurationChange,
}: SettingsModalProps) {
  const slideAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: ZenTheme.transitions.duration,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: ZenTheme.transitions.duration,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={onClose}
        />

        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ translateY }],
            },
          ]}
        >
          {/* Handle bar */}
          <View style={styles.handleBar} />

          {/* Title */}
          <Text style={styles.title}>Settings</Text>

          {/* Focus Duration Slider */}
          <View style={styles.settingSection}>
            <View style={styles.settingHeader}>
              <Text style={styles.settingLabel}>Focus Duration</Text>
              <Text style={styles.settingValue}>{focusDuration} min</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={60}
              step={1}
              value={focusDuration}
              onValueChange={onFocusDurationChange}
              minimumTrackTintColor={ZenTheme.colors.text}
              maximumTrackTintColor={ZenTheme.colors.progressTrack}
              thumbTintColor={ZenTheme.colors.text}
            />
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>1 min</Text>
              <Text style={styles.sliderLabel}>60 min</Text>
            </View>
          </View>

          {/* Rest Duration Slider */}
          <View style={styles.settingSection}>
            <View style={styles.settingHeader}>
              <Text style={styles.settingLabel}>Rest Duration</Text>
              <Text style={styles.settingValue}>{restDuration} min</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={30}
              step={1}
              value={restDuration}
              onValueChange={onRestDurationChange}
              minimumTrackTintColor={ZenTheme.colors.text}
              maximumTrackTintColor={ZenTheme.colors.progressTrack}
              thumbTintColor={ZenTheme.colors.text}
            />
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>1 min</Text>
              <Text style={styles.sliderLabel}>30 min</Text>
            </View>
          </View>

          {/* Done Button */}
          <TouchableOpacity style={styles.doneButton} onPress={onClose}>
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  overlayTouchable: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: ZenTheme.colors.settingsModalBg,
    borderTopLeftRadius: ZenTheme.borderRadius.xl,
    borderTopRightRadius: ZenTheme.borderRadius.xl,
    paddingHorizontal: ZenTheme.spacing.lg,
    paddingBottom: ZenTheme.spacing.xxxl,
    paddingTop: ZenTheme.spacing.md,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: ZenTheme.spacing.lg,
  },
  title: {
    fontSize: ZenTheme.fontSize.xl,
    fontWeight: ZenTheme.fontWeight.semibold,
    color: ZenTheme.colors.text,
    marginBottom: ZenTheme.spacing.xl,
  },
  settingSection: {
    marginBottom: ZenTheme.spacing.xl,
  },
  settingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: ZenTheme.spacing.sm,
  },
  settingLabel: {
    fontSize: ZenTheme.fontSize.md,
    fontWeight: ZenTheme.fontWeight.medium,
    color: ZenTheme.colors.text,
  },
  settingValue: {
    fontSize: ZenTheme.fontSize.lg,
    fontWeight: ZenTheme.fontWeight.semibold,
    color: ZenTheme.colors.text,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: ZenTheme.spacing.xs,
  },
  sliderLabel: {
    fontSize: ZenTheme.fontSize.xs,
    color: ZenTheme.colors.textSecondary,
  },
  doneButton: {
    backgroundColor: ZenTheme.colors.buttonActive,
    paddingVertical: ZenTheme.spacing.md,
    borderRadius: ZenTheme.borderRadius.lg,
    alignItems: "center",
    marginTop: ZenTheme.spacing.md,
  },
  doneButtonText: {
    fontSize: ZenTheme.fontSize.lg,
    fontWeight: ZenTheme.fontWeight.semibold,
    color: ZenTheme.colors.background,
  },
});
