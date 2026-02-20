import { useState } from 'react';
import {
  Alert,
  Button,
  Paper,
  Table,
  Loader,
  TextInput,
  Group,
  ActionIcon,
  Tooltip,
  Stack,
  Title,
  Modal,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus, IconTrash, IconPencil } from '@tabler/icons-react';
import { CopyButton } from '~/components/core/CopyButton';
import { useStore } from '~/stores';
import { isSuperuser } from '~/features/auth';
import { useWhitelistedIpsQuery } from '../api/useWhitelistedIpsQuery';
import {
  useCreateWhitelistedIpMutation,
  useUpdateWhitelistedIpMutation,
  useDeleteWhitelistedIpMutation,
} from '../api/useWhitelistedIpsMutations';
import type { WhitelistedIp } from '../types';

export function WhitelistIpList() {
  const user = useStore((s) => s.user);
  const superuser = isSuperuser(user);

  const { data: items = [], isLoading } = useWhitelistedIpsQuery();
  const createMutation = useCreateWhitelistedIpMutation();
  const updateMutation = useUpdateWhitelistedIpMutation();
  const deleteMutation = useDeleteWhitelistedIpMutation();
  const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [editing, setEditing] = useState<WhitelistedIp | null>(null);
  const [editIp, setEditIp] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const [ip, setIp] = useState('');
  const [description, setDescription] = useState('');

  const handleOpenEdit = (item: WhitelistedIp) => {
    setEditing(item);
    setEditIp(item.ip);
    setEditDescription(item.description ?? '');
    openEdit();
  };

  const handleSaveEdit = () => {
    if (!editing) return;
    const trimmedIp = editIp.trim();
    if (!trimmedIp) return;
    const desc = editDescription.trim();
    updateMutation.mutate(
      { id: editing.id, ip: trimmedIp, description: desc ? desc : null },
      { onSuccess: closeEdit, onSettled: () => setEditing(null) },
    );
  };

  const handleAdd = () => {
    const trimmedIp = ip.trim();
    if (!trimmedIp) return;
    createMutation.mutate(
      { ip: trimmedIp, description: description.trim() || undefined },
      {
        onSuccess: () => {
          setIp('');
          setDescription('');
        },
      },
    );
  };

  // In dev: allow all users. In prod: superuser only.
  const canManage = import.meta.env.DEV || superuser;
  if (!canManage) {
    return (
      <Paper p="lg">
        <Alert color="red" title="Access denied">
          Only superusers can manage whitelisted IPs.
        </Alert>
      </Paper>
    );
  }

  return (
    <Stack spacing="lg">
      <Paper p="lg">
        <Title order={5} mb="md">
          Add IP to whitelist
        </Title>
        <Group align="flex-end">
          <TextInput
            label="IP address"
            placeholder="192.168.1.1"
            value={ip}
            onChange={(e) => setIp(e.currentTarget.value)}
            style={{ minWidth: 180 }}
          />
          <TextInput
            label="Description (optional)"
            placeholder="e.g. Office network"
            value={description}
            onChange={(e) => setDescription(e.currentTarget.value)}
            style={{ minWidth: 200 }}
          />
          <Button
            leftIcon={<IconPlus size={16} />}
            onClick={handleAdd}
            loading={createMutation.isPending}
            disabled={!ip.trim()}
          >
            Add
          </Button>
        </Group>
      </Paper>

      <Paper p="lg">
        <Title order={5} mb="md">
          Whitelisted IPs
        </Title>
        <Table highlightOnHover>
          <thead>
            <tr>
              <th>IP</th>
              <th>Description</th>
              <th style={{ width: 1 }}></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={3}>
                  <Loader size="sm" />
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={3}>No whitelisted IPs yet.</td>
              </tr>
            ) : (
              items.map((item: WhitelistedIp) => (
                <tr key={item.id}>
                  <td>
                    <Group spacing="xs" noWrap>
                      {item.ip}
                      <CopyButton value={item.ip} size={14} />
                    </Group>
                  </td>
                  <td>{item.description ?? '–'}</td>
                  <td>
                    <Group spacing="xs" noWrap>
                      <Tooltip label="Edit">
                        <ActionIcon
                          variant="light"
                          color="gray"
                          onClick={() => handleOpenEdit(item)}
                          disabled={updateMutation.isPending}
                        >
                          <IconPencil size={16} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="Remove from whitelist">
                        <ActionIcon
                          color="red"
                          variant="light"
                          onClick={() => deleteMutation.mutate(item.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Paper>

      <Modal opened={editOpened} onClose={closeEdit} title="Edit whitelisted IP" centered>
        <Stack>
          <TextInput
            label="IP address"
            placeholder="192.168.1.1"
            value={editIp}
            onChange={(e) => setEditIp(e.currentTarget.value)}
            required
          />
          <TextInput
            label="Description (optional)"
            placeholder="e.g. Office network"
            value={editDescription}
            onChange={(e) => setEditDescription(e.currentTarget.value)}
          />
          <Group position="right" mt="md">
            <Button variant="default" onClick={closeEdit}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} loading={updateMutation.isPending} disabled={!editIp.trim()}>
              Save
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
