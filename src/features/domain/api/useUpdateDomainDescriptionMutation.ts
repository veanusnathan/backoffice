import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { getDisplayErrorMessage } from '~/lib/api-error';
import { useApiClient } from '~/providers/ApiClientProvider';

export interface UpdateDomainDescriptionPayload {
  domainId: string;
  description: string | null;
}

export function useUpdateDomainDescriptionMutation() {
  const { axiosWithToken } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateDomainDescriptionPayload): Promise<void> => {
      await axiosWithToken.patch(`domains/${payload.domainId}`, {
        description: payload.description || null,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['domain', variables.domainId] });
      queryClient.invalidateQueries({ queryKey: ['domains'] });
      notifications.show({
        message: 'Description updated',
        color: 'green',
      });
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
