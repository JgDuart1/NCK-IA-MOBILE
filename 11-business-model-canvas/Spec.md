# Plano 11: Business Model Canvas - Spec

## Configuração do Agente

- **Modo**: Ralph-Loop
- **Branch**: `mobile/11-business-model-canvas`
- **Timeout**: 2 horas
- **Dependências**: Planos 01, 02, 03, 05 completos
- **Arquivos de contexto**:
  - `../contracts.md`
  - `./dependencies.md`

---

## Estrutura de Arquivos

```
src/
├── screens/
│   └── canvas/
│       ├── CanvasListScreen.tsx
│       ├── CanvasNewScreen.tsx
│       ├── CanvasDetailScreen.tsx
│       ├── BlockEditorScreen.tsx
│       ├── AssumptionsScreen.tsx
│       ├── ExperimentsScreen.tsx
│       └── index.ts
│
├── components/
│   └── canvas/
│       ├── CanvasCard.tsx
│       ├── CanvasGrid.tsx
│       ├── CanvasBlock.tsx
│       ├── BlockItem.tsx
│       ├── BlockEditor.tsx
│       ├── AssumptionItem.tsx
│       ├── ExperimentItem.tsx
│       ├── ExperimentForm.tsx
│       └── index.ts
│
├── services/
│   └── api/
│       └── canvas.api.ts
│
└── hooks/
    └── use-canvas.ts
```

---

## Implementações

### 1. Canvas API (src/services/api/canvas.api.ts)

```typescript
import { apiClient } from './client';
import { BusinessModelCanvas, CanvasBlocks, CanvasAssumption, CanvasExperiment } from '@/types';

interface CreateCanvasDto {
  project_id: string;
  name: string;
  description?: string;
}

interface UpdateBlocksDto {
  blocks: CanvasBlocks;
}

export const canvasApi = {
  async list(projectId: string): Promise<BusinessModelCanvas[]> {
    const response = await apiClient.get(`/projects/${projectId}/canvas`);
    return response.data.data;
  },

  async getById(id: string): Promise<BusinessModelCanvas> {
    const response = await apiClient.get(`/canvas/${id}`);
    return response.data.data;
  },

  async create(data: CreateCanvasDto): Promise<BusinessModelCanvas> {
    const response = await apiClient.post('/canvas', data);
    return response.data.data;
  },

  async update(id: string, data: Partial<CreateCanvasDto>): Promise<BusinessModelCanvas> {
    const response = await apiClient.patch(`/canvas/${id}`, data);
    return response.data.data;
  },

  async updateBlocks(id: string, blocks: CanvasBlocks): Promise<BusinessModelCanvas> {
    const response = await apiClient.patch(`/canvas/${id}`, { blocks });
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/canvas/${id}`);
  },

  // Assumptions
  async addAssumption(canvasId: string, text: string): Promise<CanvasAssumption> {
    const response = await apiClient.post(`/canvas/${canvasId}/assumptions`, { text });
    return response.data.data;
  },

  async updateAssumption(canvasId: string, assumptionId: string, validated: boolean): Promise<CanvasAssumption> {
    const response = await apiClient.patch(`/canvas/${canvasId}/assumptions/${assumptionId}`, { validated });
    return response.data.data;
  },

  async deleteAssumption(canvasId: string, assumptionId: string): Promise<void> {
    await apiClient.delete(`/canvas/${canvasId}/assumptions/${assumptionId}`);
  },

  // Experiments
  async addExperiment(canvasId: string, data: Partial<CanvasExperiment>): Promise<CanvasExperiment> {
    const response = await apiClient.post(`/canvas/${canvasId}/experiments`, data);
    return response.data.data;
  },

  async updateExperiment(canvasId: string, experimentId: string, data: Partial<CanvasExperiment>): Promise<CanvasExperiment> {
    const response = await apiClient.patch(`/canvas/${canvasId}/experiments/${experimentId}`, data);
    return response.data.data;
  },

  async deleteExperiment(canvasId: string, experimentId: string): Promise<void> {
    await apiClient.delete(`/canvas/${canvasId}/experiments/${experimentId}`);
  },
};
```

### 2. useCanvas Hook (src/hooks/use-canvas.ts)

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { canvasApi } from '@/services/api/canvas.api';

export function useCanvasList(projectId: string) {
  return useQuery({
    queryKey: ['canvas', 'list', projectId],
    queryFn: () => canvasApi.list(projectId),
    enabled: !!projectId,
  });
}

export function useCanvas(id: string) {
  return useQuery({
    queryKey: ['canvas', 'detail', id],
    queryFn: () => canvasApi.getById(id),
    enabled: !!id,
  });
}

export function useUpdateBlocks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, blocks }: { id: string; blocks: CanvasBlocks }) =>
      canvasApi.updateBlocks(id, blocks),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['canvas', 'detail', id] });
    },
  });
}

export function useAddAssumption() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ canvasId, text }: { canvasId: string; text: string }) =>
      canvasApi.addAssumption(canvasId, text),
    onSuccess: (_, { canvasId }) => {
      queryClient.invalidateQueries({ queryKey: ['canvas', 'detail', canvasId] });
    },
  });
}

export function useToggleAssumption() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ canvasId, assumptionId, validated }: { canvasId: string; assumptionId: string; validated: boolean }) =>
      canvasApi.updateAssumption(canvasId, assumptionId, validated),
    onSuccess: (_, { canvasId }) => {
      queryClient.invalidateQueries({ queryKey: ['canvas', 'detail', canvasId] });
    },
  });
}
```

