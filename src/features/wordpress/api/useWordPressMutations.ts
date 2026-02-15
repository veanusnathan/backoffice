import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { useApiClient } from '~/providers/ApiClientProvider';
import type { WordPressItem } from '../types';

interface CreatePayload {
  domain: string;
  username: string;
  password: string;
}

interface UpdatePayload {
  id: number;
  domain: string;
  username: string;
  password?: string;
}

export function useCreateWordPressMutation() {
  const { axiosWithToken } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreatePayload): Promise<WordPressItem> => {
      const { data } = await axiosWithToken.post<WordPressItem>('wordpress', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wordpress'] });
      notifications.show({ message: 'WordPress data created', color: 'green' });
    },
    onError: (err: { message?: string }) => {
      notifications.show({
        title: 'Create failed',
        message: err?.message ?? 'Could not create WordPress data',
        color: 'red',
      });
    },
  });
}

export function useUpdateWordPressMutation() {
  const { axiosWithToken } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...payload }: UpdatePayload): Promise<WordPressItem> => {
      const { data } = await axiosWithToken.patch<WordPressItem>(`wordpress/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wordpress'] });
      notifications.show({ message: 'WordPress data updated', color: 'green' });
    },
    onError: (err: { message?: string }) => {
      notifications.show({
        title: 'Update failed',
        message: err?.message ?? 'Could not update WordPress data',
        color: 'red',
      });
    },
  });
}

export function useDeleteWordPressMutation() {
  const { axiosWithToken } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      await axiosWithToken.delete(`wordpress/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wordpress'] });
      notifications.show({ message: 'WordPress data deleted', color: 'green' });
    },
    onError: (err: { message?: string }) => {
      notifications.show({
        title: 'Delete failed',
        message: err?.message ?? 'Could not delete WordPress data',
        color: 'red',
      });
    },
  });
}
