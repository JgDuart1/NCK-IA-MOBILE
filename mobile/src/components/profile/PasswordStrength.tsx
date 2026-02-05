import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { darkTheme, spacing, typography } from '@/theme';

interface PasswordStrengthProps {
  password: string;
}

function getStrength(password: string): { level: number; label: string; color: string } {
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 1) return { level: 1, label: 'Fraca', color: '#EF4444' };
  if (score <= 2) return { level: 2, label: 'Razoavel', color: '#F59E0B' };
  if (score <= 3) return { level: 3, label: 'Boa', color: '#3B82F6' };
  return { level: 4, label: 'Forte', color: '#10B981' };
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const strength = getStrength(password);

  if (!password) return null;

  return (
    <View style={styles.container}>
      <View style={styles.bars}>
        {[1, 2, 3, 4].map((level) => (
          <View
            key={level}
            style={[styles.bar, level <= strength.level && { backgroundColor: strength.color }]}
          />
        ))}
      </View>
      <Text style={[styles.label, { color: strength.color }]}>{strength.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.xs,
  },
  bars: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  bar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: darkTheme.surfaceSecondary,
  },
  label: {
    ...typography.caption,
  },
});
