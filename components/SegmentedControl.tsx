/**
 * Segmented Control Component
 *
 * Premium pill-shaped segmented control for mode switching.
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  LayoutChangeEvent,
} from "react-native";
import { ZenTheme } from "../constants/theme";

interface SegmentedControlProps<T extends string> {
  segments: T[];
  selectedSegment: T;
  onSegmentChange: (segment: T) => void;
}

export function SegmentedControl<T extends string>({
  segments,
  selectedSegment,
  onSegmentChange,
}: SegmentedControlProps<T>) {
  const selectedIndex = segments.indexOf(selectedSegment);
  const translateX = React.useRef(new Animated.Value(0)).current;
  const [segmentWidth, setSegmentWidth] = React.useState(0);

  const onLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    const calculatedWidth = width / segments.length;
    setSegmentWidth(calculatedWidth);
  };

  React.useEffect(() => {
    Animated.timing(translateX, {
      toValue: selectedIndex * segmentWidth,
      duration: ZenTheme.transitions.duration,
      useNativeDriver: true,
    }).start();
  }, [selectedIndex, segmentWidth]);

  return (
    <View style={styles.container} onLayout={onLayout}>
      {/* Animated background indicator */}
      {segmentWidth > 0 && (
        <Animated.View
          style={[
            styles.indicator,
            {
              width: segmentWidth - 8,
              transform: [{ translateX }],
            },
          ]}
        />
      )}

      {/* Segments */}
      {segments.map((segment, index) => {
        const isSelected = segment === selectedSegment;
        return (
          <TouchableOpacity
            key={segment}
            style={styles.segment}
            onPress={() => onSegmentChange(segment)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.segmentText,
                isSelected && styles.segmentTextSelected,
              ]}
            >
              {segment}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: ZenTheme.colors.segmentedControlBg,
    borderRadius: ZenTheme.borderRadius.pill,
    padding: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    position: "relative",
  },
  indicator: {
    position: "absolute",
    height: "90%",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: ZenTheme.borderRadius.pill,
    top: "5%",
    left: 4,
  },
  segment: {
    flex: 1,
    paddingVertical: ZenTheme.spacing.sm,
    paddingHorizontal: ZenTheme.spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  segmentText: {
    fontSize: ZenTheme.fontSize.md,
    fontWeight: ZenTheme.fontWeight.medium,
    color: ZenTheme.colors.textSecondary,
  },
  segmentTextSelected: {
    color: ZenTheme.colors.segmentedControlSelected,
    fontWeight: ZenTheme.fontWeight.semibold,
  },
});
