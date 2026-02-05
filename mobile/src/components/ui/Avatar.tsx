import React from 'react';
import { Image, StyleSheet, View, ViewStyle, Text } from 'react-native';
import { darkTheme } from '../../theme/colors';
import { typography } from '../../theme/typography';

interface AvatarProps {
  uri?: string | null;
  name?: string;
  size?: number;
  style?: ViewStyle;
}

function getInitials(name?: string) {
  if (!name) return '';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? '';
  const first = parts[0][0] ?? '';
  const last = parts[parts.length - 1][0] ?? '';
  return `${first}${last}`.toUpperCase();
}

export function Avatar({ uri, name, size = 40, style }: AvatarProps) {
  const initials = getInitials(name);

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
        <View style={[styles.placeholder, { width: size, height: size, borderRadius: size / 2 }]}>
          {initials ? (
            <Text style={[styles.initials, { fontSize: Math.max(12, size * 0.35) }]}>
              {initials}
            </Text>
          ) : null}
        </View>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    ...typography.bodyMedium,
    color: darkTheme.textSecondary,
  },
});
