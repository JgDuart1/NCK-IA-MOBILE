import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '@/components/ui';
import { darkTheme, spacing, typography } from '@/theme';

interface CheckinButtonProps {
  enabled: boolean;
  loading?: boolean;
  onPress: () => void;
}

export function CheckinButton({ enabled, loading, onPress }: CheckinButtonProps) {
  return (
    <View style={styles.container}>
      <Button onPress={onPress} disabled={!enabled} loading={loading} fullWidth>
        Fazer check-in
      </Button>
      {!enabled ? (
        <Text style={styles.helperText}>
          O check-in fica disponivel apenas no dia e periodo correto.
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  helperText: {
    ...typography.caption,
    color: darkTheme.textSecondary,
    textAlign: 'center',
  },
});
