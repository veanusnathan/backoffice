import { useQuery } from '@tanstack/react-query';
import { useApiClient } from '~/providers/ApiClientProvider';

export interface SyncMetadata {
  lastDomainSync: string | null;
  lastNameServerRefresh: string | null;
  lastNawalaCheck: string | null;
}

export function useGetSyncMetadataQuery() {
  const { axiosWithToken } = useApiClient();
  return useQuery({
    queryKey: ['domains', 'sync-metadata'],
    queryFn: async (): Promise<SyncMetadata> => {
      const { data } = await axiosWithToken.get<SyncMetadata>('domains/sync-metadata');
      return data;
    },
    refetchInterval: 60_000, // Poll every 60s so timestamps update when workers run
  });
}
