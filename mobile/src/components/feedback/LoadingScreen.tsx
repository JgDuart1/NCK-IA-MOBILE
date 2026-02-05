import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { darkTheme } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message }: LoadingScreenProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={darkTheme.primary} />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: darkTheme.background,
    gap: spacing.md,
  },
  message: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
  },
});