### 3. CanvasGrid Component

```typescript
import React from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { CanvasBlock } from './CanvasBlock';
import { CanvasBlocks } from '@/types';
import { darkTheme, spacing } from '@/theme';

interface CanvasGridProps {
  blocks: CanvasBlocks;
  onBlockPress: (blockKey: keyof CanvasBlocks) => void;
}

const BLOCK_CONFIG: Array<{ key: keyof CanvasBlocks; label: string; color: string }> = [
  { key: 'key_partners', label: 'Parceiros Chave', color: '#6366F1' },
  { key: 'key_activities', label: 'Atividades Chave', color: '#8B5CF6' },
  { key: 'key_resources', label: 'Recursos Chave', color: '#EC4899' },
  { key: 'value_propositions', label: 'Proposta de Valor', color: '#F59E0B' },
  { key: 'customer_relationships', label: 'Relacionamento', color: '#10B981' },
  { key: 'channels', label: 'Canais', color: '#14B8A6' },
  { key: 'customer_segments', label: 'Segmentos', color: '#3B82F6' },
  { key: 'cost_structure', label: 'Estrutura de Custo', color: '#EF4444' },
  { key: 'revenue_streams', label: 'Fontes de Receita', color: '#22C55E' },
];

const SCREEN_WIDTH = Dimensions.get('window').width;

export function CanvasGrid({ blocks, onBlockPress }: CanvasGridProps) {
  return (
    <ScrollView
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {/* Layout do Canvas: 3 colunas, layout específico */}
      <View style={styles.page}>
        <View style={styles.row}>
          {/* Linha 1: Partners, Activities+Resources, Value Props, Relations+Channels, Segments */}
          <CanvasBlock
            config={BLOCK_CONFIG[0]}
            items={blocks.key_partners}
            onPress={() => onBlockPress('key_partners')}
          />
          <View style={styles.doubleBlock}>
            <CanvasBlock
              config={BLOCK_CONFIG[1]}
              items={blocks.key_activities}
              onPress={() => onBlockPress('key_activities')}
              half
            />
            <CanvasBlock
              config={BLOCK_CONFIG[2]}
              items={blocks.key_resources}
              onPress={() => onBlockPress('key_resources')}
              half
            />
          </View>
          <CanvasBlock
            config={BLOCK_CONFIG[3]}
            items={blocks.value_propositions}
            onPress={() => onBlockPress('value_propositions')}
          />
        </View>
      </View>

      <View style={styles.page}>
        <View style={styles.row}>
          <View style={styles.doubleBlock}>
            <CanvasBlock
              config={BLOCK_CONFIG[4]}
              items={blocks.customer_relationships}
              onPress={() => onBlockPress('customer_relationships')}
              half
            />
            <CanvasBlock
              config={BLOCK_CONFIG[5]}
              items={blocks.channels}
              onPress={() => onBlockPress('channels')}
              half
            />
          </View>
          <CanvasBlock
            config={BLOCK_CONFIG[6]}
            items={blocks.customer_segments}
            onPress={() => onBlockPress('customer_segments')}
          />
        </View>
      </View>

      <View style={styles.page}>
        <View style={styles.row}>
          <CanvasBlock
            config={BLOCK_CONFIG[7]}
            items={blocks.cost_structure}
            onPress={() => onBlockPress('cost_structure')}
          />
          <CanvasBlock
            config={BLOCK_CONFIG[8]}
            items={blocks.revenue_streams}
            onPress={() => onBlockPress('revenue_streams')}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  page: {
    width: SCREEN_WIDTH - spacing.md * 2,
    paddingHorizontal: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  doubleBlock: {
    flex: 1,
    gap: spacing.sm,
  },
});
```

