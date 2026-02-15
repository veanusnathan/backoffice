import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { useApiClient } from '~/providers/ApiClientProvider';
import type { UserItem } from '../types';

interface CreatePayload {
  username: string;
  email: string;
  password: string;
  roleIds?: number[];
}

interface UpdatePayload {
  id: number;
  username?: string;
  email?: string;
  password?: string;
  roleIds?: number[];
}

export function useCreateUserMutation() {
  const { axiosWithToken } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreatePayload): Promise<UserItem> => {
      const { data } = await axiosWithToken.post<UserItem>('users', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      notifications.show({ message: 'User created', color: 'green' });
    },
    onError: (err: { response?: { data?: { errors?: string[] } } }) => {
      const errors = err?.response?.data?.errors ?? [];
      notifications.show({
        title: 'Create failed',
        message: errors.length ? errors.join(', ') : 'Could not create user',
        color: 'red',
      });
    },
  });
}

export function useUpdateUserMutation() {
  const { axiosWithToken } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...payload }: UpdatePayload): Promise<UserItem> => {
      const { data } = await axiosWithToken.patch<UserItem>(`users/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      notifications.show({ message: 'User updated', color: 'green' });
    },
    onError: (err: { response?: { data?: { errors?: string[] } } }) => {
      const errors = err?.response?.data?.errors ?? [];
      notifications.show({
        title: 'Update failed',
        message: errors.length ? errors.join(', ') : 'Could not update user',
        color: 'red',
      });
    },
  });
}

export function useDeleteUserMutation() {
  const { axiosWithToken } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      await axiosWithToken.delete(`users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      notifications.show({ message: 'User deleted', color: 'green' });
    },
    onError: (err: { response?: { data?: { errors?: string[] } } }) => {
      const errors = err?.response?.data?.errors ?? [];
      notifications.show({
        title: 'Delete failed',
        message: errors.length ? errors.join(', ') : 'Could not delete user',
        color: 'red',
      });
    },
  });
}
