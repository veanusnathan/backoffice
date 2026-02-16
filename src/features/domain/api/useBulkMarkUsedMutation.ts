import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { getDisplayErrorMessage } from '~/lib/api-error';
import { useApiClient } from '~/providers/ApiClientProvider';

interface BulkMarkUsedResult {
  matched: number;
  updated: number;
}

export function useBulkMarkUsedMutation() {
  const { axiosWithToken } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File): Promise<BulkMarkUsedResult> => {
      const formData = new FormData();
      formData.append('file', file);
      const res = await axiosWithToken.post<BulkMarkUsedResult>('domains/bulk-mark-used', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['domains'] });
      notifications.show({
        message: `Bulk mark used: ${data.matched} matched, ${data.updated} updated`,
        color: 'green',
      });
    },
    onError: (err: { message?: string; response?: { data?: { errors?: string[] } } }) => {
      const msg = getDisplayErrorMessage(err);
      notifications.show({
        title: 'Bulk mark used failed',
        message: msg,
        color: 'red',
        autoClose: 8000,
      });
    },
  });
}