### 4. CanvasBlock Component

```typescript
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlockItem } from './BlockItem';
import { darkTheme, spacing, typography } from '@/theme';

interface CanvasBlockProps {
  config: { key: string; label: string; color: string };
  items: string[];
  onPress: () => void;
  half?: boolean;
}

export function CanvasBlock({ config, items, onPress, half }: CanvasBlockProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        { borderTopColor: config.color },
        half && styles.halfHeight,
      ]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <Text style={styles.label}>{config.label}</Text>
        <View style={styles.count}>
          <Text style={styles.countText}>{items.length}</Text>
        </View>
      </View>

      <ScrollView style={styles.items} nestedScrollEnabled>
        {items.slice(0, 3).map((item, index) => (
          <BlockItem key={index} text={item} color={config.color} />
        ))}
        {items.length > 3 && (
          <Text style={styles.more}>+{items.length - 3} mais</Text>
        )}
        {items.length === 0 && (
          <View style={styles.empty}>
            <Ionicons name="add-circle-outline" size={24} color={darkTheme.textSecondary} />
            <Text style={styles.emptyText}>Adicionar</Text>
          </View>
        )}
      </ScrollView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.surface,
    borderRadius: 12,
    borderTopWidth: 3,
    padding: spacing.sm,
    minHeight: 150,
  },
  halfHeight: {
    minHeight: 70,
    flex: 0.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  label: {
    ...typography.caption,
    color: darkTheme.textSecondary,
    fontWeight: '600',
  },
  count: {
    backgroundColor: darkTheme.surfaceSecondary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countText: {
    ...typography.caption,
    color: darkTheme.textSecondary,
  },
  items: {
    flex: 1,
  },
  more: {
    ...typography.caption,
    color: darkTheme.primary,
    marginTop: spacing.xs,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
  },
  emptyText: {
    ...typography.caption,
    color: darkTheme.textSecondary,
  },
});
```

### 5. CanvasDetailScreen

```typescript
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { CanvasGrid, AssumptionsList, ExperimentsList } from '@/components/canvas';
import { LoadingScreen, ErrorState } from '@/components/feedback';
import { useCanvas } from '@/hooks/use-canvas';
import { darkTheme, spacing } from '@/theme';

const Tab = createMaterialTopTabNavigator();

export function CanvasDetailScreen({ route, navigation }: any) {
  const { canvasId } = route.params;
  const { data: canvas, isLoading, error, refetch } = useCanvas(canvasId);

  if (isLoading) return <LoadingScreen />;
  if (error || !canvas) {
    return <ErrorState title="Erro" message="Canvas não encontrado" action={{ label: 'Tentar novamente', onPress: refetch }} />;
  }

  const handleBlockPress = (blockKey: string) => {
    navigation.navigate('BlockEditor', { canvasId, blockKey });
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: { backgroundColor: darkTheme.surface },
          tabBarActiveTintColor: darkTheme.primary,
          tabBarInactiveTintColor: darkTheme.textSecondary,
          tabBarIndicatorStyle: { backgroundColor: darkTheme.primary },
        }}
      >
        <Tab.Screen name="Canvas">
          {() => (
            <View style={styles.tabContent}>
              <CanvasGrid blocks={canvas.blocks} onBlockPress={handleBlockPress} />
            </View>
          )}
        </Tab.Screen>
        <Tab.Screen name="Assumptions">
          {() => (
            <AssumptionsList
              canvasId={canvasId}
              assumptions={canvas.assumptions || []}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Experimentos">
          {() => (
            <ExperimentsList
              canvasId={canvasId}
              experiments={canvas.experiments || []}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.background,
  },
  tabContent: {
    flex: 1,
    padding: spacing.md,
  },
});
```

---

## Testes

### Testes Manuais
- [ ] Lista canvas corretamente
- [ ] Criar canvas funciona
- [ ] Visualização do grid funciona
- [ ] Editar blocos funciona
- [ ] Assumptions funcionam
- [ ] Experimentos funcionam

---

## Checklist de Entrega

- [ ] Todas as telas implementadas
- [ ] CanvasGrid com 9 blocos
- [ ] Editor de blocos
- [ ] Assumptions funcionando
- [ ] Experimentos funcionando
- [ ] Navegação integrada
- [ ] Sem erros de TypeScript
