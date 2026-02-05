# Plano 08: Notas - Dependencies

## O Que Este Plano Provê

### Exports

#### Screens (`src/screens/notes/`)

| Export | Descrição |
|--------|-----------|
| `NotesListScreen` | Lista de notas |
| `NoteFoldersScreen` | Gestão de pastas |
| `NoteDetailScreen` | Editor de nota |
| `NoteNewScreen` | Criar nota |
| `NoteVersionsScreen` | Histórico de versões |

#### Components (`src/components/notes/`)

| Export | Descrição |
|--------|-----------|
| `NoteCard` | Card de nota |
| `NoteEditor` | Editor de texto |
| `NoteToolbar` | Toolbar do editor |
| `FolderSelector` | Seletor de pasta |
| `FolderItem` | Item de pasta |
| `FolderTree` | Árvore de pastas |
| `VersionItem` | Item de versão |
| `NoteFilters` | Filtros de notas |

#### Hooks (`src/hooks/`)

| Export | Descrição |
|--------|-----------|
| `useNotes` | Lista de notas |
| `useNote` | Nota por ID |
| `useCreateNote` | Mutation criar |
| `useUpdateNote` | Mutation atualizar |
| `useAutoSaveNote` | Auto-save |
| `useNoteVersions` | Versões da nota |
| `useNoteFolders` | Pastas |

---

## O Que Este Plano Consome

### Do Plano 01 (estrutura-base)

| Import | Uso |
|--------|-----|
| `Card`, `Avatar`, `Button`, `Input` | Componentes UI |
| `Modal`, `Skeleton` | Componentes UI |
| `attachmentService` | Upload/download |
| `apiClient` | Requisições |
| `darkTheme`, `spacing`, `typography` | Estilos |

### Do Plano 02 (auth)

| Import | Uso |
|--------|-----|
| `useAuth` | Autor da nota |

### Do Plano 06 (tarefas)

| Import | Uso |
|--------|-----|
| `AttachmentGrid` | Grid de anexos |

---

## Planos Dependentes

Nenhum plano depende diretamente deste.

---

## Contratos

### NoteCard

```typescript
interface NoteCardProps {
  note: Note;
  onPress: () => void;
}
```

### Auto-save

O hook `useAutoSaveNote` salva automaticamente após 1 segundo de inatividade:

```typescript
const { save, isSaving } = useAutoSaveNote(noteId);

// Chamar save() a cada mudança de conteúdo
// isSaving indica se está salvando

<TextInput
  value={content}
  onChangeText={(text) => {
    setContent(text);
    save(text);
  }}
/>
{isSaving && <Text>Salvando...</Text>}
```

### Versões

```typescript
interface NoteVersion {
  id: string;
  note_id: string;
  content: string;
  version: number;
  created_by: string;
  created_at: string;
}
```
