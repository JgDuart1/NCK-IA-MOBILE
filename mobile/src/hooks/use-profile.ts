import { useMutation } from '@tanstack/react-query';
import { usersApi } from '@/services/api/users.api';
import { useAuth } from './use-auth';

export function useUpdateProfile() {
  const { refreshUser } = useAuth();

  return useMutation({
    mutationFn: usersApi.updateProfile,
    onSuccess: () => {
      refreshUser();
    },
  });
}

export function useUploadAvatar() {
  const { refreshUser } = useAuth();

  return useMutation({
    mutationFn: usersApi.uploadAvatar,
    onSuccess: () => {
      refreshUser();
    },
  });
}

export function useRemoveAvatar() {
  const { refreshUser } = useAuth();

  return useMutation({
    mutationFn: usersApi.removeAvatar,
    onSuccess: () => {
      refreshUser();
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: usersApi.changePassword,
  });
}
