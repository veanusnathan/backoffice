import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { getDisplayErrorMessage } from '~/lib/api-error';
import { useApiClient } from '~/providers/ApiClientProvider';

export interface UpdateGroupPayload {
  id: number;
  name?: string;
  description?: string;
}

export function useUpdateGroupMutation() {
  const { axiosWithToken } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateGroupPayload) => {
      const { id, ...body } = payload;
      const { data } = await axiosWithToken.patch<{ id: number; name: string; description: string | null }>(
        `domains/groups/${id}`,
        body,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['domain-groups'] });
      queryClient.invalidateQueries({ queryKey: ['domains'] });
      queryClient.invalidateQueries({ queryKey: ['domain'] });
      notifications.show({ message: 'Group updated', color: 'green' });
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
