import { useQuery } from '@tanstack/react-query';
import type { DomainListResponse } from '../types';
import { useApiClient } from '~/providers/ApiClientProvider';

export type DomainSortBy = 'name' | 'expiryDate' | 'created' | 'status';
export type DomainSortOrder = 'asc' | 'desc';
export type DomainStatusFilter = 'all' | 'expired' | 'needsRenewal' | 'active';
export type DomainUsedFilter = 'used' | 'notUsed' | 'all';
export type DomainNawalaFilter = 'all' | 'blocked' | 'notBlocked';

export interface GetDomainsParams {
  sortBy?: DomainSortBy;
  sortOrder?: DomainSortOrder;
  search?: string;
  status?: DomainStatusFilter;
  usedFilter?: DomainUsedFilter;
  nawalaFilter?: DomainNawalaFilter;
  page?: number;
  limit?: 10 | 50 | 100;
  unlinkedOnly?: boolean;
}

function buildQueryString(params: GetDomainsParams): string {
  const searchParams = new URLSearchParams();
  if (params.sortBy) searchParams.set('sortBy', params.sortBy);
  if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);
  if (params.search) searchParams.set('search', params.search);
  if (params.status && params.status !== 'all') searchParams.set('status', params.status);
  if (params.usedFilter) searchParams.set('usedFilter', params.usedFilter);
  if (params.nawalaFilter && params.nawalaFilter !== 'all') searchParams.set('nawalaFilter', params.nawalaFilter);
  if (params.page != null && params.page >= 1) searchParams.set('page', String(params.page));
  if (params.limit != null) searchParams.set('limit', String(params.limit));
  if (params.unlinkedOnly) searchParams.set('unlinkedOnly', 'true');
  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

export function useGetDomainsQuery(params: GetDomainsParams = {}) {
  const { axiosWithToken } = useApiClient();
  return useQuery({
    queryKey: ['domains', params],
    queryFn: async (): Promise<DomainListResponse> => {
      const qs = buildQueryString(params);
      const { data } = await axiosWithToken.get<DomainListResponse>(`domains${qs}`);
      return data;
    },
  });
}
