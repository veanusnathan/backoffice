import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { getDisplayErrorMessage } from '~/lib/api-error';
import { useApiClient } from '~/providers/ApiClientProvider';

export interface UpdateDomainUsedPayload {
  domainId: string;
  isUsed: boolean;
}

export function useUpdateDomainUsedMutation() {
  const { axiosWithToken } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateDomainUsedPayload): Promise<void> => {
      await axiosWithToken.patch(`domains/${payload.domainId}`, {
        isUsed: payload.isUsed,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['domain', variables.domainId] });
      queryClient.invalidateQueries({ queryKey: ['domains'] });
      queryClient.invalidateQueries({ queryKey: ['cpanel'] });
      notifications.show({
        message: variables.isUsed ? 'Marked as used' : 'Marked as not used',
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
