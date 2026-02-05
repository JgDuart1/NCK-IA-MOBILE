import React from 'react';

import { SettingsItem } from './SettingsItem';

interface CacheInfoProps {
  size: string;
  isClearing?: boolean;
  onClear: () => void;
}

export function CacheInfo({ size, isClearing, onClear }: CacheInfoProps) {
  return (
    <SettingsItem
      icon="folder-outline"
      label="Cache"
      value={isClearing ? 'Limpando...' : size}
      onPress={onClear}
    />
  );
}
