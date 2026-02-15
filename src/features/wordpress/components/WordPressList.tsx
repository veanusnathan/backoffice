import { useState } from 'react';
import {
  Button,
  Paper,
  Table,
  Loader,
  Text,
  Modal,
  TextInput,
  Group,
  ActionIcon,
  Tooltip,
} from '@mantine/core';
import { IconEdit, IconLogin, IconPlus, IconTrash } from '@tabler/icons-react';
import { CopyButton } from '~/components/core/CopyButton';
import { useStore } from '~/stores';
import { isSuperuser } from '~/features/auth';
import { useWordPressQuery } from '../api/useWordPressQuery';
import {
  useCreateWordPressMutation,
  useUpdateWordPressMutation,
  useDeleteWordPressMutation,
} from '../api/useWordPressMutations';
import { openWordPressLogin } from '../utils/wordpressLogin';
import type { WordPressItem } from '../types';

const PASSWORD_CENSOR = '***';

export function WordPressList() {
  const user = useStore((s) => s.user);
  const superuser = isSuperuser(user);
  const { data: items = [], isLoading } = useWordPressQuery();
  const createMutation = useCreateWordPressMutation();
  const updateMutation = useUpdateWordPressMutation();
  const deleteMutation = useDeleteWordPressMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<WordPressItem | null>(null);
  const [form, setForm] = useState({ domain: '', username: '', password: '' });

  const openCreate = () => {
    setEditing(null);
    setForm({ domain: '', username: '', password: '' });
    setModalOpen(true);
  };

  const openEdit = (item: WordPressItem) => {
    setEditing(item);
    setForm({
      domain: item.domain,
      username: item.username,
      password: superuser ? item.password : '',
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
    setForm({ domain: '', username: '', password: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      const payload: { id: number; domain: string; username: string; password?: string } = {
        id: editing.id,
        domain: form.domain,
        username: form.username,
      };
      if (superuser && form.password && form.password !== PASSWORD_CENSOR) {
        payload.password = form.password;
      }
      updateMutation.mutate(payload, { onSuccess: () => closeModal() });
    } else {
      createMutation.mutate(form, { onSuccess: () => closeModal() });
    }
  };

  const handleDelete = (item: WordPressItem) => {
    if (window.confirm(`Delete WordPress data for ${item.domain}?`)) {
      deleteMutation.mutate(item.id);
    }
  };

  if (isLoading) {
    return (
      <Paper p="lg">
        <Loader size="lg" />
      </Paper>
    );
  }

  return (
    <>
      <Paper p="lg">
        <Group position="apart" mb="md">
          <Text weight={600} size="lg">
            WordPress Data
          </Text>
          <Button leftIcon={<IconPlus size={16} />} onClick={openCreate} variant="light">
            Add
          </Button>
        </Group>
        {items.length === 0 ? (
          <Text c="dimmed">No WordPress data yet. Click Add to create.</Text>
        ) : (
          <Table striped highlightOnHover>
            <thead>
              <tr>
                <th>Domain</th>
                <th>Username</th>
                <th>Password</th>
                <th style={{ width: 1, whiteSpace: 'nowrap' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <Group spacing="xs" noWrap>
                      {item.domain}
                      <CopyButton value={item.domain} size={14} />
                    </Group>
                  </td>
                  <td>{item.username}</td>
                  <td>{superuser ? item.password : PASSWORD_CENSOR}</td>
                  <td>
                    <Group spacing="xs" noWrap>
                      <Tooltip label="Login to WordPress (open in new tab)">
                        <ActionIcon
                          variant="subtle"
                          color="teal"
                          onClick={() =>
                            openWordPressLogin(item.domain, item.username, item.password)
                          }
                        >
                          <IconLogin size={16} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="Edit">
                        <ActionIcon
                          variant="subtle"
                          color="blue"
                          onClick={() => openEdit(item)}
                        >
                          <IconEdit size={16} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="Delete">
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          onClick={() => handleDelete(item)}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Paper>

      <Modal
        opened={modalOpen}
        onClose={closeModal}
        title={editing ? 'Edit WordPress Data' : 'Add WordPress Data'}
      >
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Domain"
            placeholder="e.g. example.com"
            value={form.domain}
            onChange={(e) => setForm((f) => ({ ...f, domain: e.target.value }))}
            required
            mb="sm"
          />
          <TextInput
            label="Username"
            placeholder="wp_username"
            value={form.username}
            onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
            required
            mb="sm"
          />
          <TextInput
            label="Password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            required
            mb="md"
          />
          <Group position="right">
            <Button variant="default" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              type="submit"
              loading={createMutation.isLoading || updateMutation.isLoading}
            >
              {editing ? 'Update' : 'Create'}
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  );
}
