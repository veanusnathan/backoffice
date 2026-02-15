import { useState } from 'react';
import {
  Button,
  Paper,
  Table,
  Loader,
  Text,
  Modal,
  TextInput,
  Select,
  Group,
  ActionIcon,
  Tooltip,
} from '@mantine/core';
import { IconCircleArrowUpRight, IconEdit, IconLogin, IconPlus, IconTrash } from '@tabler/icons-react';
import { CopyButton } from '~/components/core/CopyButton';
import { openCpanelLogin } from '../utils/cpanelLogin';
import { useNavigate } from 'react-router-dom';
import { useStore } from '~/stores';
import { isSuperuser } from '~/features/auth';
import { useCpanelQuery } from '../api/useCpanelQuery';
import {
  useCreateCpanelMutation,
  useUpdateCpanelMutation,
  useDeleteCpanelMutation,
} from '../api/useCpanelMutations';
import type { CpanelItem } from '../types';

const PASSWORD_CENSOR = '***';

export function CpanelList() {
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const superuser = isSuperuser(user);
  const { data: items = [], isLoading } = useCpanelQuery();
  const createMutation = useCreateCpanelMutation();
  const updateMutation = useUpdateCpanelMutation();
  const deleteMutation = useDeleteCpanelMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CpanelItem | null>(null);
  const [form, setForm] = useState({
    ipServer: '',
    username: '',
    password: '',
    package: '',
    mainDomain: '',
    email: '',
    nameServer: '',
    status: '',
  });

  const openCreate = () => {
    setEditing(null);
    setForm({
      ipServer: '',
      username: '',
      password: '',
      package: '',
      mainDomain: '',
      email: '',
      nameServer: '',
      status: '',
    });
    setModalOpen(true);
  };

  const openEdit = (item: CpanelItem) => {
    setEditing(item);
    setForm({
      ipServer: item.ipServer,
      username: item.username,
      password: superuser ? item.password : '',
      package: item.package ?? '',
      mainDomain: item.mainDomain ?? '',
      email: item.email ?? '',
      nameServer: item.nameServer ?? '',
      status: item.status ?? '',
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
    setForm({
      ipServer: '',
      username: '',
      password: '',
      package: '',
      mainDomain: '',
      email: '',
      nameServer: '',
      status: '',
    });
  };

const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const base = {
      ipServer: form.ipServer,
      username: form.username,
      package: form.package || undefined,
      mainDomain: form.mainDomain || undefined,
      email: form.email || undefined,
      nameServer: form.nameServer || undefined,
      status: form.status || undefined,
    };
    if (editing) {
      const updatePayload = { id: editing.id, ...base };
      if (superuser && form.password) (updatePayload as Record<string, unknown>).password = form.password;
      updateMutation.mutate(updatePayload, { onSuccess: () => closeModal() });
    } else {
      createMutation.mutate({ ...base, password: form.password }, { onSuccess: () => closeModal() });
    }
  };

  const handleDelete = (item: CpanelItem) => {
    if (window.confirm(`Delete CPanel data for ${item.ipServer}?`)) {
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
            CPanel Data
          </Text>
          <Button leftIcon={<IconPlus size={16} />} onClick={openCreate} variant="light">
            Add
          </Button>
        </Group>
        {items.length === 0 ? (
          <Text c="dimmed">No CPanel data yet. Click Add to create.</Text>
        ) : (
          <Table striped highlightOnHover>
            <thead>
              <tr>
                <th>IP Server</th>
                <th>Username</th>
                <th>Password</th>
                <th style={{ width: 1, whiteSpace: 'nowrap' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/domain/cpanel/${item.id}`)}>
                  <td>
                    <Group spacing="xs" noWrap>
                      {item.ipServer}
                      <CopyButton value={item.ipServer} size={14} />
                    </Group>
                  </td>
                  <td>{item.username}</td>
                  <td>{superuser ? item.password : PASSWORD_CENSOR}</td>
                  <td onClick={(e) => e.stopPropagation()} style={{ whiteSpace: 'nowrap' }}>
                    <Group spacing="xs" noWrap>
                      <Tooltip label="Login to cPanel (open in new tab)">
                        <ActionIcon
                          variant="subtle"
                          color="teal"
                          onClick={(e) => {
                            e.stopPropagation();
                            openCpanelLogin(item.username, item.password);
                          }}
                        >
                          <IconLogin size={16} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="View Details">
                        <ActionIcon
                          variant="subtle"
                          color="green"
                          onClick={() => navigate(`/domain/cpanel/${item.id}`)}
                        >
                          <IconCircleArrowUpRight size={16} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="Edit">
                        <ActionIcon
                          variant="subtle"
                          color="blue"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEdit(item);
                          }}
                        >
                          <IconEdit size={16} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="Delete">
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item);
                          }}
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
        title={editing ? 'Edit CPanel Data' : 'Add CPanel Data'}
      >
        <form onSubmit={handleSubmit}>
          <TextInput
            label="IP Server"
            placeholder="e.g. 192.168.1.1"
            value={form.ipServer}
            onChange={(e) => setForm((f) => ({ ...f, ipServer: e.target.value }))}
            required
            mb="sm"
          />
          <TextInput
            label="Username"
            placeholder="cpanel_username"
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
            mb="sm"
          />
          <TextInput
            label="Package"
            placeholder="Package"
            value={form.package}
            onChange={(e) => setForm((f) => ({ ...f, package: e.target.value }))}
            mb="sm"
          />
          <TextInput
            label="Main Domain"
            placeholder="Main domain"
            value={form.mainDomain}
            onChange={(e) => setForm((f) => ({ ...f, mainDomain: e.target.value }))}
            mb="sm"
          />
          <TextInput
            label="Email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            mb="sm"
          />
          <TextInput
            label="Name Server"
            placeholder="Name server"
            value={form.nameServer}
            onChange={(e) => setForm((f) => ({ ...f, nameServer: e.target.value }))}
            mb="sm"
          />
          <Select
            label="Status"
            placeholder="Full / Available"
            data={[
              { value: 'Full', label: 'Full' },
              { value: 'Available', label: 'Available' },
            ]}
            value={form.status || null}
            onChange={(v: string | null) => setForm((f) => ({ ...f, status: v ?? '' }))}
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
