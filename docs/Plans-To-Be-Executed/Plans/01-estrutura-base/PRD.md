# Plano 01: Estrutura Base - PRD

## Configuração do Agente

- **Modo**: Ralph-Loop
- **Branch**: `mobile/01-estrutura-base`
- **Timeout**: 2 horas
- **Arquivos de contexto**:
  - `../contracts.md`
  - `./dependencies.md`

---

## Objetivo

Criar a estrutura base do projeto mobile Expo/React Native com tema dark, cliente API configurado, providers globais e componentes UI fundamentais.

Este plano é a **fundação** de todos os demais. Nenhum outro plano pode iniciar antes deste estar completo.

---

## User Stories

### US-01: Setup do Projeto
**Como** desenvolvedor  
**Quero** um projeto Expo configurado corretamente  
**Para** poder desenvolver as features do app

**Critérios de Aceitação:**
- [ ] Projeto Expo SDK 52+ criado
- [ ] TypeScript configurado
- [ ] ESLint e Prettier configurados
- [ ] Estrutura de pastas organizada
- [ ] .gitignore adequado

### US-02: Tema Visual
**Como** usuário  
**Quero** um app com visual dark consistente  
**Para** ter uma experiência visual agradável

**Critérios de Aceitação:**
- [ ] Tema dark como padrão
- [ ] Cores conforme `contracts.md`
- [ ] Tipografia consistente
- [ ] Espaçamentos padronizados

### US-03: Componentes Base
**Como** desenvolvedor  
**Quero** componentes UI reutilizáveis  
**Para** manter consistência visual e acelerar desenvolvimento

**Critérios de Aceitação:**
- [ ] Button com variantes
- [ ] Input com label e erro
- [ ] Card, Avatar, Badge
- [ ] Skeleton, Modal, Toast
- [ ] LoadingScreen, EmptyState, ErrorState

### US-04: Cliente API
**Como** desenvolvedor  
**Quero** um cliente HTTP configurado  
**Para** consumir a API do backend

**Critérios de Aceitação:**
- [ ] Axios configurado com base URL
- [ ] Interceptor para injetar token
- [ ] Interceptor para refresh automático
- [ ] Tratamento de erros padronizado
- [ ] React Query configurado

### US-05: Providers Globais
**Como** desenvolvedor  
**Quero** providers configurados no app  
**Para** ter acesso a contextos globais

**Critérios de Aceitação:**
- [ ] ThemeProvider
- [ ] QueryClientProvider
- [ ] ToastProvider
- [ ] SafeAreaProvider

### US-06: Armazenamento Seguro
**Como** desenvolvedor  
**Quero** serviços de storage  
**Para** persistir dados localmente

**Critérios de Aceitação:**
- [ ] AsyncStorage para dados não sensíveis
- [ ] SecureStore para tokens
- [ ] Abstração de storage unificada

### US-07: Serviço de Anexos
**Como** desenvolvedor  
**Quero** um serviço para upload/download de arquivos  
**Para** que outros planos possam usar

**Critérios de Aceitação:**
- [ ] Upload de imagens
- [ ] Upload de documentos
- [ ] Download de anexos
- [ ] Visualização inline de imagens

---

## Casos de Uso

### UC-01: Inicialização do App
1. App inicia
2. Carrega fontes customizadas
3. Inicializa providers
4. Verifica token no SecureStore
5. Redireciona para Login ou Dashboard

### UC-02: Requisição API com Token Expirado
1. Usuário faz ação que requer API
2. API retorna 401 (token expirado)
3. Interceptor tenta refresh
4. Se sucesso: repete requisição original
5. Se falha: redireciona para login

### UC-03: Upload de Anexo
1. Usuário seleciona arquivo/imagem
2. App exibe preview (se imagem)
3. App faz upload para API
4. API retorna URL do anexo
5. App atualiza estado local

---

## Requisitos Não-Funcionais

| Requisito | Métrica |
|-----------|---------|
| Tempo de cold start | < 3 segundos |
| Tamanho do bundle | < 50 MB |
| Compatibilidade | Android 8+ (API 26+) |
| Acessibilidade | Labels em todos os componentes |

---

## Fora do Escopo

- Telas de autenticação (Plano 02)
- Navegação entre telas (Plano 03)
- Qualquer feature de negócio
- Notificações push (Plano 10)

---

## Dependências Externas

| Pacote | Versão | Propósito |
|--------|--------|-----------|
| expo | ~52.x | Framework base |
| axios | ^1.x | Cliente HTTP |
| @tanstack/react-query | ^5.x | Cache e estado servidor |
| zustand | ^4.x | Estado global |
| expo-secure-store | ~13.x | Armazenamento seguro |
| @react-native-async-storage/async-storage | ^1.x | Armazenamento local |
| expo-image-picker | ~15.x | Seleção de imagens |
| expo-document-picker | ~12.x | Seleção de documentos |
| expo-file-system | ~17.x | Sistema de arquivos |
| react-native-safe-area-context | ^4.x | Safe area |
| react-native-toast-message | ^2.x | Toasts |

---

## Métricas de Sucesso

1. Projeto compila sem erros
2. App abre no emulador/dispositivo
3. Todos os componentes renderizam corretamente
4. Cliente API faz requisições com sucesso
5. Storage salva e recupera dados
