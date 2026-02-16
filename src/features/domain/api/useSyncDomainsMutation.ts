import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { getDisplayErrorMessage } from '~/lib/api-error';
import { useApiClient } from '~/providers/ApiClientProvider';

interface SyncResult {
  added: number;
  updated: number;
  nsUpdated: number;
}

export function useSyncDomainsMutation() {
  const { axiosWithToken } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<SyncResult> => {
      const res = await axiosWithToken.post<SyncResult>('domains/sync');
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['domains'] });
      queryClient.invalidateQueries({ queryKey: ['domains', 'sync-metadata'] });
      notifications.show({
        message: `Domain sync: ${data.added} added, ${data.updated} updated, ${data.nsUpdated} NS refreshed`,
        color: 'green',
      });
    },
    onError: (err) => {
      notifications.show({
        title: 'Sync failed',
        message: getDisplayErrorMessage(err),
        color: 'red',
      });
    },
  });
}
