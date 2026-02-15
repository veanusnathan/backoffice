import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { useApiClient } from '~/providers/ApiClientProvider';
import type { Domain } from '../types';

export function useRenewDomainMutation() {
  const { axiosWithToken } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      domainId,
      years,
    }: {
      domainId: string;
      years: number;
    }): Promise<Domain> => {
      const res = await axiosWithToken.post<Domain>(`domains/${domainId}/renew`, {
        years,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['domains'] });
      notifications.show({
        message: 'Domain renewed successfully',
        color: 'green',
      });
    },
    onError: (err: { message?: string }) => {
      notifications.show({
        title: 'Renew failed',
        message: err?.message ?? 'Could not renew domain',
        color: 'red',
      });
    },
  });
}
