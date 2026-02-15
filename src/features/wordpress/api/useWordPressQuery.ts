import { useQuery } from '@tanstack/react-query';
import type { WordPressItem } from '../types';
import { useApiClient } from '~/providers/ApiClientProvider';

export function useWordPressQuery() {
  const { axiosWithToken } = useApiClient();
  return useQuery({
    queryKey: ['wordpress'],
    queryFn: async (): Promise<WordPressItem[]> => {
      const { data } = await axiosWithToken.get<WordPressItem[]>('wordpress');
      return data;
    },
  });
}
