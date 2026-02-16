import { useQuery } from '@tanstack/react-query';
import { useApiClient } from '~/providers/ApiClientProvider';

export interface DomainGroup {
  id: number;
  name: string;
  description: string | null;
}

export function useGetGroupsQuery() {
  const { axiosWithToken } = useApiClient();
  return useQuery({
    queryKey: ['domain-groups'],
    queryFn: async (): Promise<DomainGroup[]> => {
      const { data } = await axiosWithToken.get<DomainGroup[]>('domains/groups');
      return data;
    },
  });
}
