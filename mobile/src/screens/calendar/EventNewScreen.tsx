import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Switch,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  AttendeeSelector,
  DateTimePicker,
  EventTypeBadge,
} from '@/components/calendar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useCreateEvent } from '@/hooks/use-events';
import { darkTheme } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { CalendarScreenProps } from '@/navigation/types';
import { Event } from '@/types';

type Props = CalendarScreenProps<'EventNew'>;

type EventType = Event['type'];

const EVENT_TYPES: { value: EventType; label: string }[] = [
  { value: 'MEETING', label: 'Reuniao' },
  { value: 'DEADLINE', label: 'Prazo' },
  { value: 'MILESTONE', label: 'Marco' },
  { value: 'REMINDER', label: 'Lembrete' },
  { value: 'DELIVERY', label: 'Entrega' },
  { value: 'OTHER', label: 'Outro' },
];

export function EventNewScreen({ route, navigation }: Props) {
  const createEvent = useCreateEvent();
  const initialDate = useMemo(() => {
    if (route.params?.date) {
      const base = new Date(`${route.params.date}T09:00:00`);
      return Number.isNaN(base.getTime()) ? new Date() : base;
    }
    return new Date();
  }, [route.params?.date]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [meetingUrl, setMeetingUrl] = useState('');
  const [type, setType] = useState<EventType>('MEETING');
  const [startAt, setStartAt] = useState(initialDate);
  const [endAt, setEndAt] = useState(new Date(initialDate.getTime() + 60 * 60 * 1000));
  const [isAllDay, setIsAllDay] = useState(false);
  const [projectId, setProjectId] = useState(route.params?.projectId ?? '');
  const [attendeeIds, setAttendeeIds] = useState<string[]>([]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Titulo obrigatorio', 'Informe o titulo do evento.');
      return;
    }

    const payloadStart = new Date(startAt);
    const payloadEnd = new Date(endAt);

    if (isAllDay) {
      payloadStart.setHours(0, 0, 0, 0);
      payloadEnd.setHours(23, 59, 59, 999);
    }

    try {
      const created = await createEvent.mutateAsync({
        title: title.trim(),
        description: description.trim() || undefined,
        type,
        location: location.trim() || undefined,
        meeting_url: meetingUrl.trim() || undefined,
        start_at: payloadStart.toISOString(),
        end_at: payloadEnd.toISOString(),
        is_all_day: isAllDay,
        project_id: projectId.trim() || undefined,
        attendee_ids: attendeeIds.length ? attendeeIds : undefined,
      });

      navigation.replace('EventDetail', { eventId: created.id });
    } catch {
      Alert.alert('Erro', 'Nao foi possivel criar o evento.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Input label="Titulo" placeholder="Nome do evento" value={title} onChangeText={setTitle} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tipo do evento</Text>
          <View style={styles.typeList}>
            {EVENT_TYPES.map((item) => (
              <Pressable
                key={item.value}
                style={[styles.typeChip, type === item.value && styles.typeChipActive]}
                onPress={() => setType(item.value)}
              >
                <EventTypeBadge type={item.value} />
              </Pressable>
            ))}
          </View>
        </View>

        <Input
          label="Descricao"
          placeholder="Detalhes do evento"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <Input label="Local" placeholder="Local do evento" value={location} onChangeText={setLocation} />
        <Input
          label="Link da reuniao"
          placeholder="https://"
          value={meetingUrl}
          onChangeText={setMeetingUrl}
        />

        <View style={styles.row}>
          <Text style={styles.label}>Dia inteiro</Text>
          <Switch
            value={isAllDay}
            onValueChange={setIsAllDay}
            trackColor={{ true: darkTheme.primary }}
          />
        </View>

        <DateTimePicker label="Inicio" value={startAt} onChange={setStartAt} mode="datetime" />
        <DateTimePicker label="Fim" value={endAt} onChange={setEndAt} mode="datetime" />

        <Input
          label="Projeto (opcional)"
          placeholder="ID do projeto"
          value={projectId}
          onChangeText={setProjectId}
        />

        <AttendeeSelector value={attendeeIds} onChange={setAttendeeIds} />

        <View style={styles.actions}>
          <Button variant="ghost" onPress={() => navigation.goBack()}>
            Cancelar
          </Button>
          <Button onPress={handleSubmit} loading={createEvent.isPending}>
            Criar
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.background,
  },
  content: {
    padding: spacing.md,
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.h3,
    color: darkTheme.text,
  },
  typeList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  typeChip: {
    borderRadius: 999,
    padding: 2,
  },
  typeChipActive: {
    backgroundColor: darkTheme.surfaceSecondary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    ...typography.bodySmall,
    color: darkTheme.text,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
});
