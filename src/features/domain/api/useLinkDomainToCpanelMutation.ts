import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { useApiClient } from '~/providers/ApiClientProvider';

interface LinkPayload {
  domainId: string;
  cpanelId: number | null;
}

export function useLinkDomainToCpanelMutation() {
  const { axiosWithToken } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ domainId, cpanelId }: LinkPayload): Promise<void> => {
      await axiosWithToken.patch(`domains/${domainId}`, { cpanelId });
    },
    onSuccess: (_, { cpanelId }) => {
      queryClient.invalidateQueries({ queryKey: ['domains'] });
      if (cpanelId != null) {
        queryClient.invalidateQueries({ queryKey: ['cpanel', cpanelId, 'domains'] });
      }
      queryClient.invalidateQueries({ queryKey: ['cpanel'] });
      notifications.show({
        message: cpanelId != null ? 'Domain linked to CPanel' : 'Domain unlinked',
        color: 'green',
      });
    },
    onError: (err: { message?: string }) => {
      notifications.show({
        title: 'Failed',
        message: err?.message ?? 'Could not update domain link',
        color: 'red',
      });
    },
  });
}
