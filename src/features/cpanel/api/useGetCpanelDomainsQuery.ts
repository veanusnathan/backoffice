import { useQuery } from '@tanstack/react-query';
import type { DomainListResponse } from '../../domain/types';
import type {
  GetDomainsParams,
  DomainSortBy,
  DomainSortOrder,
  DomainStatusFilter,
} from '../../domain/api/useGetDomainsQuery';
import { useApiClient } from '~/providers/ApiClientProvider';

export type { GetDomainsParams, DomainSortBy, DomainSortOrder, DomainStatusFilter };

function buildQueryString(params: GetDomainsParams): string {
  const searchParams = new URLSearchParams();
  if (params.sortBy) searchParams.set('sortBy', params.sortBy);
  if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);
  if (params.search) searchParams.set('search', params.search);
  if (params.status && params.status !== 'all') searchParams.set('status', params.status);
  if (params.usedFilter) searchParams.set('usedFilter', params.usedFilter);
  if (params.page != null && params.page >= 1) searchParams.set('page', String(params.page));
  if (params.limit != null) searchParams.set('limit', String(params.limit));
  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

export function useGetCpanelDomainsQuery(
  cpanelId: number | string | null,
  params: GetDomainsParams = {},
) {
  const { axiosWithToken } = useApiClient();
  return useQuery({
    queryKey: ['cpanel', cpanelId, 'domains', params],
    queryFn: async (): Promise<DomainListResponse> => {
      const qs = buildQueryString(params);
      const { data } = await axiosWithToken.get<DomainListResponse>(`cpanel/${cpanelId}/domains${qs}`);
      return data;
    },
    enabled: cpanelId != null && cpanelId !== '',
  });
}
