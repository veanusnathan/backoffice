import { useQueries } from '@tanstack/react-query';
import { Anchor, Flex, Loader, Paper, Stack, Text, Title } from '@mantine/core';
import { Link } from 'react-router-dom';
import { useApiClient } from '~/providers/ApiClientProvider';
import { useGetGroupsQuery } from '~/features/domain/api/useGetGroupsQuery';
import type { Domain, DomainListResponse } from '~/features/domain/types';

const MAX_ITEMS = 5;

function DomainItem({ domain }: { domain: Domain }) {
  return (
    <Anchor component={Link} to={`/domain/${domain.id}`} size="sm" sx={{ display: 'block' }}>
      {domain.name}
    </Anchor>
  );
}

function SubSection({
  label,
  domains,
  total,
}: {
  label: string;
  domains: Domain[];
  total: number;
}) {
  const show = domains.slice(0, MAX_ITEMS);
  const moreCount = total > MAX_ITEMS ? total - MAX_ITEMS : 0;

  return (
    <Stack spacing={4}>
      <Text size="sm" weight={600} color="dimmed">
        {label}
      </Text>
      {show.length === 0 ? (
        <Text size="xs" color="dimmed">
          None
        </Text>
      ) : (
        <>
          <Stack spacing={2}>
            {show.map((d) => (
              <DomainItem key={d.id} domain={d} />
            ))}
          </Stack>
          {moreCount > 0 && (
            <Text size="xs" color="dimmed">
              and {moreCount} more —{' '}
              <Anchor component={Link} to="/domain" size="xs">
                view all
              </Anchor>
            </Text>
          )}
        </>
      )}
    </Stack>
  );
}

function GroupSection({
  title,
  description,
  defenseDomains,
  defenseTotal,
  linkAltDomains,
  linkAltTotal,
}: {
  title: string;
  description?: string | null;
  defenseDomains: Domain[];
  defenseTotal: number;
  linkAltDomains: Domain[];
  linkAltTotal: number;
}) {
  return (
    <Paper p="lg" shadow="sm" radius="md" withBorder>
      <Title order={5} mb={4}>
        {title}
      </Title>
      {description && (
        <Text size="xs" color="dimmed" mb="md" lineClamp={2}>
          {description}
        </Text>
      )}
      <Stack spacing="md">
        <SubSection
          label="Domain defense"
          domains={defenseDomains}
          total={defenseTotal}
        />
        <SubSection
          label="Domain link alt"
          domains={linkAltDomains}
          total={linkAltTotal}
        />
      </Stack>
    </Paper>
  );
}

export function Dashboard() {
  const { axiosWithToken } = useApiClient();
  const { data: groups, isLoading: loadingGroups } = useGetGroupsQuery();

  const queries = useQueries({
    queries: (groups ?? []).flatMap((g) => [
      {
        queryKey: ['domains', { groupId: g.id, isDefense: true }],
        queryFn: async (): Promise<DomainListResponse> => {
          const { data } = await axiosWithToken.get<DomainListResponse>(
            `domains?groupId=${g.id}&isDefense=true&limit=10&page=1`,
          );
          return data;
        },
        enabled: (groups?.length ?? 0) > 0,
      },
      {
        queryKey: ['domains', { groupId: g.id, isLinkAlt: true }],
        queryFn: async (): Promise<DomainListResponse> => {
          const { data } = await axiosWithToken.get<DomainListResponse>(
            `domains?groupId=${g.id}&isLinkAlt=true&limit=10&page=1`,
          );
          return data;
        },
        enabled: (groups?.length ?? 0) > 0,
      },
    ]),
  });

  const loading = loadingGroups || queries.some((q) => q.isLoading);

  if (loading) {
    return (
      <Flex justify="center" py="xl">
        <Loader size="lg" />
      </Flex>
    );
  }

  return (
    <Stack spacing="lg">
      <Title order={4}>Home</Title>
      <Flex gap="md" wrap="wrap" direction={{ base: 'column', sm: 'row' }}>
        {(groups ?? []).map((group, i) => {
          const defenseRes = queries[i * 2]?.data;
          const linkAltRes = queries[i * 2 + 1]?.data;
          return (
            <GroupSection
              key={group.id}
              title={group.name}
              description={group.description}
              defenseDomains={defenseRes?.data ?? []}
              defenseTotal={defenseRes?.meta?.total ?? 0}
              linkAltDomains={linkAltRes?.data ?? []}
              linkAltTotal={linkAltRes?.meta?.total ?? 0}
            />
          );
        })}
      </Flex>
    </Stack>
  );
}
