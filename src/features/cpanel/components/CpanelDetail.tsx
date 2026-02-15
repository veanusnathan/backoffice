import { useState, useCallback, useEffect } from 'react';
import {
  Loader,
  Paper,
  Stack,
  Text,
  TextInput,
  Select,
  Group,
  Button,
  Flex,
  ActionIcon,
  Tooltip,
  Modal,
  Pagination,
} from '@mantine/core';
import { IconArrowLeft, IconLink, IconLogin, IconX } from '@tabler/icons-react';
import { openCpanelLogin } from '../utils/cpanelLogin';
import { useNavigate } from 'react-router-dom';
import { useGetCpanelDetailQuery } from '../api/useGetCpanelDetailQuery';
import {
  useUpdateCpanelMutation,
} from '../api/useCpanelMutations';
import { useGetCpanelDomainsQuery } from '../api/useGetCpanelDomainsQuery';
import {
  useGetDomainsQuery,
} from '../../domain/api/useGetDomainsQuery';
import type {
  GetDomainsParams,
  DomainSortBy,
  DomainSortOrder,
  DomainStatusFilter,
} from '../../domain/api/useGetDomainsQuery';
import { useLinkDomainToCpanelMutation } from '../../domain/api/useLinkDomainToCpanelMutation';
import { useReactivateDomainMutation } from '../../domain/api/useReactivateDomainMutation';
import { useRenewDomainMutation } from '../../domain/api/useRenewDomainMutation';
import { DomainTable } from '../../domain/components/DomainTable';
import type { Domain } from '../../domain/types';
import { PAGE_SIZE_OPTIONS } from '../../domain/types';

const STATUS_OPTIONS = [
  { value: 'Full', label: 'Full' },
  { value: 'Available', label: 'Available' },
];

const SORT_OPTIONS: { value: DomainSortBy; label: string }[] = [
  { value: 'name', label: 'Domain Name' },
  { value: 'expiryDate', label: 'Expiry Date' },
  { value: 'created', label: 'Created Date' },
  { value: 'status', label: 'Status (Expired first)' },
];

const STATUS_FILTER_OPTIONS: { value: DomainStatusFilter; label: string }[] = [
  { value: 'all', label: 'All Domains' },
  { value: 'expired', label: 'Expired' },
  { value: 'needsRenewal', label: 'Needs Renewal (≤7 days)' },
  { value: 'active', label: 'Active' },
];

const PAGE_SIZE_OPTIONS_DATA = PAGE_SIZE_OPTIONS.map((n) => ({
  value: String(n),
  label: `${n} per page`,
}));

interface CpanelDetailProps {
  cpanelId: string;
}

