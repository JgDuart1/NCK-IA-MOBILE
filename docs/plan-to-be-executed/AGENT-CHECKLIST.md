# Checklist Universal para Agentes - NCK IA Mobile

Este documento é o checklist que **todo agente** deve seguir antes de considerar seu plano completo.

---

## Antes de Começar

- [ ] Li o `contracts.md` (fonte da verdade para tipos)
- [ ] Li o `LIBRARIES-REFERENCE.md` (bibliotecas aprovadas)
- [ ] Li o `dependencies.md` do meu plano
- [ ] Li o `dependencies.md` dos planos que consumo
- [ ] Estou no worktree correto (pasta dedicada do plano)
- [ ] Estou na branch correta: `mobile/XX-nome-plano`

---

## Durante o Desenvolvimento

### Código

- [ ] Não criei tipos duplicados - usei os de `@/types`
- [ ] Não instalei bibliotecas não aprovadas
- [ ] Usei `apiClient` existente, não criei novo
- [ ] Usei componentes UI do Plano 01 (`@/components/ui`)
- [ ] Usei `secureStorage` para tokens, `asyncStorage` para dados
- [ ] Segui nomenclatura: `kebab-case` para arquivos, `PascalCase` para componentes
- [ ] Não hardcodei cores - usei `darkTheme`
- [ ] Não hardcodei espaçamentos - usei `spacing`

### Estrutura

- [ ] Criei arquivos na pasta correta (`screens/`, `components/`, `hooks/`, `services/`)
- [ ] Criei `index.ts` com barrel exports
- [ ] Telas exportadas em `screens/nome-modulo/index.ts`
- [ ] Componentes exportados em `components/nome-modulo/index.ts`

### TypeScript

- [ ] Sem erros de TypeScript
- [ ] Sem `any` desnecessários (usar tipos de `contracts.md`)
- [ ] Props tipadas corretamente
- [ ] Retornos de hooks tipados

---

## Testes

- [ ] Executei `npm run typecheck` sem erros
- [ ] Testei manualmente cada tela
- [ ] Testei estados: loading, empty, error, success
- [ ] Testei em dispositivo/emulador Android

---

## Integração com Navegação

Se meu plano adiciona telas:

- [ ] Atualizei a Stack correspondente em `navigation/stacks/`
- [ ] Substituí `PlaceholderScreen` pelo componente real
- [ ] Mantive as `options` de navegação
- [ ] Verifiquei que navegação funciona de ida e volta

---

## Commits

- [ ] Mensagens seguem padrão: `[XX] descrição`
- [ ] Commits atômicos (uma mudança por commit)
- [ ] Não commitei arquivos de build/cache

---

## Antes de Finalizar

### Verificações Finais

- [ ] App abre sem crash
- [ ] Navegação para minha feature funciona
- [ ] Dados carregam da API corretamente
- [ ] Loading states aparecem
- [ ] Empty states aparecem quando não há dados
- [ ] Error states aparecem e permitem retry
- [ ] Pull to refresh funciona (se aplicável)

### Documentação

- [ ] Atualizei `dependencies.md` se adicionei exports
- [ ] Não deixei TODOs no código de produção
- [ ] Removi console.logs de debug

---

## Checklist por Tipo de Plano

### Se é Plano de Telas (04-14)

- [ ] Todas as telas do PRD implementadas
- [ ] Todas as user stories atendidas
- [ ] Componentes reutilizáveis criados
- [ ] API hooks com React Query
- [ ] Tratamento de erros em mutations

### Se é Plano Base (01-03)

- [ ] Exports documentados em dependencies.md
- [ ] Outros planos conseguem importar corretamente
- [ ] Sem dependências circulares

### Se é Plano de Deploy (15)

- [ ] Todos os assets criados
- [ ] app.json configurado
- [ ] eas.json configurado
- [ ] Build de preview funciona
- [ ] Build de produção funciona

---

## Problemas Comuns

### "Cannot find module '@/...'"

- Verificar tsconfig.json tem path alias configurado
- Verificar arquivo index.ts existe com export

### "Type 'X' is not assignable to type 'Y'"

- Usar tipos de contracts.md, não criar próprios
- Verificar se API retorna formato esperado

### "Network request failed"

- Verificar EXPO_PUBLIC_API_URL está configurado
- Verificar backend está rodando
- Verificar interceptors não estão falhando

### Navegação não funciona

- Verificar nome da tela está correto nos types
- Verificar params estão sendo passados
- Verificar tela está registrada na Stack

---

## Conclusão do Plano

Só considerar o plano **COMPLETO** quando:

1. ✅ Todos os itens do checklist de entrega do Spec marcados
2. ✅ Todos os testes manuais passando
3. ✅ TypeScript sem erros
4. ✅ App funciona end-to-end
5. ✅ Código commitado e pushado para branch

---

## Changelog

| Data | Alteração |
|------|-----------|
| 2026-02-05 | Documento inicial |
