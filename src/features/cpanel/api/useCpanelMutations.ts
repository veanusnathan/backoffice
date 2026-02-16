import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { getDisplayErrorMessage } from '~/lib/api-error';
import { useApiClient } from '~/providers/ApiClientProvider';
import type { CpanelItem } from '../types';

interface CreatePayload {
  ipServer: string;
  username: string;
  password: string;
  package?: string;
  mainDomain?: string;
  email?: string;
  nameServer?: string;
  status?: string;
}

interface UpdatePayload {
  id: number;
  ipServer?: string;
  username?: string;
  password?: string;
  package?: string;
  mainDomain?: string;
  email?: string;
  nameServer?: string;
  status?: string;
}

export function useCreateCpanelMutation() {
  const { axiosWithToken } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreatePayload): Promise<CpanelItem> => {
      const { data } = await axiosWithToken.post<CpanelItem>('cpanel', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cpanel'] });
      notifications.show({ message: 'CPanel data created', color: 'green' });
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

export function useUpdateCpanelMutation() {
  const { axiosWithToken } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...payload }: UpdatePayload): Promise<CpanelItem> => {
      const { data } = await axiosWithToken.patch<CpanelItem>(`cpanel/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cpanel'] });
      notifications.show({ message: 'CPanel data updated', color: 'green' });
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

export function useDeleteCpanelMutation() {
  const { axiosWithToken } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      await axiosWithToken.delete(`cpanel/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cpanel'] });
      notifications.show({ message: 'CPanel data deleted', color: 'green' });
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
