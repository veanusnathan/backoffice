import { useQuery } from '@tanstack/react-query';
import type { UserItem } from '../types';
import { useApiClient } from '~/providers/ApiClientProvider';

export function useUsersQuery() {
  const { axiosWithToken } = useApiClient();
  return useQuery({
    queryKey: ['users'],
    queryFn: async (): Promise<UserItem[]> => {
      const { data } = await axiosWithToken.get<UserItem[]>('users');
      return data;
    },
  });
}
