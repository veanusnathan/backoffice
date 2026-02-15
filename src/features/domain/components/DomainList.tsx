import { useRef, useState, useCallback } from 'react';
import {
  ActionIcon,
  Flex,
  Loader,
  Paper,
  TextInput,
  Select,
  Text,
  Pagination,
  Tooltip,
} from '@mantine/core';
import {
  IconRefresh,
  IconSearch,
  IconShieldCheck,
  IconUpload,
  IconX,
} from '@tabler/icons-react';
import { useGetDomainsQuery } from '../api/useGetDomainsQuery';
import type {
  GetDomainsParams,
  DomainSortBy,
  DomainSortOrder,
  DomainStatusFilter,
  DomainUsedFilter,
  DomainNawalaFilter,
} from '../api/useGetDomainsQuery';
import { useSyncDomainsMutation } from '../api/useSyncDomainsMutation';
import { useRefreshNawalaMutation } from '../api/useRefreshNawalaMutation';
import { useBulkMarkUsedMutation } from '../api/useBulkMarkUsedMutation';
import { useGetSyncMetadataQuery } from '../api/useGetSyncMetadataQuery';
import { useReactivateDomainMutation } from '../api/useReactivateDomainMutation';
import { useRenewDomainMutation } from '../api/useRenewDomainMutation';
import { DomainTable } from './DomainTable';
import type { Domain } from '../types';
import { PAGE_SIZE_OPTIONS } from '../types';

interface DomainListProps {
  onNavigateToDetail: (id: string) => void;
}

const SORT_OPTIONS: { value: DomainSortBy; label: string }[] = [
  { value: 'name', label: 'Name' },
  { value: 'expiryDate', label: 'Expiry' },
  { value: 'created', label: 'Created' },
  { value: 'status', label: 'Status' },
];

const STATUS_OPTIONS: { value: DomainStatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'expired', label: 'Expired' },
  { value: 'needsRenewal', label: '≤7 days' },
  { value: 'active', label: 'Active' },
];

const USED_FILTER_OPTIONS: { value: DomainUsedFilter; label: string }[] = [
  { value: 'used', label: 'Used' },
  { value: 'notUsed', label: 'Not Used' },
  { value: 'all', label: 'All' },
];

const NAWALA_FILTER_OPTIONS: { value: DomainNawalaFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'blocked', label: 'Blocked' },
  { value: 'notBlocked', label: 'Not blocked' },
];

const PAGE_SIZE_OPTIONS_DATA = PAGE_SIZE_OPTIONS.map((n) => ({
  value: String(n),
  label: String(n),
}));

const SORT_ORDER_OPTIONS = [
  { value: 'asc', label: 'Ascending' },
  { value: 'desc', label: 'Descending' },
] as const;

/** Prevents wrapping in Select trigger and dropdown options */
const selectNoWrapStyles = {
  input: { whiteSpace: 'nowrap' as const },
  dropdown: { minWidth: 'max-content' },
  item: { whiteSpace: 'nowrap' as const },
};

/** Compact width for filter Selects - applied to both root and wrapper so the visible box actually shrinks */
function selectWidthStyles(width: number) {
  return {
    ...selectNoWrapStyles,
    root: { width: width, minWidth: width, maxWidth: width },
    wrapper: { width: width, minWidth: width, maxWidth: width },
  };
}

