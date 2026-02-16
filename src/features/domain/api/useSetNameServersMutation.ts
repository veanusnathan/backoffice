import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { getDisplayErrorMessage } from '~/lib/api-error';
import { useApiClient } from '~/providers/ApiClientProvider';

export interface SetNameServersPayload {
  domainId: string;
  nameServers: string[];
}

export function useSetNameServersMutation() {
  const { axiosWithToken } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SetNameServersPayload): Promise<void> => {
      const [nameServer1 = '', nameServer2 = ''] = payload.nameServers;
      await axiosWithToken.patch(`domains/${payload.domainId}/name-servers`, {
        nameServer1,
        nameServer2,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['domain', variables.domainId] });
      queryClient.invalidateQueries({ queryKey: ['domains'] });
      notifications.show({
        message: 'Name servers updated',
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
