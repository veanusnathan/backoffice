import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { useApiClient } from '~/providers/ApiClientProvider';
import type { Domain } from '../types';

export function useReactivateDomainMutation() {
  const { axiosWithToken } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (domainId: string): Promise<Domain> => {
      const res = await axiosWithToken.post<Domain>(`domains/${domainId}/reactivate`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['domains'] });
      notifications.show({
        message: 'Domain reactivation requested successfully',
        color: 'green',
      });
    },
    onError: (err: { message?: string }) => {
      notifications.show({
        title: 'Reactivate failed',
        message: err?.message ?? 'Could not reactivate domain',
        color: 'red',
      });
    },
  });
}
