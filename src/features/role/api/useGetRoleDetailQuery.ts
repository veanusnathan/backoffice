import { useQuery } from '@tanstack/react-query';
import type { RoleDetailWithUsers } from '~/features/user/types';
import { useApiClient } from '~/providers/ApiClientProvider';

export function useGetRoleDetailQuery(roleId: string | null) {
  const { axiosWithToken } = useApiClient();
  const id = roleId ? parseInt(roleId, 10) : null;

  return useQuery({
    queryKey: ['roles', id, 'detail'],
    queryFn: async (): Promise<RoleDetailWithUsers> => {
      const { data } = await axiosWithToken.get<RoleDetailWithUsers>(
        `roles/${id}?withUsers=true`,
      );
      return data;
    },
    enabled: id != null && !isNaN(id),
  });
}
