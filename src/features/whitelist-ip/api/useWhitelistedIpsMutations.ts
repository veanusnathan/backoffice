import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { useApiClient } from '~/providers/ApiClientProvider';
import type { WhitelistedIp } from '../types';

interface CreatePayload {
  ip: string;
  description?: string;
}

export function useCreateWhitelistedIpMutation() {
  const { axiosWithToken } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreatePayload): Promise<WhitelistedIp> => {
      const { data } = await axiosWithToken.post<WhitelistedIp>('whitelisted-ips', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whitelisted-ips'] });
      notifications.show({ message: 'IP whitelisted', color: 'green' });
    },
    onError: (err: { message?: string }) => {
      notifications.show({
        title: 'Add failed',
        message: err?.message ?? 'Could not add IP',
        color: 'red',
      });
    },
  });
}

export function useDeleteWhitelistedIpMutation() {
  const { axiosWithToken } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      await axiosWithToken.delete(`whitelisted-ips/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whitelisted-ips'] });
      notifications.show({ message: 'IP removed from whitelist', color: 'green' });
    },
    onError: (err: { message?: string }) => {
      notifications.show({
        title: 'Delete failed',
        message: err?.message ?? 'Could not remove IP',
        color: 'red',
      });
    },
  });
}
