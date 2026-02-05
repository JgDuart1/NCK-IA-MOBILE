# Plano 08: Notas - PRD

## Configuração do Agente

- **Modo**: Ralph-Loop
- **Branch**: `mobile/08-notas`
- **Timeout**: 2 horas
- **Dependências**: Planos 01, 02, 03 completos
- **Arquivos de contexto**:
  - `../contracts.md`
  - `./dependencies.md`

---

## Objetivo

Implementar o módulo de notas: criação, edição, organização em pastas, versionamento e gestão de anexos. Notas podem ser globais (acessíveis via Menu Mais) ou associadas a projetos.

---

## User Stories

### US-01: Listar Notas
**Como** usuário  
**Quero** ver minhas notas  
**Para** acessar informações rapidamente

**Critérios de Aceitação:**
- [ ] Lista de notas (cards)
- [ ] Filtro por pasta
- [ ] Busca por título/conteúdo
- [ ] Notas fixadas no topo
- [ ] Preview do conteúdo

### US-02: Criar Nota
**Como** usuário  
**Quero** criar novas notas  
**Para** registrar informações

**Critérios de Aceitação:**
- [ ] Editor de texto simples
- [ ] Título obrigatório
- [ ] Seleção de pasta
- [ ] Cor de destaque
- [ ] Anexar arquivos

### US-03: Editar Nota
**Como** usuário  
**Quero** editar notas existentes  
**Para** atualizar informações

**Critérios de Aceitação:**
- [ ] Edição inline
- [ ] Auto-save
- [ ] Histórico de versões

### US-04: Organizar em Pastas
**Como** usuário  
**Quero** organizar notas em pastas  
**Para** manter tudo organizado

**Critérios de Aceitação:**
- [ ] Criar pastas
- [ ] Mover notas entre pastas
- [ ] Pastas aninhadas
- [ ] Excluir pastas vazias

### US-05: Versões
**Como** usuário  
**Quero** ver versões anteriores  
**Para** recuperar informações perdidas

**Critérios de Aceitação:**
- [ ] Lista de versões
- [ ] Visualizar versão antiga
- [ ] Restaurar versão

### US-06: Anexos
**Como** usuário  
**Quero** anexar arquivos às notas  
**Para** manter documentos relacionados

**Critérios de Aceitação:**
- [ ] Upload de imagens/documentos
- [ ] Visualizar anexos
- [ ] Excluir anexos

---

## Telas

### 1. NotesListScreen
- Header com título e busca
- Filtro por pasta (dropdown)
- Grid/Lista de notas
- FAB para nova nota

### 2. NoteFoldersScreen
- Lista de pastas
- Criar nova pasta
- Editar/excluir pasta
- Navegação para sub-pastas

### 3. NoteDetailScreen
- Editor de texto
- Toolbar com ações
- Lista de anexos
- Botão versões
- Auto-save indicator

### 4. NoteVersionsScreen
- Lista de versões
- Data e autor
- Visualizar versão
- Restaurar versão

---

## Endpoints Utilizados

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/notes` | Listar notas |
| POST | `/notes` | Criar nota |
| GET | `/notes/:id` | Detalhes da nota |
| PATCH | `/notes/:id` | Atualizar nota |
| DELETE | `/notes/:id` | Excluir nota |
| GET | `/notes/:id/versions` | Listar versões |
| POST | `/notes/:id/versions/:versionId/restore` | Restaurar versão |
| GET | `/note-folders` | Listar pastas |
| POST | `/note-folders` | Criar pasta |
| PATCH | `/note-folders/:id` | Atualizar pasta |
| DELETE | `/note-folders/:id` | Excluir pasta |

---

## Componentes Específicos

| Componente | Descrição |
|------------|-----------|
| `NoteCard` | Card de nota |
| `NoteEditor` | Editor de texto |
| `FolderSelector` | Seletor de pasta |
| `FolderItem` | Item de pasta |
| `VersionItem` | Item de versão |
| `AttachmentGrid` | Grid de anexos (reuso do Plano 06) |
