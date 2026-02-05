import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { darkTheme, spacing, typography } from '@/theme';
import { RoleType } from '@/services/api/users.api';

export const ROLE_LABELS: Record<RoleType, string> = {
  SUPER_ADMIN: 'Super Admin',
  NUCLEO_NCK: 'Nucleo NCK',
  AGENTE_NCK: 'Agente NCK',
  CLIENTE: 'Cliente',
  FORNECEDOR: 'Fornecedor',
  INVESTIDOR: 'Investidor',
};

interface RoleSelectorProps {
  value: RoleType;
  onChange: (value: RoleType) => void;
  options?: RoleType[];
}

export function RoleSelector({ value, onChange, options }: RoleSelectorProps) {
  const roles = options ?? (Object.keys(ROLE_LABELS) as RoleType[]);

  return (
    <View style={styles.container}>
      {roles.map((role) => {
        const selected = role === value;
        return (
          <TouchableOpacity
            key={role}
            style={[styles.option, selected && styles.optionSelected]}
            onPress={() => onChange(role)}
            activeOpacity={0.8}
          >
            <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
              {ROLE_LABELS[role]}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  option: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: darkTheme.border,
    backgroundColor: darkTheme.surface,
  },
  optionSelected: {
    borderColor: darkTheme.primary,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
  },
  optionText: {
    ...typography.bodySmall,
    color: darkTheme.text,
  },
  optionTextSelected: {
    color: darkTheme.primary,
    fontWeight: '600',
  },
});
