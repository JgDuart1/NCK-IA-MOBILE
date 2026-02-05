import React, { ReactNode } from 'react';
import { Modal as RNModal, Pressable, StyleSheet } from 'react-native';
import { darkTheme } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ visible, onClose, children }: ModalProps) {
  return (
    <RNModal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.content} onPress={() => null}>
          {children}
        </Pressable>
      </Pressable>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  content: {
    backgroundColor: darkTheme.surface,
    borderRadius: 12,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: darkTheme.border,
  },
});
