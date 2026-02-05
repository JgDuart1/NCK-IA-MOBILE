# Relatorio de Sucesso Plan-07-sprints

Data: 2026-02-05
Branch: mobile/07-sprints
Status: concluido com pendencias de validacao

Resumo
- Implementado modulo de sprints com listagem, detalhes e criacao/edicao.
- Criados componentes de sprint (card, progresso, badge, form, lista de tarefas).
- Integracao com tarefas: filtro por sprint, selecao de sprint no formulario e tarefas por sprint.
- Substituidos PlaceholderScreens de sprints na navegacao de projetos.

Entregas do plano
- Lista de sprints ordenada com status e datas.
- Detalhes da sprint com progresso, tarefas e acoes iniciar/concluir/editar.
- Criacao e edicao de sprint.
- Adicionar tarefa a sprint e remover tarefa da sprint.

Arquivos principais
- mobile/src/screens/sprints/SprintsListScreen.tsx
- mobile/src/screens/sprints/SprintDetailScreen.tsx
- mobile/src/screens/sprints/SprintNewScreen.tsx
- mobile/src/components/sprints/SprintCard.tsx
- mobile/src/components/sprints/SprintForm.tsx
- mobile/src/components/sprints/SprintProgress.tsx
- mobile/src/components/sprints/SprintStatusBadge.tsx
- mobile/src/components/sprints/SprintTasksList.tsx
- mobile/src/services/api/sprints.api.ts
- mobile/src/hooks/use-sprints.ts
- mobile/src/screens/tasks/TasksListScreen.tsx
- mobile/src/screens/tasks/TaskNewScreen.tsx
- mobile/src/screens/tasks/TaskEditScreen.tsx
- mobile/src/navigation/stacks/ProjectsStack.tsx
- mobile/src/navigation/types.ts

Testes e verificacoes
- npm run typecheck (falhou: tsc nao encontrado no ambiente)
- Testes manuais nao executados neste ambiente

Observacoes
- Bloqueio local para iniciar sprint quando ja existe outra ativa.
- Remocao de tarefa da sprint feita via update de sprint_id para null.
