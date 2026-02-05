# Plano 11: Business Model Canvas - Dependencies

## O Que Este Plano Provê

### Exports

#### Screens (`src/screens/canvas/`)

| Export | Descrição |
|--------|-----------|
| `CanvasListScreen` | Lista de canvas |
| `CanvasNewScreen` | Criar canvas |
| `CanvasDetailScreen` | Visualização do canvas |
| `BlockEditorScreen` | Editor de bloco |
| `AssumptionsScreen` | Lista de assumptions |
| `ExperimentsScreen` | Lista de experimentos |

#### Components (`src/components/canvas/`)

| Export | Descrição |
|--------|-----------|
| `CanvasCard` | Card na lista |
| `CanvasGrid` | Grid dos 9 blocos |
| `CanvasBlock` | Bloco individual |
| `BlockItem` | Item no bloco |
| `BlockEditor` | Editor de itens |
| `AssumptionItem` | Item de assumption |
| `ExperimentItem` | Item de experimento |
| `ExperimentForm` | Formulário de experimento |

#### Hooks (`src/hooks/`)

| Export | Descrição |
|--------|-----------|
| `useCanvasList` | Lista de canvas |
| `useCanvas` | Canvas por ID |
| `useCreateCanvas` | Mutation criar |
| `useUpdateBlocks` | Mutation atualizar blocos |
| `useAddAssumption` | Mutation adicionar assumption |
| `useToggleAssumption` | Mutation validar assumption |

---

## O Que Este Plano Consome

### Do Plano 01 (estrutura-base)

| Import | Uso |
|--------|-----|
| `Card`, `Button`, `Input` | Componentes UI |
| `Modal` | Para editores |
| `apiClient` | Requisições |
| `darkTheme`, `spacing`, `typography` | Estilos |

### Do Plano 05 (projetos)

| Import | Uso |
|--------|-----|
| `useProjectStore` | Projeto atual |

---

## Planos Dependentes

Nenhum plano depende diretamente deste.

---

## Contratos

### CanvasBlocks

```typescript
interface CanvasBlocks {
  key_partners: string[];
  key_activities: string[];
  key_resources: string[];
  value_propositions: string[];
  customer_relationships: string[];
  channels: string[];
  customer_segments: string[];
  cost_structure: string[];
  revenue_streams: string[];
}

// Canvas vazio
const EMPTY_BLOCKS: CanvasBlocks = {
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
```

### Block Config

```typescript
const BLOCK_CONFIG: Record<keyof CanvasBlocks, { label: string; color: string; description: string }> = {
  key_partners: {
    label: 'Parceiros Chave',
    color: '#6366F1',
    description: 'Quem são seus parceiros e fornecedores principais?',
  },
  key_activities: {
    label: 'Atividades Chave',
    color: '#8B5CF6',
    description: 'Quais atividades são essenciais para entregar sua proposta de valor?',
  },
  // ...
};
```

### Experiment Status

```typescript
type ExperimentStatus = 'pending' | 'running' | 'completed';
```
