import { CanvasBlocks } from '@/types';

export const EMPTY_BLOCKS: CanvasBlocks = {
  key_partners: [],
  key_activities: [],
  key_resources: [],
  value_propositions: [],
  customer_relationships: [],
  channels: [],
  customer_segments: [],
  cost_structure: [],
  revenue_streams: [],
};

export const BLOCK_CONFIG: Record<keyof CanvasBlocks, { label: string; color: string; description: string }> = {
  key_partners: {
    label: 'Parceiros Chave',
    color: '#6366F1',
    description: 'Quem sao seus parceiros e fornecedores principais?',
  },
  key_activities: {
    label: 'Atividades Chave',
    color: '#8B5CF6',
    description: 'Quais atividades sao essenciais para entregar sua proposta de valor?',
  },
  key_resources: {
    label: 'Recursos Chave',
    color: '#EC4899',
    description: 'Quais recursos sao necessarios para operar o negocio?',
  },
  value_propositions: {
    label: 'Proposta de Valor',
    color: '#F59E0B',
    description: 'O que voce entrega que gera valor real ao cliente?',
  },
  customer_relationships: {
    label: 'Relacionamento',
    color: '#10B981',
    description: 'Como voce se relaciona e mantem clientes?',
  },
  channels: {
    label: 'Canais',
    color: '#14B8A6',
    description: 'Quais canais voce usa para atingir clientes?',
  },
  customer_segments: {
    label: 'Segmentos',
    color: '#3B82F6',
    description: 'Para quais segmentos de clientes voce cria valor?',
  },
  cost_structure: {
    label: 'Estrutura de Custo',
    color: '#EF4444',
    description: 'Quais sao os principais custos do seu modelo?',
  },
  revenue_streams: {
    label: 'Fontes de Receita',
    color: '#22C55E',
    description: 'Como o negocio gera receita?',
  },
};

export const BLOCK_ORDER: Array<keyof CanvasBlocks> = [
  'key_partners',
  'key_activities',
  'key_resources',
  'value_propositions',
  'customer_relationships',
  'channels',
  'customer_segments',
  'cost_structure',
  'revenue_streams',
];
