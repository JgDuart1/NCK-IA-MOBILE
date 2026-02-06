import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { darkTheme, spacing, typography } from '@/theme';

interface AttachmentItemProps {
  label: string;
  uri?: string;
  isImage: boolean;
  editable?: boolean;
  onDelete?: () => void;
}

export function AttachmentItem({ label, uri, isImage, editable, onDelete }: AttachmentItemProps) {
  return (
    <View style={styles.container}>
      <View style={styles.preview}>
        {isImage && uri ? (
          <Image source={{ uri }} style={styles.image} />
        ) : (
          <Ionicons name="document-outline" size={28} color={darkTheme.textSecondary} />
        )}
      </View>

      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>

      {editable && onDelete ? (
        <Pressable onPress={onDelete} style={styles.deleteButton}>
          <Ionicons name="close-circle" size={18} color="#EF4444" />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 100,
    gap: spacing.xs,
  },
  preview: {
    width: 100,
    height: 72,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: darkTheme.border,
    backgroundColor: darkTheme.surface,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  label: {
    ...typography.caption,
    color: darkTheme.textSecondary,
  },
  deleteButton: {
    position: 'absolute',
    top: -6,
    right: -6,
  },
});
