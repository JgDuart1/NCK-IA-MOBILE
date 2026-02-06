# Plano 08: Notas - Dependencies

## O Que Este Plano Prove

### Exports

#### Screens (`src/screens/notes/`)

| Export | Descricao |
|--------|-----------|
| `NotesListScreen` | Lista de notas |
| `NoteFoldersScreen` | Gestao de pastas |
| `NoteDetailScreen` | Editor de nota |
| `NoteNewScreen` | Criar nota |
| `NoteVersionsScreen` | Historico de versoes |

#### Components (`src/components/notes/`)

| Export | Descricao |
|--------|-----------|
| `NoteCard` | Card de nota |
| `NoteEditor` | Editor de texto |
| `NoteToolbar` | Toolbar do editor |
| `FolderSelector` | Seletor de pasta |
| `FolderItem` | Item de pasta |
| `FolderTree` | Arvore de pastas |
| `VersionItem` | Item de versao |
| `NoteFilters` | Filtros de notas |

#### Hooks (`src/hooks/`)

| Export | Descricao |
|--------|-----------|
| `useNotes` | Lista de notas |
| `useNote` | Nota por ID |
| `useCreateNote` | Mutation criar |
| `useUpdateNote` | Mutation atualizar |
| `useDeleteNote` | Mutation excluir |
| `useAutoSaveNote` | Auto-save |
| `useNoteVersions` | Versoes da nota |
| `useNoteFolders` | Pastas |
| `useCreateNoteFolder` | Criar pasta |
| `useUpdateNoteFolder` | Atualizar pasta |
| `useDeleteNoteFolder` | Excluir pasta |
| `useDebounce` | Hook de debounce |

---

## O Que Este Plano Consome

### Do Plano 01 (estrutura-base)

| Import | Uso |
|--------|-----|
| `Card`, `Avatar`, `Button`, `Input` | Componentes UI |
| `Modal`, `Skeleton` | Componentes UI |
| `attachmentService` | Upload/download |
| `apiClient` | Requisicoes |
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

O hook `useAutoSaveNote` salva automaticamente apos 1 segundo de inatividade:

```typescript
const { save, isSaving } = useAutoSaveNote(noteId);

// Chamar save() a cada mudanca de conteudo
// isSaving indica se esta salvando

<TextInput
  value={content}
  onChangeText={(text) => {
    setContent(text);
    save(text);
  }}
/>
{isSaving && <Text>Salvando...</Text>}
```

### Versoes

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
