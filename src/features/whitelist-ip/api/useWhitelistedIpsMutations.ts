import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { getDisplayErrorMessage } from '~/lib/api-error';
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
    onError: (err) => {
      notifications.show({
        title: 'Add failed',
        message: getDisplayErrorMessage(err),
        color: 'red',
      });
    },
  });
}

interface UpdatePayload {
  id: number;
  ip?: string;
  description?: string | null;
}

export function useUpdateWhitelistedIpMutation() {
  const { axiosWithToken } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdatePayload): Promise<WhitelistedIp> => {
      const { id, ...body } = payload;
      const { data } = await axiosWithToken.patch<WhitelistedIp>(`whitelisted-ips/${id}`, body);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whitelisted-ips'] });
      notifications.show({ message: 'IP updated', color: 'green' });
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
    onError: (err) => {
      notifications.show({
        title: 'Delete failed',
        message: getDisplayErrorMessage(err),
        color: 'red',
      });
    },
  });
}
