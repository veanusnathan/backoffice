import { useQuery } from '@tanstack/react-query';
import type { CpanelItem } from '../types';
import { useApiClient } from '~/providers/ApiClientProvider';

export function useGetCpanelDetailQuery(id: number | string | null) {
  const { axiosWithToken } = useApiClient();
  return useQuery({
    queryKey: ['cpanel', id],
    queryFn: async (): Promise<CpanelItem> => {
      const { data } = await axiosWithToken.get<CpanelItem>(`cpanel/${id}`);
      return data;
    },
    enabled: id != null && id !== '',
  });
}
