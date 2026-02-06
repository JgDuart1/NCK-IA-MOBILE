# PRD: Fix API Response Unwrapping

## Problema

Apos a correcao do login (commit d04c6ef), o app autentica com sucesso mas nao carrega dados no Dashboard, Projects e Notifications. A causa raiz: 3 modulos de API nao fazem o unwrap correto do envelope `{ success, data, timestamp }` que o backend retorna em TODAS as respostas.

## Impacto

- **Dashboard**: MetricsRow mostra todos os valores como 0 (active_projects, pending_tasks, etc.)
- **Notificacoes**: Badge de nao-lidas sempre mostra 0; botao "Marcar todas como lidas" falha silenciosamente
- **Projetos**: Lista carrega mas tipo PaginatedResponse esta violado (funciona por coincidencia estrutural)

## Criterios de Sucesso

1. Dashboard MetricsRow mostra numeros reais do backend
2. Badge de notificacoes mostra contagem correta de nao-lidas
3. Lista de projetos retorna PaginatedResponse<Project> com estrutura correta
4. Botao "Marcar todas como lidas" executa PATCH correto
5. Zero regressoes nos modulos que ja funcionam (auth, tasks, sprints, notes, canvas, etc.)
6. TypeCheck e Lint passam sem erros

## Escopo

### In Scope
- `dashboard.api.ts` — unwrap de getMetrics()
- `notifications.api.ts` — URL, unwrap e metodo HTTP
- `projects.api.ts` — unwrap de list()

### Out of Scope
- Todos os outros modulos de API (ja estao corretos)
- Mudancas no backend
- Mudancas em componentes de UI
