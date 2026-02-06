# Relatorio de Merge Plan-08-notas

## Resumo
Merge do plano 08 (Notas) aplicado na `main`.

## Commit
- `6c0e03b` (merge: plano 08 notas)

## Conflitos Resolvidos
- `mobile/src/components/index.ts` (mantidos exports de `sprints` e `notes`).
- `mobile/src/hooks/index.ts` (mantidos exports de `use-sprints` e novos hooks de notas).
- `mobile/src/navigation/stacks/ProjectsStack.tsx` (mantidas telas de sprints e adicionadas telas de notas).
- `mobile/src/services/api/index.ts` (mantidos endpoints de sprints e adicionados notes/note-folders).

## Validacoes
- `npm run typecheck` (OK) no worktree `mobile/08-notas`.

## Observacoes
- Testes manuais ainda pendentes.

