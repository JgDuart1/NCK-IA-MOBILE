# Relatorio de Merge Plan-11-business-model-canvas

Data: 2026-02-05
Branch de origem: mobile/11-business-model-canvas
Branch de destino: main
Commit de merge: 7fdab34

Resumo
- Merge do plano 11 (business model canvas) realizado na branch main.
- Conflitos resolvidos em barrels de export (hooks e services/api).
- Fluxo de Canvas integrado com selecao de projeto no menu Mais.

Conflitos
- mobile/src/hooks/index.ts (resolvido mantendo exports existentes e adicionando use-canvas)
- mobile/src/services/api/index.ts (resolvido mantendo exports existentes e adicionando canvas.api)

Testes executados
- npm run typecheck (executado na branch mobile/11-business-model-canvas antes do merge)

Pendencias
- Testes manuais nao executados.

Principais arquivos alterados
- mobile/src/screens/canvas/CanvasListScreen.tsx
- mobile/src/screens/canvas/CanvasNewScreen.tsx
- mobile/src/screens/canvas/CanvasDetailScreen.tsx
- mobile/src/screens/canvas/BlockEditorScreen.tsx
- mobile/src/screens/canvas/AssumptionsScreen.tsx
- mobile/src/screens/canvas/ExperimentsScreen.tsx
- mobile/src/components/canvas/CanvasGrid.tsx
- mobile/src/components/canvas/CanvasBlock.tsx
- mobile/src/components/canvas/BlockEditor.tsx
- mobile/src/components/canvas/AssumptionsList.tsx
- mobile/src/components/canvas/ExperimentsList.tsx
- mobile/src/services/api/canvas.api.ts
- mobile/src/hooks/use-canvas.ts
- mobile/src/navigation/stacks/ProjectsStack.tsx
- mobile/src/navigation/stacks/MoreStack.tsx
- mobile/src/navigation/types.ts
- mobile/src/hooks/index.ts
- mobile/src/services/api/index.ts
