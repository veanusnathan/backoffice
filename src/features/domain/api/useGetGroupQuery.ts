import { useQuery } from '@tanstack/react-query';
import { useApiClient } from '~/providers/ApiClientProvider';
import type { DomainGroup } from './useGetGroupsQuery';

export function useGetGroupQuery(id: number | string | undefined) {
  const { axiosWithToken } = useApiClient();
  const numId = typeof id === 'string' ? parseInt(id, 10) : id;
  return useQuery({
    queryKey: ['domain-group', id],
    queryFn: async (): Promise<DomainGroup> => {
      const { data } = await axiosWithToken.get<DomainGroup>(`domains/groups/${numId}`);
      return data;
    },
    enabled: numId != null && !isNaN(numId),
  });
}
