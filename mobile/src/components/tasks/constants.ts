import { Dimensions } from 'react-native';
import { colors } from '@/theme';

export const KANBAN_COLUMN_WIDTH = Math.min(320, Math.round(Dimensions.get('window').width * 0.8));

export const KANBAN_COLUMNS = [
  { key: 'BACKLOG', label: 'Backlog', color: colors.neutral[500] },
  { key: 'TODO', label: 'A Fazer', color: colors.primary[500] },
  { key: 'IN_PROGRESS', label: 'Em Progresso', color: colors.warning },
  { key: 'IN_REVIEW', label: 'Em Revisao', color: colors.primary[400] },
  { key: 'DONE', label: 'Concluido', color: colors.success },
] as const;

export type KanbanStatus = (typeof KANBAN_COLUMNS)[number]['key'];

export const KANBAN_STATUSES = KANBAN_COLUMNS.map((column) => column.key) as KanbanStatus[];
