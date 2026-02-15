import { useQuery } from '@tanstack/react-query';
import type { Domain } from '../types';
import { useApiClient } from '~/providers/ApiClientProvider';

async function fetchDomain(
  get: (url: string) => Promise<Domain>,
  id: string,
): Promise<Domain | null> {
  const res = await get(`domains/${id}`);
  return res ?? null;
}

export function useGetDomainQuery(id: string | undefined) {
  const { axiosWithToken } = useApiClient();
  return useQuery({
    queryKey: ['domain', id],
    queryFn: () =>
      fetchDomain(
        (url) => axiosWithToken.get<Domain>(url).then((r) => r.data),
        id!,
      ),
    enabled: Boolean(id),
  });
}
