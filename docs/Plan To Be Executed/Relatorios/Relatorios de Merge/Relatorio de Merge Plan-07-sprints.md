# Relatorio de Merge Plan-07-sprints

Data: 2026-02-05
Branch origem: mobile/07-sprints
Branch destino: main

Resumo do merge
- Merge realizado sem conflitos (fast-forward).
- Modulo de sprints integrado com listagem, detalhes, criacao/edicao e acoes de status.
- Integracao com tarefas: filtros por sprint e associacao/desassociacao de tarefas.

Arquivos principais incorporados
- mobile/src/screens/sprints/SprintsListScreen.tsx
- mobile/src/screens/sprints/SprintDetailScreen.tsx
- mobile/src/screens/sprints/SprintNewScreen.tsx
- mobile/src/components/sprints/*
- mobile/src/hooks/use-sprints.ts
- mobile/src/services/api/sprints.api.ts
- mobile/src/screens/tasks/TasksListScreen.tsx
- mobile/src/screens/tasks/TaskNewScreen.tsx
- mobile/src/screens/tasks/TaskEditScreen.tsx
- mobile/src/navigation/stacks/ProjectsStack.tsx
- mobile/src/navigation/types.ts
- docs/Plan To Be Executed/Relatorios/Relatorio de Sucesso Plan-07-sprints.md

Conflitos
- Nenhum.

Validacoes
- npm run typecheck (falhou: tsc nao encontrado no ambiente)

Observacoes
- Main atualizado e push concluido.
