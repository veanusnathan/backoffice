import { Box, Flex, Loader, Table } from '@mantine/core';
import type { Domain } from '../types';
import { DomainTableRow } from './DomainTableRow';

interface DomainTableProps {
  domains: Domain[];
  isLoading: boolean;
  onNavigateToDetail: (id: string) => void;
  onReactivate?: (domain: Domain) => void;
  onRenew?: (domain: Domain) => void;
  onUnlink?: (domain: Domain) => void;
}

export function DomainTable({
  domains,
  isLoading,
  onNavigateToDetail,
  onReactivate,
  onRenew,
  onUnlink,
}: DomainTableProps) {
  const rows = domains.map((domain) => (
    <DomainTableRow
      key={domain.id}
      domain={domain}
      onNavigateToDetail={onNavigateToDetail}
      onReactivate={onReactivate}
      onRenew={onRenew}
      onUnlink={onUnlink}
    />
  ));

  return (
    <Box py={30}>
      <Table verticalSpacing="md" highlightOnHover>
        <thead style={{ backgroundColor: '#00C48F' }}>
          <tr>
            <th style={{ color: 'white', whiteSpace: 'nowrap' }}>Domain Name</th>
            <th style={{ color: 'white', whiteSpace: 'nowrap' }}>Category</th>
            <th style={{ color: 'white', whiteSpace: 'nowrap' }}>Status Domain</th>
            <th style={{ color: 'white', whiteSpace: 'nowrap' }}>Nawala</th>
            <th style={{ color: 'white', whiteSpace: 'nowrap' }}>Used</th>
            <th style={{ color: 'white', whiteSpace: 'nowrap' }}>Expiry Date</th>
            <th style={{ color: 'white', whiteSpace: 'nowrap' }}>Description</th>
            <th style={{ color: 'white', whiteSpace: 'nowrap' }}>Name Server</th>
            <th style={{ color: 'white', whiteSpace: 'nowrap' }}></th>
          </tr>
        </thead>
        {isLoading ? (
          <tbody>
            <tr>
              <td colSpan={9}>
                <Flex justify="center" py="xl">
                  <Loader size="lg" />
                </Flex>
              </td>
            </tr>
          </tbody>
        ) : !domains.length ? (
          <tbody>
            <tr>
              <td colSpan={9}>
                <Flex justify="center" py="xl">
                  Data Not Found
                </Flex>
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>{rows}</tbody>
        )}
      </Table>
    </Box>
  );
}
