import { useQuery } from '@tanstack/react-query';
import type { WhitelistedIp } from '../types';
import { useApiClient } from '~/providers/ApiClientProvider';

export function useWhitelistedIpsQuery() {
  const { axiosWithToken } = useApiClient();
  return useQuery({
    queryKey: ['whitelisted-ips'],
    queryFn: async (): Promise<WhitelistedIp[]> => {
      const { data } = await axiosWithToken.get<WhitelistedIp[]>('whitelisted-ips');
      return data;
    },
  });
}
