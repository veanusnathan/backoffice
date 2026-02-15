import { Alert, Anchor, Loader, Paper, Stack, Title } from '@mantine/core';
import {
  DataDisplayContainer,
  DataDisplayTitle,
  DataDisplayValue,
} from '~/components/core/DataDisplay';
import { useNavigate } from 'react-router-dom';
import { useGetDomainQuery } from '../api/useGetDomainQuery';
import { GantiNameServerForm } from './GantiNameServerForm';

interface DomainDetailProps {
  domainId: string;
}

export function DomainDetail({ domainId }: DomainDetailProps) {
  const { data: domain, isLoading, error } = useGetDomainQuery(domainId);
  const navigate = useNavigate();

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
          Domain tidak ditemukan atau gagal dimuat.
        </Alert>
      </Paper>
    );
  }

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
            <DataDisplayValue>{domain.description ?? '–'}</DataDisplayValue>
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
