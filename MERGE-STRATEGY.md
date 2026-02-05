# Estratégia de Merge - NCK IA Mobile

Este documento define a estratégia de merge para integrar todas as branches dos 15 planos.

---

## Ordem de Merge

O merge deve seguir a ordem de dependências:

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   Fase 1: main ← mobile/01-estrutura-base                      │
│                                                                 │
│   Fase 2: main ← mobile/02-auth                                │
│                                                                 │
│   Fase 3: main ← mobile/03-navigation                          │
│                                                                 │
│   Fase 4: (paralelo, ordem não importa)                        │
│           main ← mobile/04-dashboard                            │
│           main ← mobile/05-projetos                             │
│           main ← mobile/09-calendario                           │
│           main ← mobile/10-notificacoes                         │
│           main ← mobile/12-caverna-dragao                       │
│           main ← mobile/13-usuarios-perfil                      │
│           main ← mobile/14-configuracoes                        │
│                                                                 │
│   Fase 5: (paralelo, após Fase 4)                              │
│           main ← mobile/06-tarefas-kanban                       │
│           main ← mobile/07-sprints                              │
│           main ← mobile/08-notas                                │
│           main ← mobile/11-business-model-canvas                │
│                                                                 │
│   Fase 6: main ← mobile/15-deployment                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Comandos de Merge

### Preparação

```bash
# Atualizar main
git checkout main
git pull origin main

# Verificar branches disponíveis
git branch -r | grep mobile/
```

### Fase 1-3 (Sequencial, Obrigatório)

```bash
# Plano 01
git checkout main
git merge mobile/01-estrutura-base --no-ff -m "Merge: [01] Estrutura Base"
git push origin main

# Plano 02
git merge mobile/02-auth --no-ff -m "Merge: [02] Autenticação"
git push origin main

# Plano 03
git merge mobile/03-navigation --no-ff -m "Merge: [03] Navegação"
git push origin main
```

### Fase 4 (Paralelo)

```bash
# Merge de todos os planos da fase 4
# NOTA: Se múltiplos agentes mergearem concorrentemente, pode haver conflitos
# entre merges. Sempre fazer pull antes de cada merge se outro agente mergeou.
for plan in 04-dashboard 05-projetos 09-calendario 10-notificacoes 12-caverna-dragao 13-usuarios-perfil 14-configuracoes; do
  git pull origin main  # Garantir que está atualizado
  git merge mobile/$plan --no-ff -m "Merge: [$plan]"
  # Resolver conflitos se necessário antes de continuar
done
git push origin main
```

### Fase 5 (Após Fase 4)

```bash
for plan in 06-tarefas-kanban 07-sprints 08-notas 11-business-model-canvas; do
  git merge mobile/$plan --no-ff -m "Merge: [$plan]"
done
git push origin main
```

### Fase 6 (Final)

```bash
git merge mobile/15-deployment --no-ff -m "Merge: [15] Deployment"
git push origin main
```

---

## Resolução de Conflitos

### Conflitos Esperados

| Arquivos | Resolução |
|----------|-----------|
| `navigation/stacks/*.tsx` | Substituir PlaceholderScreen pelas telas reais |
| `navigation/types.ts` | Já inclui todos os tipos - manter |
| `App.tsx` | Manter versão mais recente |
| `package.json` | Merge manual das dependências |

### Procedimento de Conflito

```bash
# Se houver conflito
git status  # Ver arquivos em conflito

# Para cada arquivo
# 1. Abrir e resolver manualmente
# 2. Ou usar a versão mais recente
git checkout --theirs <arquivo>  # Versão da branch sendo merged
git checkout --ours <arquivo>    # Versão da main

# Após resolver
git add <arquivos>
git commit -m "Resolve conflicts: [XX] description"
```

---

## Verificações Pós-Merge

Após cada fase, executar:

```bash
# 1. Instalar dependências
cd mobile && npm install

# 2. Verificar TypeScript
npm run typecheck

# 3. Verificar build
npx expo export --platform android

# 4. Testar no emulador
npx expo start --android
```

---

## Rollback

Se um merge causar problemas:

```bash
# Reverter último merge
git revert -m 1 HEAD

# Ou resetar para commit anterior (cuidado!)
git reset --hard <commit-anterior-ao-merge>
git push --force origin main  # APENAS se necessário
```

---

## Atualização de PlaceholderScreens

O Plano 03 cria PlaceholderScreens que devem ser substituídas pelos planos subsequentes.

### Padrão de Substituição

Cada plano deve:

1. **Importar** a tela real no arquivo de stack
2. **Substituir** `PlaceholderScreen` pelo componente
3. **Manter** as options de navegação

```typescript
// ANTES (Plano 03)
<Stack.Screen
  name="TasksList"
  component={PlaceholderScreen}
  options={{ title: 'Tarefas' }}
/>

// DEPOIS (Plano 06)
import { TasksListScreen } from '@/screens/tasks';

<Stack.Screen
  name="TasksList"
  component={TasksListScreen}
  options={{ title: 'Tarefas' }}
/>
```

---

## Checklist de Merge Final

- [ ] Todos os 15 planos merged
- [ ] Nenhum PlaceholderScreen restante
- [ ] TypeScript sem erros
- [ ] App compila e executa
- [ ] Todas as navegações funcionam
- [ ] Testes manuais passando
- [ ] Versão e versionCode configurados
- [ ] Pronto para build de produção
