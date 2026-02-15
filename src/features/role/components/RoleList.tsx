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
import { IconCircleArrowUpRight, IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { openConfirmModal } from '@mantine/modals';
import { useNavigate } from 'react-router-dom';
import { useStore } from '~/stores';
import { isSuperuser } from '~/features/auth';
import { useRolesQuery } from '~/features/user/api/useRolesQuery';
import {
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} from '../api/useRoleMutations';
import type { RoleItem } from '~/features/user/types';

export function RoleList() {
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const superuser = isSuperuser(user);
  const canManageRoles = superuser || import.meta.env.DEV;

  const { data: items = [], isLoading } = useRolesQuery();
  const createMutation = useCreateRoleMutation();
  const updateMutation = useUpdateRoleMutation();
  const deleteMutation = useDeleteRoleMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<RoleItem | null>(null);
  const [name, setName] = useState('');

  const openCreate = () => {
    setEditing(null);
    setName('');
    setModalOpen(true);
  };

  const openEdit = (item: RoleItem) => {
    setEditing(item);
    setName(item.name);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
    setName('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    if (editing) {
      updateMutation.mutate(
        { id: editing.id, name: trimmed },
        { onSuccess: () => closeModal() },
      );
    } else {
      createMutation.mutate(
        { name: trimmed },
        { onSuccess: () => closeModal() },
      );
    }
  };

  const handleDelete = (item: RoleItem) => {
    openConfirmModal({
      title: 'Delete role',
      children: (
        <Text size="sm">
          Are you sure you want to delete role <strong>{item.name}</strong>? This
          action cannot be undone.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteMutation.mutate(item.id),
    });
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
            Roles
          </Text>
          {canManageRoles && (
            <Button leftIcon={<IconPlus size={16} />} onClick={openCreate} variant="light">
              Add role
            </Button>
          )}
        </Group>
        {items.length === 0 ? (
          <Text c="dimmed">No roles yet. Click Add role to create.</Text>
        ) : (
          <Table striped highlightOnHover>
            <thead>
              <tr>
                <th>Name</th>
                {canManageRoles && <th style={{ width: 1, whiteSpace: 'nowrap' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/user-management/roles/${item.id}`)}
                >
                  <td>{item.name}</td>
                  {canManageRoles && (
                    <td onClick={(e) => e.stopPropagation()} style={{ whiteSpace: 'nowrap' }}>
                      <Group spacing="xs" noWrap>
                        <Tooltip label="View details">
                          <ActionIcon
                            variant="subtle"
                            color="green"
                            onClick={() => navigate(`/user-management/roles/${item.id}`)}
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
                  )}
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Paper>

      {canManageRoles && (
        <Modal
          opened={modalOpen}
          onClose={closeModal}
          title={editing ? 'Edit role' : 'Add role'}
        >
          <form onSubmit={handleSubmit}>
            <TextInput
              label="Role name"
              placeholder="e.g. editor"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              mb="md"
            />
            <Group position="right">
              <Button variant="subtle" onClick={closeModal}>
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
      )}
    </>
  );
}
