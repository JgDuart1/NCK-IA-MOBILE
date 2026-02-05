import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { colors, darkTheme, spacing } from '@/theme';

interface ColorPickerProps {
  value?: string | null;
  onChange: (color: string) => void;
  options?: string[];
}

const DEFAULT_COLORS = [
  colors.primary[500],
  colors.primary[300],
  colors.success,
  colors.warning,
  colors.info,
  colors.neutral[500],
  colors.neutral[300],
  '#EC4899',
  '#F97316',
  '#8B5CF6',
];

export function ColorPicker({ value, onChange, options = DEFAULT_COLORS }: ColorPickerProps) {
  return (
    <View style={styles.container}>
      {options.map((color) => {
        const isSelected = value === color;
        return (
          <TouchableOpacity
            key={color}
            style={[styles.swatch, { backgroundColor: color }]}
            onPress={() => onChange(color)}
          >
            {isSelected ? <View style={styles.selected} /> : null}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  swatch: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: darkTheme.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: darkTheme.text,
  },
});
