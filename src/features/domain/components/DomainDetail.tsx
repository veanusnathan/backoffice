import { useEffect, useState } from 'react';
import { Alert, Anchor, Button, Checkbox, Group, Loader, Paper, Select, Stack, Switch, Textarea, Title } from '@mantine/core';
import {
  DataDisplayContainer,
  DataDisplayTitle,
  DataDisplayValue,
} from '~/components/core/DataDisplay';
import { useNavigate } from 'react-router-dom';
import { getDisplayErrorMessage } from '~/lib/api-error';
import { useGetDomainQuery } from '../api/useGetDomainQuery';
import { useGetGroupsQuery } from '../api/useGetGroupsQuery';
import { useUpdateDomainMutation, type DomainCategoryValue } from '../api/useUpdateDomainMutation';
import { GantiNameServerForm } from './GantiNameServerForm';

const CATEGORY_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: '–' },
  { value: 'MS', label: 'MS' },
  { value: 'WP', label: 'WP' },
  { value: 'LP', label: 'LP' },
  { value: 'RTP', label: 'RTP' },
  { value: 'Other', label: 'Other' },
];

interface DomainDetailProps {
  domainId: string;
}

export function DomainDetail({ domainId }: DomainDetailProps) {
  const { data: domain, isLoading, error } = useGetDomainQuery(domainId);
  const { data: groups } = useGetGroupsQuery();
  const updateMutation = useUpdateDomainMutation();
  const navigate = useNavigate();
  const [descriptionValue, setDescriptionValue] = useState<string>('');
  useEffect(() => {
    if (domain) setDescriptionValue(domain.description ?? '');
  }, [domain?.id, domain?.description]);

  const groupOptions = [
    { value: '', label: '–' },
    ...(groups ?? []).map((g) => ({ value: String(g.id), label: g.name })),
  ];

  if (isLoading) {
    return (
      <Paper p="lg">
        <Loader size="lg" />
      </Paper>
    );
  }

  if (error || !domain) {
    return (
      <Paper p="lg">
        <Alert color="red" title="Error">
          {error ? getDisplayErrorMessage(error) : 'Domain tidak ditemukan atau gagal dimuat.'}
        </Alert>
      </Paper>
    );
  }

  const handleCategoryChange = (value: string | null) => {
    const category: DomainCategoryValue = (value === '' || value == null) ? null : (value as DomainCategoryValue);
    updateMutation.mutate({ domainId: domain.id, category });
  };

  const handleUsedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateMutation.mutate({ domainId: domain.id, isUsed: event.currentTarget.checked });
  };

  const handleIsDefenseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateMutation.mutate({ domainId: domain.id, isDefense: event.currentTarget.checked });
  };

  const handleIsLinkAltChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateMutation.mutate({ domainId: domain.id, isLinkAlt: event.currentTarget.checked });
  };

  const handleGroupChange = (value: string | null) => {
    const groupId = value === '' || value == null ? null : parseInt(value, 10);
    if (isNaN(groupId)) return;
    updateMutation.mutate({ domainId: domain.id, groupId });
  };

  return (
    <Stack spacing="lg">
      <Paper p="lg">
        <Stack spacing="md">
          <DataDisplayContainer>
            <DataDisplayTitle>Domain Name</DataDisplayTitle>
            <DataDisplayValue>{domain.name}</DataDisplayValue>
          </DataDisplayContainer>
          <DataDisplayContainer>
            <DataDisplayTitle>Expiry Date</DataDisplayTitle>
            <DataDisplayValue>{domain.expires}</DataDisplayValue>
          </DataDisplayContainer>
          <DataDisplayContainer>
            <DataDisplayTitle>Description</DataDisplayTitle>
            <DataDisplayValue>
              <Stack spacing="xs">
                <Textarea
                  minRows={2}
                  placeholder="Add description..."
                  value={descriptionValue}
                  onChange={(e) => setDescriptionValue(e.currentTarget.value)}
                  disabled={updateMutation.isPending}
                />
                <Group>
                  <Button
                    size="xs"
                    onClick={() => {
                      const trimmed = descriptionValue.trim() || null;
                      if (trimmed !== (domain.description ?? null)) {
                        updateMutation.mutate({ domainId: domain.id, description: trimmed });
                      }
                    }}
                    loading={updateMutation.isPending}
                  >
                    Save description
                  </Button>
                </Group>
              </Stack>
            </DataDisplayValue>
          </DataDisplayContainer>
          <DataDisplayContainer>
            <DataDisplayTitle>Category</DataDisplayTitle>
            <DataDisplayValue>
              <Select
                size="sm"
                data={CATEGORY_OPTIONS}
                value={domain.category ?? ''}
                onChange={handleCategoryChange}
                disabled={updateMutation.isPending}
                sx={{ maxWidth: 160 }}
              />
            </DataDisplayValue>
          </DataDisplayContainer>
          <DataDisplayContainer>
            <DataDisplayTitle>Group</DataDisplayTitle>
            <DataDisplayValue>
              <Select
                size="sm"
                data={groupOptions}
                value={domain.group ? String(domain.group.id) : ''}
                onChange={handleGroupChange}
                disabled={updateMutation.isPending}
                sx={{ maxWidth: 200 }}
              />
            </DataDisplayValue>
          </DataDisplayContainer>
          <DataDisplayContainer>
            <DataDisplayTitle>Mark domain used</DataDisplayTitle>
            <DataDisplayValue>
              <Switch
                label={domain.isUsed ? 'Used' : 'Not used'}
                checked={domain.isUsed ?? false}
                onChange={handleUsedChange}
                disabled={updateMutation.isPending}
              />
            </DataDisplayValue>
          </DataDisplayContainer>
          <DataDisplayContainer>
            <DataDisplayValue>
              <Checkbox
                label="Is domain defense"
                checked={domain.isDefense ?? false}
                onChange={handleIsDefenseChange}
                disabled={updateMutation.isPending}
              />
            </DataDisplayValue>
          </DataDisplayContainer>
          <DataDisplayContainer>
            <DataDisplayValue>
              <Checkbox
                label="Is domain link alt"
                checked={domain.isLinkAlt ?? false}
                onChange={handleIsLinkAltChange}
                disabled={updateMutation.isPending}
              />
            </DataDisplayValue>
          </DataDisplayContainer>
          <DataDisplayContainer>
            <DataDisplayTitle>Name Servers (saat ini)</DataDisplayTitle>
            <DataDisplayValue>
              {domain.nameServers?.length
                ? domain.nameServers.join(', ')
                : '–'}
            </DataDisplayValue>
          </DataDisplayContainer>
          <DataDisplayContainer>
            <DataDisplayTitle>Linked cPanel</DataDisplayTitle>
            <DataDisplayValue>
              {domain.cpanel ? (
                <Anchor
                  component="button"
                  type="button"
                  onClick={() => navigate(`/domain/cpanel/${domain.cpanel!.id}`)}
                >
                  {domain.cpanel.username} ({domain.cpanel.ipServer})
                  {domain.cpanel.mainDomain && ` · ${domain.cpanel.mainDomain}`}
                </Anchor>
              ) : (
                '–'
              )}
            </DataDisplayValue>
          </DataDisplayContainer>
        </Stack>
      </Paper>

      <Paper p="lg">
        <Title order={5} mb="md">
          Ganti Name Server
        </Title>
        <GantiNameServerForm domain={domain} />
      </Paper>
    </Stack>
  );
}
