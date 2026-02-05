import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { darkTheme } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface CardProps extends ViewProps {
  padding?: number;
}

export function Card({ style, padding = spacing.md, ...props }: CardProps) {
  return <View style={[styles.card, { padding }, style]} {...props} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: darkTheme.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: darkTheme.border,
  },
});