export function DomainList({ onNavigateToDetail }: DomainListProps) {
  const [params, setParams] = useState<GetDomainsParams>({
    sortBy: 'name',
    sortOrder: 'asc',
    search: '',
    status: 'all',
    usedFilter: 'used',
    nawalaFilter: 'all',
    page: 1,
    limit: 10,
  });
  const [searchInput, setSearchInput] = useState('');

  const { data, isLoading } = useGetDomainsQuery(params);
  const domains = data?.data ?? [];
  const meta = data?.meta;
  const syncMutation = useSyncDomainsMutation();
  const refreshNawalaMutation = useRefreshNawalaMutation();
  const bulkMarkUsedMutation = useBulkMarkUsedMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: syncMeta } = useGetSyncMetadataQuery();

  const formatLastSync = (iso: string | null) =>
    iso ? new Date(iso).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' }) : 'Never';

  const reactivateMutation = useReactivateDomainMutation();
  const renewMutation = useRenewDomainMutation();

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
        if (field === 'usedFilter') next.usedFilter = value as DomainUsedFilter;
        if (field === 'nawalaFilter') next.nawalaFilter = value as DomainNawalaFilter;
        if (field === 'limit') next.limit = Number(value) as 10 | 50 | 100;
        return next;
      });
    },
    [],
  );

  const handlePageChange = useCallback((page: number) => {
    setParams((p) => ({ ...p, page }));
  }, []);

  const handleReactivate = (domain: Domain) => {
    reactivateMutation.mutate(domain.id);
  };

  const handleRenew = (domain: Domain) => {
    renewMutation.mutate({ domainId: domain.id, years: 1 });
  };

  const handleBulkMarkUsedClick = () => fileInputRef.current?.click();
  const handleBulkMarkUsedFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      bulkMarkUsedMutation.mutate(file);
      e.target.value = '';
    }
  };

  return (
    <Paper p="lg">
      <Flex
        align="center"
        gap="md"
        wrap="wrap"
        sx={{ minWidth: 0, '& > *': { flexShrink: 0 } }}
      >
        {/* Search */}
        <Flex align="center" gap="xs">
          <TextInput
            placeholder="Search..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.currentTarget.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            size="sm"
            styles={{ root: { width: 140 }, input: { whiteSpace: 'nowrap' } }}
          />
          <Tooltip label="Search" withArrow>
            <ActionIcon size="md" variant="light" onClick={handleSearch}>
              <IconSearch size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Clear" withArrow>
            <ActionIcon
              size="md"
              variant="subtle"
              color="gray"
              onClick={handleClearSearch}
              sx={{ opacity: params.search || searchInput ? 1 : 0.4, pointerEvents: 'auto' }}
            >
              <IconX size={16} />
            </ActionIcon>
          </Tooltip>
        </Flex>

        {/* Filters: Status, Used, Nawala - fixed compact width on root + wrapper so the box actually shrinks */}
        <Flex align="center" gap="sm" sx={{ borderLeft: '1px solid var(--mantine-color-gray-3)', pl: 'sm' }}>
          <Select
            size="sm"
            placeholder="Status"
            data={STATUS_OPTIONS}
            value={params.status ?? 'all'}
            onChange={(v) => handleSortChange('status', v ?? 'all')}
            styles={selectWidthStyles(112)}
          />
          <Select
            size="sm"
            placeholder="Used"
            data={USED_FILTER_OPTIONS}
            value={params.usedFilter ?? 'used'}
            onChange={(v) => handleSortChange('usedFilter', v ?? 'used')}
            styles={selectWidthStyles(122)}
          />
          <Select
            size="sm"
            placeholder="Nawala"
            data={NAWALA_FILTER_OPTIONS}
            value={params.nawalaFilter ?? 'all'}
            onChange={(v) => handleSortChange('nawalaFilter', v ?? 'all')}
            styles={selectWidthStyles(138)}
          />
        </Flex>

        {/* Sort: Sort by, Order */}
        <Flex align="center" gap="sm" sx={{ borderLeft: '1px solid var(--mantine-color-gray-3)', pl: 'sm' }}>
          <Select
            size="sm"
            placeholder="Sort by"
            data={SORT_OPTIONS}
            value={params.sortBy ?? 'name'}
            onChange={(v) => handleSortChange('sortBy', v ?? 'name')}
            styles={selectWidthStyles(112)}
          />
          <Select
            size="sm"
            placeholder="Order"
            data={SORT_ORDER_OPTIONS}
            value={params.sortOrder ?? 'asc'}
            onChange={(v) => handleSortChange('sortOrder', v ?? 'asc')}
            styles={selectWidthStyles(138)}
          />
        </Flex>

        {/* Per page */}
        <Flex align="center" gap="sm" sx={{ borderLeft: '1px solid var(--mantine-color-gray-3)', pl: 'sm' }}>
          <Select
            size="sm"
            data={PAGE_SIZE_OPTIONS_DATA}
            value={String(params.limit ?? 10)}
            onChange={(v) => handleSortChange('limit', v ?? '10')}
            styles={selectWidthStyles(80)}
          />
        </Flex>

        {/* Actions */}
        <Flex gap="xs" ml="sm" sx={{ borderLeft: '1px solid var(--mantine-color-gray-3)', paddingLeft: 'var(--mantine-spacing-sm)' }}>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,text/plain"
            onChange={handleBulkMarkUsedFileChange}
            style={{ display: 'none' }}
          />
          <Tooltip label="Upload .txt to mark domains as used (one per line)" withArrow>
            <ActionIcon
              size="md"
              variant="light"
              color="gray"
              disabled={bulkMarkUsedMutation.isPending}
              onClick={handleBulkMarkUsedClick}
            >
              {bulkMarkUsedMutation.isPending ? <Loader size="sm" /> : <IconUpload size={16} />}
            </ActionIcon>
          </Tooltip>
          <Tooltip
            label={`Domain Sync (Namecheap+NS) · ${formatLastSync(syncMeta?.lastDomainSync ?? null)}`}
            withArrow
          >
            <ActionIcon
              size="md"
              variant="light"
              color="green"
              disabled={syncMutation.isPending}
              onClick={() => syncMutation.mutate()}
            >
              {syncMutation.isPending ? <Loader size="sm" /> : <IconRefresh size={16} />}
            </ActionIcon>
          </Tooltip>
          <Tooltip
            label={`Nawala (Trust Positif). Only domains marked as Used are checked. Last: ${formatLastSync(syncMeta?.lastNawalaCheck ?? null)}`}
            withArrow
          >
            <ActionIcon
              size="md"
              variant="light"
              color="blue"
              disabled={refreshNawalaMutation.isPending}
              onClick={() => refreshNawalaMutation.mutate()}
            >
              {refreshNawalaMutation.isPending ? <Loader size="sm" /> : <IconShieldCheck size={16} />}
            </ActionIcon>
          </Tooltip>
        </Flex>
        {meta != null && (
          <Text size="sm" c="dimmed" ml="auto">
            {meta.total > 0
              ? `${(meta.page - 1) * meta.limit + 1}-${Math.min(meta.page * meta.limit, meta.total)} of ${meta.total}`
              : '0'}
          </Text>
        )}
      </Flex>
      <DomainTable
        domains={domains}
        isLoading={isLoading}
        onNavigateToDetail={onNavigateToDetail}
        onReactivate={handleReactivate}
        onRenew={handleRenew}
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
  );
}
