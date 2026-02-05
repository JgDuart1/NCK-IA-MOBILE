# Plano 11: Business Model Canvas - PRD

## Configuração do Agente

- **Modo**: Ralph-Loop
- **Branch**: `mobile/11-business-model-canvas`
- **Timeout**: 2 horas
- **Dependências**: Planos 01, 02, 03, 05 completos
- **Arquivos de contexto**:
  - `../contracts.md`
  - `./dependencies.md`

---

## Objetivo

Implementar o módulo de Business Model Canvas: criação, edição dos 9 blocos, gestão de assumptions e experimentos.

---

## User Stories

### US-01: Listar Canvas
**Como** usuário  
**Quero** ver os canvas do projeto  
**Para** acessar e gerenciar modelos de negócio

**Critérios de Aceitação:**
- [ ] Lista de canvas do projeto
- [ ] Preview com nome e descrição
- [ ] Data de última atualização

### US-02: Criar Canvas
**Como** usuário  
**Quero** criar um novo canvas  
**Para** documentar modelo de negócio

**Critérios de Aceitação:**
- [ ] Nome obrigatório
- [ ] Descrição opcional
- [ ] Canvas criado com blocos vazios

### US-03: Editar Blocos
**Como** usuário  
**Quero** editar os 9 blocos do canvas  
**Para** documentar cada área do modelo

**Critérios de Aceitação:**
- [ ] Visualização do canvas completo
- [ ] Tocar em bloco abre editor
- [ ] Adicionar/editar/remover itens
- [ ] Auto-save

### US-04: Gerenciar Assumptions
**Como** usuário  
**Quero** registrar e validar assumptions  
**Para** testar hipóteses do modelo

**Critérios de Aceitação:**
- [ ] Adicionar assumption
- [ ] Marcar como validada/invalidada
- [ ] Lista de assumptions

### US-05: Gerenciar Experimentos
**Como** usuário  
**Quero** criar experimentos  
**Para** validar assumptions

**Critérios de Aceitação:**
- [ ] Criar experimento com hipótese e método
- [ ] Atualizar status (pending, running, completed)
- [ ] Registrar resultados

---

## Telas

### 1. CanvasListScreen
- Lista de canvas do projeto
- FAB para novo canvas

### 2. CanvasDetailScreen
- Visualização dos 9 blocos
- Navegação horizontal para ver todos
- Tabs: Canvas, Assumptions, Experimentos

### 3. BlockEditorScreen
- Editor de itens do bloco
- Lista de itens existentes
- Adicionar novo item
- Editar/excluir item

### 4. AssumptionsScreen
- Lista de assumptions
- Toggle validado
- Adicionar nova

### 5. ExperimentsScreen
- Lista de experimentos
- Status e resultados
- Criar/editar experimento

---

## Os 9 Blocos

| Bloco | Chave | Descrição |
|-------|-------|-----------|
| Parceiros Chave | key_partners | Quem são os parceiros estratégicos |
| Atividades Chave | key_activities | Atividades essenciais |
| Recursos Chave | key_resources | Recursos necessários |
| Proposta de Valor | value_propositions | O que entregamos |
| Relacionamento | customer_relationships | Como nos relacionamos |
| Canais | channels | Como alcançamos clientes |
| Segmentos de Cliente | customer_segments | Para quem criamos valor |
| Estrutura de Custo | cost_structure | Custos do modelo |
| Fontes de Receita | revenue_streams | Como geramos receita |

---

## Endpoints Utilizados

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/projects/:id/canvas` | Listar canvas |
| POST | `/canvas` | Criar canvas |
| GET | `/canvas/:id` | Detalhes do canvas |
| PATCH | `/canvas/:id` | Atualizar canvas/blocos |
| DELETE | `/canvas/:id` | Excluir canvas |

---

## Componentes Específicos

| Componente | Descrição |
|------------|-----------|
| `CanvasCard` | Card de canvas na lista |
| `CanvasGrid` | Grid dos 9 blocos |
| `CanvasBlock` | Bloco individual |
| `BlockItem` | Item dentro do bloco |
| `AssumptionItem` | Item de assumption |
| `ExperimentItem` | Item de experimento |
