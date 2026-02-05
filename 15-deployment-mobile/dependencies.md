# Plano 15: Deployment Mobile - Dependencies

## O Que Este Plano Provê

Este plano não provê código, mas sim a configuração e processo para publicar o app.

### Outputs

| Output | Descrição |
|--------|-----------|
| Build AAB | Android App Bundle para Play Store |
| Build APK | APK para testes internos |
| Configuração EAS | eas.json configurado |
| Assets de Store | Ícones, screenshots, descrições |
| Documentação | Guia de publicação |

---

## O Que Este Plano Consome

### De TODOS os Planos (01-14)

Este plano só pode ser executado após **todos** os planos anteriores estarem completos:

| Plano | Requisito |
|-------|-----------|
| 01 | Projeto Expo configurado |
| 02 | Autenticação funcionando |
| 03 | Navegação completa |
| 04 | Dashboard implementado |
| 05 | Projetos implementados |
| 06 | Tarefas e Kanban |
| 07 | Sprints |
| 08 | Notas |
| 09 | Calendário |
| 10 | Notificações e Push |
| 11 | Business Canvas |
| 12 | Caverna do Dragão |
| 13 | Usuários e Perfil |
| 14 | Configurações |

### Assets Necessários

| Asset | Plano de Origem |
|-------|-----------------|
| icon.png | Manual/Design |
| splash.png | Manual/Design |
| adaptive-icon.png | Manual/Design |
| notification-icon.png | Manual/Design |

---

## Planos Dependentes

**Nenhum** - Este é o plano final.

---

## Contratos

### Versioning

```
version: MAJOR.MINOR.PATCH
versionCode: INTEGER (sempre incrementar)

Exemplo:
1.0.0 (versionCode: 1)
1.0.1 (versionCode: 2)
1.1.0 (versionCode: 3)
2.0.0 (versionCode: 4)
```

### Package Name

```
com.nckia.mobile
```

Não pode ser alterado após publicação.

### Signing Key

A chave de assinatura é gerenciada pelo EAS. Para builds manuais:

```bash
# EAS gerencia automaticamente
eas credentials

# Ou configurar manualmente
keytool -genkey -v -keystore nckia-release.keystore \
  -alias nckia -keyalg RSA -keysize 2048 -validity 10000
```

---

## Timeline de Execução

```
Dia 1: Preparação de assets e configuração
Dia 2: Build de produção e testes
Dia 3-16: Closed testing (14 dias para contas pessoais)
Dia 17-19: Review Google Play
Dia 20: Publicação

OU (conta organizacional):
Dia 1-2: Preparação e build
Dia 3-5: Testes internos
Dia 6-8: Review Google Play
Dia 9: Publicação
```

---

## Troubleshooting

### Build Falha

```bash
# Limpar cache
eas build --clear-cache --platform android

# Ver logs detalhados
eas build --platform android --local
```

### Push Notifications Não Funcionam

1. Verificar google-services.json
2. Verificar permissões no app.json
3. Verificar registro do token no backend

### Submissão Rejeitada

- Verificar política de privacidade
- Verificar descrição do app
- Verificar screenshots (sem mock data visível)
- Verificar classificação de conteúdo
