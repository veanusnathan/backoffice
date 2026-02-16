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

  const headerBg = '#00C48F';
  const thStyle = { color: 'white', whiteSpace: 'nowrap' as const, paddingLeft: 10, paddingRight: 10 };
  const stickyThLeft = {
    position: 'sticky' as const,
    left: 0,
    zIndex: 3,
    backgroundColor: headerBg,
    boxShadow: '2px 0 4px -2px rgba(0,0,0,0.15)',
  };
  const stickyThRight = {
    position: 'sticky' as const,
    right: 0,
    zIndex: 3,
    backgroundColor: headerBg,
    boxShadow: '-2px 0 4px -2px rgba(0,0,0,0.15)',
  };
  const colWidthsPct = {
    name: '14%',
    category: '7%',
    group: '10%',
    status: '5%',
    nawala: '5%',
    isDefense: '6%',
    isLinkAlt: '6%',
    expiry: '7%',
    nameServer: '16%',
    actions: '14%',
  };
  const tableMinWidth = 1100;

  return (
    <Box py={30} sx={{ overflowX: 'auto', minWidth: 0 }}>
      <Table verticalSpacing="md" highlightOnHover sx={{ tableLayout: 'fixed', width: '100%', minWidth: tableMinWidth }}>
        <colgroup>
          <col style={{ width: colWidthsPct.name }} />
          <col style={{ width: colWidthsPct.category }} />
          <col style={{ width: colWidthsPct.group }} />
          <col style={{ width: colWidthsPct.status }} />
          <col style={{ width: colWidthsPct.nawala }} />
          <col style={{ width: colWidthsPct.isDefense }} />
          <col style={{ width: colWidthsPct.isLinkAlt }} />
          <col style={{ width: colWidthsPct.expiry }} />
          <col style={{ width: colWidthsPct.nameServer }} />
          <col style={{ width: colWidthsPct.actions }} />
        </colgroup>
        <thead style={{ backgroundColor: headerBg }}>
          <tr>
            <th style={{ ...thStyle, ...stickyThLeft, width: colWidthsPct.name }}>Domain Name</th>
            <th style={{ ...thStyle, width: colWidthsPct.category }}>Category</th>
            <th style={{ ...thStyle, width: colWidthsPct.group }}>Group</th>
            <th style={{ ...thStyle, width: colWidthsPct.status }}>Status</th>
            <th style={{ ...thStyle, width: colWidthsPct.nawala }}>Nawala</th>
            <th style={{ ...thStyle, width: colWidthsPct.isDefense }}>Is Defense</th>
            <th style={{ ...thStyle, width: colWidthsPct.isLinkAlt }}>Is Link Alt</th>
            <th style={{ ...thStyle, width: colWidthsPct.expiry }}>Expiry Date</th>
            <th style={{ ...thStyle, width: colWidthsPct.nameServer }}>Name Server</th>
            <th style={{ ...thStyle, ...stickyThRight, width: colWidthsPct.actions }}></th>
          </tr>
        </thead>
        {isLoading ? (
          <tbody>
            <tr>
              <td colSpan={10}>
                <Flex justify="center" py="xl">
                  <Loader size="lg" />
                </Flex>
              </td>
            </tr>
          </tbody>
        ) : !domains.length ? (
          <tbody>
            <tr>
              <td colSpan={10}>
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
