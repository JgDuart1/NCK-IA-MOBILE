import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '@/components/ui';
import { darkTheme, spacing } from '@/theme';

interface AvatarPickerProps {
  currentUri?: string | null;
  name: string;
  onPick: (uri: string) => void;
  onRemove: () => void;
}

export function AvatarPicker({ currentUri, name, onPick, onRemove }: AvatarPickerProps) {
  const showOptions = () => {
    Alert.alert('Alterar foto', 'Escolha uma opcao', [
      {
        text: 'Tirar foto',
        onPress: takePhoto,
      },
      {
        text: 'Escolher da galeria',
        onPress: pickFromGallery,
      },
      ...(currentUri
        ? [
            {
              text: 'Remover foto',
              style: 'destructive' as const,
              onPress: onRemove,
            },
          ]
        : []),
      {
        text: 'Cancelar',
        style: 'cancel' as const,
      },
    ]);
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permissao necessaria', 'Precisamos de acesso a camera');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      onPick(result.assets[0].uri);
    }
  };

  const pickFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permissao necessaria', 'Precisamos de acesso a galeria');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      onPick(result.assets[0].uri);
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={showOptions} activeOpacity={0.8}>
      <Avatar uri={currentUri} name={name} size={120} />
      <View style={styles.editBadge}>
        <Ionicons name="camera" size={16} color="#fff" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: darkTheme.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: darkTheme.background,
  },
});
