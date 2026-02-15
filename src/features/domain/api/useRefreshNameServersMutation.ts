import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { useApiClient } from '~/providers/ApiClientProvider';

interface RefreshNsResult {
  updated: number;
}

export function useRefreshNameServersMutation() {
  const { axiosWithToken } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<RefreshNsResult> => {
      const res = await axiosWithToken.post<RefreshNsResult>('domains/refresh-ns');
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['domains'] });
      queryClient.invalidateQueries({ queryKey: ['domain'] });
      queryClient.invalidateQueries({ queryKey: ['domains', 'sync-metadata'] });
      notifications.show({
        message: `Name servers refreshed: ${data.updated} domains updated`,
        color: 'green',
      });
    },
    onError: (err: { message?: string }) => {
      notifications.show({
        title: 'Refresh failed',
        message: err?.message ?? 'Could not refresh name servers',
        color: 'red',
      });
    },
  });
}
