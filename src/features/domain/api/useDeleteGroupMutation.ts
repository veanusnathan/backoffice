import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { getDisplayErrorMessage } from '~/lib/api-error';
import { useApiClient } from '~/providers/ApiClientProvider';

export function useDeleteGroupMutation() {
  const { axiosWithToken } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await axiosWithToken.delete(`domains/groups/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['domain-groups'] });
      queryClient.invalidateQueries({ queryKey: ['domains'] });
      notifications.show({ message: 'Group deleted', color: 'green' });
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
