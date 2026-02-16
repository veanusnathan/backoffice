import type { Domain } from '../types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { getDisplayErrorMessage } from '~/lib/api-error';
import { useApiClient } from '~/providers/ApiClientProvider';

export type DomainCategoryValue = 'MS' | 'WP' | 'LP' | 'RTP' | 'Other' | null;

export interface UpdateDomainPayload {
  domainId: string;
  description?: string | null;
  category?: DomainCategoryValue;
  isUsed?: boolean;
  isDefense?: boolean;
  isLinkAlt?: boolean;
  groupId?: number | null;
}

function applyPayloadToDomain(domain: Domain, payload: UpdateDomainPayload): Domain {
  const { domainId: _, ...updates } = payload;
  return { ...domain, ...updates } as Domain;
}

export function useUpdateDomainMutation() {
  const { axiosWithToken } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateDomainPayload): Promise<void> => {
      const { domainId, ...body } = payload;
      await axiosWithToken.patch(`domains/${domainId}`, body);
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ['domain', variables.domainId] });
      const previous = queryClient.getQueryData<Domain>(['domain', variables.domainId]);
      queryClient.setQueryData<Domain>(['domain', variables.domainId], (old) =>
        old ? applyPayloadToDomain(old, variables) : old,
      );
      return { previous };
    },
    onError: (err, variables, context) => {
      if (context?.previous != null) {
        queryClient.setQueryData(['domain', variables.domainId], context.previous);
      }
      notifications.show({
        title: 'Update failed',
        message: getDisplayErrorMessage(err),
        color: 'red',
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['domain', variables.domainId] });
      queryClient.invalidateQueries({ queryKey: ['domains'] });
      queryClient.invalidateQueries({ queryKey: ['cpanel'] });
      notifications.show({
        message: 'Domain updated',
        color: 'green',
      });
    },
  });
}
