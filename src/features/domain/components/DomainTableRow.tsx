import { useState } from 'react';
import { Box, Button, Flex, Group, Modal, Stack, Text, Textarea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconCircleArrowUpRight, IconCheck, IconPencil, IconRefresh, IconRotate2, IconX } from '@tabler/icons-react';
import { CopyButton } from '~/components/core/CopyButton';
import { createStyles } from '@mantine/core';
import { getDomainListAction, getDomainStatusDisplay, type Domain } from '../types';
import { useUpdateDomainDescriptionMutation } from '../api/useUpdateDomainDescriptionMutation';
import { useUpdateDomainUsedMutation } from '../api/useUpdateDomainUsedMutation';

interface DomainTableRowProps {
  domain: Domain;
  onNavigateToDetail: (id: string) => void;
  onReactivate?: (domain: Domain) => void;
  onRenew?: (domain: Domain) => void;
  onUnlink?: (domain: Domain) => void;
}

const useStyles = createStyles(() => ({
  actionCell: {
    whiteSpace: 'nowrap',
  },
  linkLike: {
    ':hover': {
      cursor: 'pointer',
    },
  },
  descCell: {
    minWidth: 160,
    maxWidth: 280,
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
  const [opened, { open, close }] = useDisclosure(false);
  const [editValue, setEditValue] = useState('');
  const updateMutation = useUpdateDomainDescriptionMutation();
  const updateUsedMutation = useUpdateDomainUsedMutation();

  const openModal = () => {
    setEditValue(domain.description ?? '');
    open();
  };

  const handleSave = () => {
    const trimmed = editValue.trim();
    const newDesc = trimmed || null;
    if (newDesc !== (domain.description ?? null)) {
      updateMutation.mutate(
        { domainId: domain.id, description: newDesc },
        { onSettled: close },
      );
    } else {
      close();
    }
  };

  return (
    <Box component="tr" key={domain.id}>
      <td style={{ whiteSpace: 'nowrap' }}>
        <Group spacing="xs" noWrap>
          {domain.name}
          <CopyButton value={domain.name} size={14} />
        </Group>
      </td>
      <td style={{ whiteSpace: 'nowrap' }}>{domain.category ?? '–'}</td>
      <td style={{ whiteSpace: 'nowrap' }}>{getDomainStatusDisplay(domain)}</td>
      <td style={{ whiteSpace: 'nowrap' }}>
        <Group spacing="xs" noWrap>
          {domain.nawala ? (
            <>
              <IconX size={16} color="var(--mantine-color-red-6)" />
              <Text size="sm">Blocked</Text>
            </>
          ) : (
            <>
              <IconCheck size={16} color="var(--mantine-color-green-6)" />
              <Text size="sm">Not blocked</Text>
            </>
          )}
        </Group>
      </td>
      <td style={{ whiteSpace: 'nowrap' }}>
        <Group spacing="xs" noWrap>
          {domain.isUsed ? (
            <>
              <IconCheck size={16} color="var(--mantine-color-green-6)" />
              <Text size="sm">Used</Text>
              <Button
                size="xs"
                variant="subtle"
                color="gray"
                onClick={() => updateUsedMutation.mutate({ domainId: domain.id, isUsed: false })}
                disabled={updateUsedMutation.isPending}
              >
                Mark not used
              </Button>
            </>
          ) : (
            <>
              <IconX size={16} color="var(--mantine-color-gray-5)" />
              <Text size="sm">Not used</Text>
              <Button
                size="xs"
                variant="subtle"
                color="gray"
                onClick={() => updateUsedMutation.mutate({ domainId: domain.id, isUsed: true })}
                disabled={updateUsedMutation.isPending}
              >
                Mark used
              </Button>
            </>
          )}
        </Group>
      </td>
      <td style={{ whiteSpace: 'nowrap' }}>{domain.expires}</td>
      <td className={classes.descCell}>
        <Group spacing="xs" noWrap>
          <Text size="sm" truncate title={domain.description ?? undefined} sx={{ flex: 1, minWidth: 0 }}>
            {domain.description ?? '–'}
          </Text>
          <Button
            size="xs"
            variant="subtle"
            color="gray"
            leftIcon={<IconPencil size={14} />}
            onClick={openModal}
          >
            Edit
          </Button>
        </Group>
        <Modal
          opened={opened}
          onClose={close}
          title={`Edit description: ${domain.name}`}
          centered
        >
          <Stack>
            <Textarea
              value={editValue}
              onChange={(e) => setEditValue(e.currentTarget.value)}
              placeholder="Add description..."
              minRows={3}
              autosize
            />
            <Group position="right" mt="md">
              <Button variant="subtle" onClick={close}>
                Cancel
              </Button>
              <Button onClick={handleSave} loading={updateMutation.isPending}>
                Save
              </Button>
            </Group>
          </Stack>
        </Modal>
      </td>
      <td>
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
      <td className={classes.actionCell}>
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
        {action === 'details' && (
          <Flex gap="xs" wrap="wrap" align="center">
            <Flex
              gap="sm"
              className={classes.linkLike}
              onClick={() => onNavigateToDetail(domain.id)}
            >
              <Text color="green">Details</Text>
              <IconCircleArrowUpRight color="green" />
            </Flex>
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
        )}
      </td>
    </Box>
  );
}
