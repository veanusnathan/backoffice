import { Box, Button, Flex, Group, Stack, Text, Tooltip } from '@mantine/core';
import {
  IconCheck,
  IconCircleCheck,
  IconCircleX,
  IconLock,
  IconPencil,
  IconRefresh,
  IconRotate2,
  IconForbid
} from '@tabler/icons-react';
import { CopyButton } from '~/components/core/CopyButton';
import { createStyles } from '@mantine/core';
import { getDomainListAction, getDomainStatusDisplay, type Domain } from '../types';

interface DomainTableRowProps {
  domain: Domain;
  onNavigateToDetail: (id: string) => void;
  onReactivate?: (domain: Domain) => void;
  onRenew?: (domain: Domain) => void;
  onUnlink?: (domain: Domain) => void;
}

const STICKY_LEFT = {
  position: 'sticky' as const,
  left: 0,
  zIndex: 2,
  boxShadow: '2px 0 4px -2px rgba(0,0,0,0.1)',
};
const STICKY_RIGHT = {
  position: 'sticky' as const,
  right: 0,
  zIndex: 2,
  boxShadow: '-2px 0 4px -2px rgba(0,0,0,0.1)',
};

const useStyles = createStyles(() => ({
  actionCell: {
    whiteSpace: 'nowrap',
  },
  linkLike: {
    ':hover': {
      cursor: 'pointer',
    },
  },
  nameCell: {
    minWidth: 180,
    maxWidth: 280,
    overflow: 'hidden',
  },
  nameText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    minWidth: 0,
  },
  stickyLeft: {
    backgroundColor: 'var(--mantine-color-body)',
    '[data-mantine-color-scheme="light"] &': {
      backgroundColor: '#fff',
    },
  },
  stickyRight: {
    backgroundColor: 'var(--mantine-color-body)',
    '[data-mantine-color-scheme="light"] &': {
      backgroundColor: '#fff',
    },
  },
  row: {
    '&:hover $stickyLeft, &:hover $stickyRight': {
      backgroundColor: 'var(--mantine-color-default-hover)',
    },
  },
}));

export function DomainTableRow({
  domain,
  onNavigateToDetail,
  onReactivate,
  onRenew,
  onUnlink,
}: DomainTableRowProps) {
  const { classes } = useStyles();
  const action = getDomainListAction(domain);

  return (
    <Box component="tr" key={domain.id} className={classes.row}>
      <td className={`${classes.nameCell} ${classes.stickyLeft}`} style={{ paddingLeft: 10, paddingRight: 10, ...STICKY_LEFT }}>
        <Group spacing="xs" noWrap style={{ minWidth: 0 }}>
          <Text component="span" size="sm" className={classes.nameText} title={domain.name}>
            {domain.name}
          </Text>
          <CopyButton value={domain.name} size={14} />
        </Group>
      </td>
      <td style={{ whiteSpace: 'nowrap', paddingLeft: 10, paddingRight: 10 }}>{domain.category ?? '–'}</td>
      <td style={{ whiteSpace: 'nowrap', paddingLeft: 10, paddingRight: 10 }}>{domain.group?.name ?? '–'}</td>
      <td style={{ whiteSpace: 'nowrap', paddingLeft: 10, paddingRight: 10, verticalAlign: 'middle' }}>
        <Tooltip label={getDomainStatusDisplay(domain)} position="top" withinPortal>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, flexShrink: 0 }}>
            {domain.isExpired ? (
              <IconCircleX size={16} color="#e03131" />
            ) : domain.isLocked ? (
              <IconLock size={16} color="#fab005" />
            ) : (
              <IconCircleCheck size={16} color="#40c057" />
            )}
          </span>
        </Tooltip>
      </td>
      <td style={{ whiteSpace: 'nowrap', paddingLeft: 10, paddingRight: 10, verticalAlign: 'middle' }}>
        <Tooltip label={domain.nawala ? 'Blocked' : 'Not blocked'} position="top" withinPortal>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, flexShrink: 0 }}>
            {domain.nawala ? (
              <IconForbid size={16} color="#e03131" />
            ) : (
              <IconCheck size={16} color="#40c057" />
            )}
          </span>
        </Tooltip>
      </td>
      <td style={{ whiteSpace: 'nowrap', paddingLeft: 10, paddingRight: 10, verticalAlign: 'middle' }}>
        <Tooltip label={domain.isDefense ? 'Is domain defense' : 'Not domain defense'} position="top" withinPortal>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, flexShrink: 0 }}>
            {domain.isDefense ? (
              <IconCheck size={16} color="#40c057" />
            ) : (
              <IconForbid size={16} color="#868e96" />
            )}
          </span>
        </Tooltip>
      </td>
      <td style={{ whiteSpace: 'nowrap', paddingLeft: 10, paddingRight: 10, verticalAlign: 'middle' }}>
        <Tooltip label={domain.isLinkAlt ? 'Is domain link alt' : 'Not domain link alt'} position="top" withinPortal>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, flexShrink: 0 }}>
            {domain.isLinkAlt ? (
              <IconCheck size={16} color="#40c057" />
            ) : (
              <IconForbid size={16} color="#868e96" />
            )}
          </span>
        </Tooltip>
      </td>
      <td style={{ whiteSpace: 'nowrap', paddingLeft: 10, paddingRight: 10 }}>{domain.expires}</td>
      <td style={{ paddingLeft: 10, paddingRight: 10 }}>
        {domain.nameServers?.length ? (
          <Stack spacing={2}>
            {domain.nameServers.map((ns, i) => (
              <Text key={i} size="xs" sx={{ lineHeight: 1.2, wordBreak: 'break-all' }}>
                {ns}
              </Text>
            ))}
          </Stack>
        ) : (
          '–'
        )}
      </td>
      <td className={`${classes.actionCell} ${classes.stickyRight}`} style={{ paddingLeft: 10, paddingRight: 10, ...STICKY_RIGHT }}>
        <Flex gap="xs" wrap="wrap" align="center" justify="flex-end">
          {action === 'reactivate' && (
            <Button
              size="xs"
              variant="light"
              color="orange"
              leftIcon={<IconRotate2 size={14} />}
              onClick={() => onReactivate?.(domain)}
            >
              Reactivate
            </Button>
          )}
          {action === 'renew' && (
            <Button
              size="xs"
              variant="light"
              color="yellow"
              leftIcon={<IconRefresh size={14} />}
              onClick={() => onRenew?.(domain)}
            >
              Renew
            </Button>
          )}
          <Tooltip label="Edit" position="top" withinPortal>
            <Button
              size="xs"
              variant="subtle"
              color="gray"
              leftIcon={<IconPencil size={14} />}
              onClick={() => onNavigateToDetail(domain.id)}
            >
              Edit
            </Button>
          </Tooltip>
          {onUnlink && (
            <Button
              size="xs"
              variant="light"
              color="red"
              onClick={() => onUnlink(domain)}
            >
              Unlink
            </Button>
          )}
        </Flex>
      </td>
    </Box>
  );
}
