import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Attachment } from '@/types';
import { darkTheme, spacing, typography } from '@/theme';
import { AttachmentItem } from './AttachmentItem';

export interface LocalAttachment {
  id: string;
  uri: string;
  name: string;
  mimeType: string;
}

interface AttachmentGridProps {
  attachments: Attachment[];
  localAttachments?: LocalAttachment[];
  editable?: boolean;
  onDelete?: (id: string, isLocal?: boolean) => void;
}

export function AttachmentGrid({
  attachments,
  localAttachments = [],
  editable,
  onDelete,
}: AttachmentGridProps) {
  const empty = attachments.length === 0 && localAttachments.length === 0;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Anexos</Text>
      {empty ? (
        <Text style={styles.empty}>Nenhum anexo adicionado</Text>
      ) : (
        <View style={styles.grid}>
          {attachments.map((attachment) => (
            <AttachmentItem
              key={attachment.id}
              label={attachment.original_name}
              uri={attachment.url}
              isImage={attachment.mime_type.startsWith('image/')}
              editable={editable}
              onDelete={
                editable && onDelete ? () => onDelete(attachment.id, false) : undefined
              }
            />
          ))}

          {localAttachments.map((attachment) => (
            <AttachmentItem
              key={attachment.id}
              label={attachment.name}
              uri={attachment.uri}
              isImage={attachment.mimeType.startsWith('image/')}
              editable={editable}
              onDelete={
                editable && onDelete ? () => onDelete(attachment.id, true) : undefined
              }
            />
          ))}
        </View>
      )}
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
  empty: {
    ...typography.caption,
    color: darkTheme.textMuted,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
