import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { getDisplayErrorMessage } from '~/lib/api-error';
import { useApiClient } from '~/providers/ApiClientProvider';

export interface CreateGroupPayload {
  name: string;
  description?: string;
}

export function useCreateGroupMutation() {
  const { axiosWithToken } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateGroupPayload) => {
      const { data } = await axiosWithToken.post<{ id: number; name: string; description: string | null }>(
        'domains/groups',
        payload,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['domain-groups'] });
      queryClient.invalidateQueries({ queryKey: ['domains'] });
      notifications.show({ message: 'Group created', color: 'green' });
    },
    onError: (err) => {
      notifications.show({
        title: 'Create failed',
        message: getDisplayErrorMessage(err),
        color: 'red',
      });
    },
  });
}
