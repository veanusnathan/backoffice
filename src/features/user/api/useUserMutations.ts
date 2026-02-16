import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { getDisplayErrorMessage } from '~/lib/api-error';
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
    onError: (err) => {
      notifications.show({
        title: 'Create failed',
        message: getDisplayErrorMessage(err),
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
    onError: (err) => {
      notifications.show({
        title: 'Update failed',
        message: getDisplayErrorMessage(err),
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
    onError: (err) => {
      notifications.show({
        title: 'Delete failed',
        message: getDisplayErrorMessage(err),
        color: 'red',
      });
    },
  });
}
