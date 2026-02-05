# Relatorio de Merge Plan-13-usuarios-perfil

Data: 2026-02-05
Branch: mobile/13-usuarios-perfil
Status: pronto para merge

Resumo do merge
- Adicionadas telas de perfil, edicao de perfil, alteracao de senha, convites e convites pendentes.
- Criados componentes reutilizaveis de perfil e hooks de API.
- Integracao das telas no MoreStack.

Arquivos principais
- mobile/src/screens/profile/ProfileScreen.tsx
- mobile/src/screens/profile/EditProfileScreen.tsx
- mobile/src/screens/profile/ChangePasswordScreen.tsx
- mobile/src/screens/profile/InviteUserScreen.tsx
- mobile/src/screens/profile/PendingInvitesScreen.tsx
- mobile/src/components/profile/AvatarPicker.tsx
- mobile/src/components/profile/RoleSelector.tsx
- mobile/src/components/profile/InviteCard.tsx
- mobile/src/components/profile/InviteStatusBadge.tsx
- mobile/src/hooks/use-profile.ts
- mobile/src/hooks/use-invites.ts
- mobile/src/services/api/users.api.ts
- mobile/src/navigation/stacks/MoreStack.tsx

Checklist
- Planos 01-03 completos e merged na main
- Telas substituídas no MoreStack
- Hooks com React Query
- API seguindo contracts.md

Testes e verificacoes
- npm run typecheck (falhou: tsc nao encontrado no ambiente)

Observacoes
- Sem dependencias novas.
