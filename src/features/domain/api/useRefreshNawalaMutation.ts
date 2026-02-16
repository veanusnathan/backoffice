import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { getDisplayErrorMessage } from '~/lib/api-error';
import { useApiClient } from '~/providers/ApiClientProvider';

interface RefreshNawalaResult {
  checked: number;
  updated: number;
}

export function useRefreshNawalaMutation() {
  const { axiosWithToken } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<RefreshNawalaResult> => {
      const res = await axiosWithToken.post<RefreshNawalaResult>('domains/refresh-nawala');
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['domains'] });
      queryClient.invalidateQueries({ queryKey: ['domains', 'sync-metadata'] });
      notifications.show({
        message: `Nawala check: ${data.checked} checked, ${data.updated} updated`,
        color: 'green',
      });
    },
    onError: (err: { message?: string; response?: { data?: { errors?: string[] } } }) => {
      const msg = getDisplayErrorMessage(err);
      notifications.show({
        title: 'Nawala check failed',
        message: msg,
        color: 'red',
        autoClose: 8000,
      });
    },
  });
}
