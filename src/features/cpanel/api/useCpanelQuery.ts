import { useQuery } from '@tanstack/react-query';
import type { CpanelItem } from '../types';
import { useApiClient } from '~/providers/ApiClientProvider';

export function useCpanelQuery() {
  const { axiosWithToken } = useApiClient();
  return useQuery({
    queryKey: ['cpanel'],
    queryFn: async (): Promise<CpanelItem[]> => {
      const { data } = await axiosWithToken.get<CpanelItem[]>('cpanel');
      return data;
    },
  });
}
