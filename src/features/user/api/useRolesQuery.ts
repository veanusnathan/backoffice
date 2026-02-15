import { useQuery } from '@tanstack/react-query';
import type { RoleItem } from '../types';
import { useApiClient } from '~/providers/ApiClientProvider';

export function useRolesQuery() {
  const { axiosWithToken } = useApiClient();
  return useQuery({
    queryKey: ['roles'],
    queryFn: async (): Promise<RoleItem[]> => {
      const { data } = await axiosWithToken.get<RoleItem[]>('roles');
      return data;
    },
  });
}
