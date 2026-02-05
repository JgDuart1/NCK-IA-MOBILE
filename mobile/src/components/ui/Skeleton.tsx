import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, ViewStyle } from 'react-native';
import { darkTheme } from '../../theme/colors';

interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number | `${number}%`;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({
  width = '100%',
  height = 16,
  borderRadius = 8,
  style,
}: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 800, useNativeDriver: true }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, [opacity]);

  const skeletonStyle: Animated.WithAnimatedValue<ViewStyle> = {
    width,
    height,
    borderRadius,
    opacity,
  };

  return <Animated.View style={[styles.skeleton, skeletonStyle, style]} />;
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: darkTheme.surfaceSecondary,
  },
});
