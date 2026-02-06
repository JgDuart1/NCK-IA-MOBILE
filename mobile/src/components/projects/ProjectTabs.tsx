import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { darkTheme, spacing, typography } from '@/theme';

export interface TabItem {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  count?: number;
}

interface ProjectTabsProps {
  tabs: TabItem[];
  onTabPress: (key: string) => void;
}

export function ProjectTabs({ tabs, onTabPress }: ProjectTabsProps) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={styles.tab}
          onPress={() => onTabPress(tab.key)}
          activeOpacity={0.8}
        >
          <View style={styles.iconWrapper}>
            <Ionicons name={tab.icon} size={20} color={darkTheme.text} />
          </View>
          <Text style={styles.label}>{tab.label}</Text>
          {typeof tab.count === 'number' ? <Text style={styles.count}>{tab.count}</Text> : null}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  tab: {
    width: '47%',
    backgroundColor: darkTheme.surface,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: darkTheme.border,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: darkTheme.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  label: {
    ...typography.bodySmall,
    color: darkTheme.text,
  },
  count: {
    ...typography.caption,
    color: darkTheme.textSecondary,
    marginTop: spacing.xs,
  },
});
