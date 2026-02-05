import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/use-auth';
import { darkTheme } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

interface AttendeeSelectorProps {
  value: string[];
  onChange: (next: string[]) => void;
}

export function AttendeeSelector({ value, onChange }: AttendeeSelectorProps) {
  const { user } = useAuth();
  const [input, setInput] = useState('');

  const addId = (id: string) => {
    if (!id || value.includes(id)) {
      return;
    }
    onChange([...value, id]);
    setInput('');
  };

  const removeId = (id: string) => {
    onChange(value.filter((item) => item !== id));
  };

  const addCurrentUser = () => {
    if (!user) {
      return;
    }
    addId(user.id);
  };

  return (
    <View style={styles.container}>
      <Input
        label="Adicionar participante (ID)"
        placeholder="Digite o ID do usuario"
        value={input}
        onChangeText={setInput}
        rightIcon="add-circle-outline"
        onRightIconPress={() => addId(input.trim())}
      />

      {user ? (
        <Button variant="outline" size="sm" onPress={addCurrentUser}>
          Adicionar eu
        </Button>
      ) : null}

      <View style={styles.list}>
        {value.length ? (
          value.map((id) => (
            <Pressable key={id} style={styles.chip} onPress={() => removeId(id)}>
              <Text style={styles.chipText}>{id}</Text>
              <Text style={styles.chipRemove}>x</Text>
            </Pressable>
          ))
        ) : (
          <Text style={styles.empty}>Nenhum participante selecionado.</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    backgroundColor: darkTheme.surfaceSecondary,
    borderWidth: 1,
    borderColor: darkTheme.border,
  },
  chipText: {
    ...typography.caption,
    color: darkTheme.text,
  },
  chipRemove: {
    ...typography.caption,
    color: darkTheme.textSecondary,
  },
  empty: {
    ...typography.caption,
    color: darkTheme.textSecondary,
  },
});
