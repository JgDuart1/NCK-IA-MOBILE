import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Avatar } from '@/components/ui';
import { ProjectMember } from '@/types';
import { darkTheme, spacing, typography } from '@/theme';

interface AssigneeSelectorProps {
  members: ProjectMember[];
  value?: string | null;
  onChange: (assigneeId?: string) => void;
}

export function AssigneeSelector({ members, value, onChange }: AssigneeSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Responsavel</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        <TouchableOpacity
          style={[styles.option, !value && styles.optionActive]}
          onPress={() => onChange(undefined)}
        >
          <Text style={styles.optionText}>Sem responsavel</Text>
        </TouchableOpacity>

        {members.map((member) => (
          <TouchableOpacity
            key={member.id}
            style={[styles.option, value === member.user_id && styles.optionActive]}
            onPress={() => onChange(member.user_id)}
          >
            <Avatar
              size={24}
              uri={member.user?.avatar_url || undefined}
              name={member.user?.name || 'Membro'}
            />
            <Text style={styles.optionText} numberOfLines={1}>
              {member.user?.name || 'Membro'}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  label: {
    ...typography.bodySmall,
    color: darkTheme.textSecondary,
  },
  list: {
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: darkTheme.border,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    backgroundColor: darkTheme.surface,
  },
  optionActive: {
    borderColor: darkTheme.primary,
  },
  optionText: {
    ...typography.caption,
    color: darkTheme.text,
    maxWidth: 120,
  },
});