export function CpanelDetail({ cpanelId }: CpanelDetailProps) {
  const navigate = useNavigate();
  const id = parseInt(cpanelId, 10);
  const { data: cpanel, isLoading } = useGetCpanelDetailQuery(id);
  const updateMutation = useUpdateCpanelMutation();

  const [params, setParams] = useState<GetDomainsParams>({
    sortBy: 'name',
    sortOrder: 'asc',
    search: '',
    status: 'all',
    page: 1,
    limit: 10,
  });
  const [searchInput, setSearchInput] = useState('');
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkSearch, setLinkSearch] = useState('');
  const [linkParams, setLinkParams] = useState<GetDomainsParams>({
    sortBy: 'name',
    sortOrder: 'asc',
    search: '',
    unlinkedOnly: true,
    page: 1,
    limit: 10,
  });

  const { data: domainsData, isLoading: domainsLoading } = useGetCpanelDomainsQuery(
    isNaN(id) ? null : id,
    params,
  );
  const { data: unlinkedData } = useGetDomainsQuery(linkParams);
  const linkMutation = useLinkDomainToCpanelMutation();
  const reactivateMutation = useReactivateDomainMutation();
  const renewMutation = useRenewDomainMutation();

  const domains = domainsData?.data ?? [];
  const meta = domainsData?.meta;
  const unlinkedDomains = unlinkedData?.data ?? [];

  const handleSearch = useCallback(() => {
    setParams((p) => ({
      ...p,
      search: searchInput.trim() || undefined,
      page: 1,
    }));
  }, [searchInput]);

  const handleClearSearch = useCallback(() => {
    setSearchInput('');
    setParams((p) => ({ ...p, search: undefined, page: 1 }));
  }, []);

  const handleSortChange = useCallback(
    (field: keyof GetDomainsParams, value: string | null) => {
      if (!value) return;
      setParams((p) => {
        const next = { ...p, page: 1 };
        if (field === 'sortBy') next.sortBy = value as DomainSortBy;
        if (field === 'sortOrder') next.sortOrder = value as DomainSortOrder;
        if (field === 'status') next.status = value as DomainStatusFilter;
        if (field === 'limit') next.limit = Number(value) as 10 | 50 | 100;
        return next;
      });
    },
    [],
  );

  const handlePageChange = useCallback((page: number) => {
    setParams((p) => ({ ...p, page }));
  }, []);

  const handleReactivate = useCallback((domain: Domain) => {
    reactivateMutation.mutate(domain.id);
  }, [reactivateMutation]);

  const handleRenew = useCallback((domain: Domain) => {
    renewMutation.mutate({ domainId: domain.id, years: 1 });
  }, [renewMutation]);

  const handleUnlink = useCallback(
    (domain: Domain) => {
      linkMutation.mutate({
        domainId: domain.id,
        cpanelId: null,
      });
    },
    [linkMutation],
  );

  const handleLink = useCallback(
    (domain: Domain) => {
      linkMutation.mutate(
        {
          domainId: domain.id,
          cpanelId: id,
        },
        {
          onSuccess: () => setLinkModalOpen(false),
        },
      );
    },
    [linkMutation, id],
  );

  const handleLinkSearch = useCallback(() => {
    setLinkParams((p) => ({
      ...p,
      search: linkSearch.trim() || undefined,
      page: 1,
    }));
  }, [linkSearch]);

  const [form, setForm] = useState({
    package: '',
    mainDomain: '',
    email: '',
    nameServer: '',
    status: '',
  });

  useEffect(() => {
    if (cpanel) {
      setForm({
        package: cpanel.package ?? '',
        mainDomain: cpanel.mainDomain ?? '',
        email: cpanel.email ?? '',
        nameServer: cpanel.nameServer ?? '',
        status: cpanel.status ?? '',
      });
    }
  }, [cpanel]);

  if (isLoading || !cpanel) {
    return (
      <Paper p="lg">
        <Loader size="lg" />
      </Paper>
    );
  }

  const handleFormChange = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSaveForm = () => {
    updateMutation.mutate({
      id: cpanel.id,
      package: form.package || undefined,
      mainDomain: form.mainDomain || undefined,
      email: form.email || undefined,
      nameServer: form.nameServer || undefined,
      status: form.status || undefined,
    });
  };

  const formDirty =
    form.package !== (cpanel.package ?? '') ||
    form.mainDomain !== (cpanel.mainDomain ?? '') ||
    form.email !== (cpanel.email ?? '') ||
    form.nameServer !== (cpanel.nameServer ?? '') ||
    form.status !== (cpanel.status ?? '');

  return (
    <Stack spacing="lg">
      <Paper p="lg">
        <Group position="apart" mb="md">
          <Group spacing="xs">
            <ActionIcon
              variant="subtle"
              onClick={() => navigate('/domain/cpanel')}
              size="lg"
            >
              <IconArrowLeft size={20} />
            </ActionIcon>
            <Text weight={600} size="lg">
              CPanel Detail
            </Text>
          </Group>
          {cpanel && (
            <Button
              leftIcon={<IconLogin size={18} />}
              variant="light"
              color="teal"
              onClick={() =>
                openCpanelLogin(cpanel.username, cpanel.password)
              }
            >
              Login to cPanel
            </Button>
          )}
        </Group>

        <Stack spacing="sm">
          <TextInput
            label="Package"
            value={form.package}
            onChange={(e) => handleFormChange('package', e.target.value)}
            placeholder="Enter package"
          />
          <TextInput
            label="Main Domain"
            value={form.mainDomain}
            onChange={(e) => handleFormChange('mainDomain', e.target.value)}
            placeholder="Enter main domain"
          />
          <TextInput
            label="Email"
            value={form.email}
            onChange={(e) => handleFormChange('email', e.target.value)}
            placeholder="Enter email"
          />
          <TextInput
            label="Name Server"
            value={form.nameServer}
            onChange={(e) => handleFormChange('nameServer', e.target.value)}
            placeholder="Enter name server"
          />
          <Select
            label="Status"
            data={STATUS_OPTIONS}
            value={form.status || null}
            onChange={(v) => handleFormChange('status', v ?? '')}
            placeholder="Full / Available"
          />
          {formDirty && (
            <Button onClick={handleSaveForm} loading={updateMutation.isPending}>
              Save
            </Button>
          )}
        </Stack>
      </Paper>

      <Paper p="lg">
        <Stack spacing="md">
          <Flex
            align="flex-end"
            gap="xs"
            wrap="wrap"
            sx={{
              minWidth: 0,
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              alignItems: 'end',
              gap: 'var(--mantine-spacing-xs)',
            }}
          >
            <Flex align="flex-end" gap="xs" wrap="wrap" sx={{ minWidth: 0 }}>
              <TextInput
                placeholder="Search domains..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.currentTarget.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                size="xs"
                styles={{ root: { minWidth: 140, maxWidth: 180 } }}
              />
              <Button variant="light" size="xs" onClick={handleSearch}>
                Search
              </Button>
              <Tooltip label="Clear search" withArrow>
                <ActionIcon
                  size="sm"
                  variant="subtle"
                  color="gray"
                  onClick={handleClearSearch}
                  sx={{
                    opacity: params.search || searchInput ? 1 : 0,
                    pointerEvents: params.search || searchInput ? 'auto' : 'none',
                  }}
                >
                  <IconX size={16} />
                </ActionIcon>
              </Tooltip>
              <Select
                label="Status"
                size="xs"
                data={STATUS_FILTER_OPTIONS}
                value={params.status ?? 'all'}
                onChange={(v) => handleSortChange('status', v ?? 'all')}
                styles={{ root: { minWidth: 100 } }}
              />
              <Select
                label="Sort by"
                size="xs"
                data={SORT_OPTIONS}
                value={params.sortBy ?? 'name'}
                onChange={(v) => handleSortChange('sortBy', v ?? 'name')}
                styles={{ root: { minWidth: 100 } }}
              />
              <Select
                label="Order"
                size="xs"
                data={[
                  { value: 'asc', label: 'Asc' },
                  { value: 'desc', label: 'Desc' },
                ]}
                value={params.sortOrder ?? 'asc'}
                onChange={(v) => handleSortChange('sortOrder', v ?? 'asc')}
                styles={{ root: { minWidth: 72 } }}
              />
              <Select
                label="Per page"
                size="xs"
                data={PAGE_SIZE_OPTIONS_DATA}
                value={String(params.limit ?? 10)}
                onChange={(v) => handleSortChange('limit', v ?? '10')}
                styles={{ root: { minWidth: 80 } }}
              />
            </Flex>
            <Flex align="flex-end" gap="xs" sx={{ flexShrink: 0 }}>
              <Button
                size="sm"
                variant="light"
                leftIcon={<IconLink size={16} />}
                onClick={() => setLinkModalOpen(true)}
              >
                Link Domain
              </Button>
            </Flex>
          </Flex>
          {(params.search || meta) && (
            <Text size="sm" c="dimmed">
              {meta
                ? `Showing ${(meta.page - 1) * meta.limit + 1}-${Math.min(meta.page * meta.limit, meta.total)} of ${meta.total}`
                : `${domains.length} result(s)`}
              {params.search && ` for "${params.search}"`}
            </Text>
          )}
        </Stack>

        <DomainTable
          domains={domains}
          isLoading={domainsLoading}
          onNavigateToDetail={(domainId) => navigate(`/domain/${domainId}`)}
          onReactivate={handleReactivate}
          onRenew={handleRenew}
          onUnlink={handleUnlink}
        />

        {meta && meta.totalPages > 1 && (
          <Flex justify="center" py="md">
            <Pagination
              value={meta.page}
              onChange={handlePageChange}
              total={meta.totalPages}
              size="sm"
              radius="md"
              withEdges
            />
          </Flex>
        )}
      </Paper>

      <Modal
        opened={linkModalOpen}
        onClose={() => setLinkModalOpen(false)}
        title="Link Domain to CPanel"
        size="lg"
      >
        <Stack>
          <Flex gap="xs">
            <TextInput
              placeholder="Search unlinked domains..."
              value={linkSearch}
              onChange={(e) => setLinkSearch(e.currentTarget.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLinkSearch()}
              style={{ flex: 1 }}
            />
            <Button variant="light" onClick={handleLinkSearch}>
              Search
            </Button>
          </Flex>
          <Paper withBorder p="sm" style={{ maxHeight: 300, overflow: 'auto' }}>
            {unlinkedDomains.length === 0 ? (
              <Text c="dimmed">No unlinked domains found.</Text>
            ) : (
              unlinkedDomains.map((d) => (
                <Flex
                  key={d.id}
                  justify="space-between"
                  align="center"
                  py="xs"
                  sx={{ borderBottom: '1px solid var(--mantine-color-gray-2)' }}
                >
                  <Text size="sm">{d.name}</Text>
                  <Button size="xs" variant="light" onClick={() => handleLink(d)}>
                    Link
                  </Button>
                </Flex>
              ))
            )}
          </Paper>
        </Stack>
      </Modal>
    </Stack>
  );
}
