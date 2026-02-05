import React from 'react';
import { Image, StyleSheet, View, ViewStyle } from 'react-native';
import { darkTheme } from '../../theme/colors';

interface AvatarProps {
  uri?: string | null;
  size?: number;
  style?: ViewStyle;
}

export function Avatar({ uri, size = 40, style }: AvatarProps) {
  return (
    <View
      style={[
        styles.container,
        { width: size, height: size, borderRadius: size / 2 },
        style,
      ]}
    >
      {uri ? (
        <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} />
      ) : (
        <View style={[styles.placeholder, { width: size, height: size, borderRadius: size / 2 }]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: darkTheme.surfaceSecondary,
  },
  placeholder: {
    backgroundColor: darkTheme.borderLight,
  },
});
