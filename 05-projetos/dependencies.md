# Plano 05: Projetos - Dependencies

## O Que Este Plano Provê

### Exports

#### Screens (`src/screens/projects/`)

| Export | Descrição |
|--------|-----------|
| `ProjectsListScreen` | Lista de projetos |
| `ProjectNewScreen` | Criação de projeto |
| `ProjectDetailScreen` | Detalhes do projeto |
| `ProjectMembersScreen` | Gestão de membros |
| `ProjectSettingsScreen` | Configurações |

#### Components (`src/components/projects/`)

| Export | Descrição |
|--------|-----------|
| `ProjectCard` | Card de projeto |
| `ProjectHeader` | Header colorido |
| `ProjectTabs` | Navegação por tabs |
| `ProjectOverview` | Visão geral |
| `MemberListItem` | Item de membro |
| `ColorPicker` | Seletor de cor |
| `WorkModeSelector` | Seletor de modo |
| `StatusFilter` | Filtro por status |

#### Store (`src/stores/`)

| Export | Descrição |
|--------|-----------|
| `useProjectStore` | Store do projeto selecionado |

#### Hooks (`src/hooks/`)

| Export | Descrição |
|--------|-----------|
| `useProjects` | Lista de projetos |
| `useProject` | Projeto por ID |
| `useCreateProject` | Mutation criar |
| `useUpdateProject` | Mutation atualizar |
| `useDeleteProject` | Mutation excluir |
| `useProjectMembers` | Membros do projeto |

---

## O Que Este Plano Consome

### Do Plano 01 (estrutura-base)

| Import | Uso |
|--------|-----|
| `Card`, `Badge`, `Button`, `Input` | Componentes UI |
| `EmptyState`, `LoadingScreen`, `ErrorState` | Feedback |
| `apiClient` | Requisições HTTP |
| `darkTheme`, `spacing`, `typography` | Estilos |

### Do Plano 02 (auth)

| Import | Uso |
|--------|-----|
| `useAuth` | Verificar permissões |

### Do Plano 03 (navigation)

| Import | Uso |
|--------|-----|
| `ProjectsScreenProps` | Tipagem |

---

## Planos Dependentes

| Plano | Usa |
|-------|-----|
| 06-tarefas | `useProjectStore` para projeto atual |
| 07-sprints | `useProjectStore` para projeto atual |
| 08-notas | `useProject` para associar notas |
| 09-calendario | Eventos do projeto |
| 11-canvas | Canvas do projeto |

---

## Contratos

### ProjectStore

```typescript
interface ProjectState {
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
}

// Uso em outros planos
const project = useProjectStore((s) => s.selectedProject);
```

### Project com Contadores

A API deve retornar contadores:

```typescript
interface ProjectWithCounts extends Project {
  tasks_count: number;
  members_count: number;
  sprints_count: number;
  notes_count: number;
}
```
