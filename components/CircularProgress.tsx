/**
 * Circular Progress Bar Component
 *
 * Premium white circular progress indicator for FOCUS mode.
 * The entire circle is tappable to toggle timer.
 */

import React from "react";
import { View, StyleSheet, TouchableOpacity, Animated } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { ZenTheme } from "../constants/theme";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircularProgressProps {
  progress: number; // 0 to 1
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
  onPress?: () => void;
}

export function CircularProgress({
  progress,
  size = 280,
  strokeWidth = 8,
  children,
  onPress,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.container}
    >
      <View style={[styles.circleContainer, { width: size, height: size }]}>
        <Svg width={size} height={size} style={styles.svg}>
          {/* Background circle (track) */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={ZenTheme.colors.progressTrack}
            strokeWidth={strokeWidth}
            fill="none"
          />

          {/* Progress circle */}
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={ZenTheme.colors.progressFill}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
        </Svg>

        {/* Center content */}
        <View style={styles.centerContent}>{children}</View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  circleContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  svg: {
    position: "absolute",
  },
  centerContent: {
    alignItems: "center",
    justifyContent: "center",
  },
});
