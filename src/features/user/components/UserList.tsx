import { useState } from 'react';
import {
  Alert,
  Button,
  Paper,
  Table,
  Loader,
  Text,
  Modal,
  TextInput,
  PasswordInput,
  MultiSelect,
  Group,
  ActionIcon,
  Tooltip,
  Stack,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { zodResolver } from '@mantine/form';
import { openConfirmModal } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconEdit, IconPlus, IconRefresh, IconTrash } from '@tabler/icons-react';
import { getDisplayErrorMessage } from '~/lib/api-error';
import { useStore } from '~/stores';
import { isSuperuser } from '~/features/auth';
import { useUsersQuery } from '../api/useUsersQuery';
import { useRolesQuery } from '../api/useRolesQuery';
import {
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from '../api/useUserMutations';
import {
  createUserSchema,
  updateUserSchema,
  type CreateUserFormValues,
  type UpdateUserFormValues,
} from '../forms/user-form-schema';
import type { UserItem } from '../types';

export function UserList() {
  const user = useStore((s) => s.user);
  const superuser = isSuperuser(user);
  const canManageUsers = superuser || import.meta.env.DEV;

  const { data: items = [], isLoading, error, refetch } = useUsersQuery();
  const { data: roles = [] } = useRolesQuery();
  const createMutation = useCreateUserMutation();
  const updateMutation = useUpdateUserMutation();
  const deleteMutation = useDeleteUserMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<UserItem | null>(null);

  const createForm = useForm<CreateUserFormValues>({
    initialValues: { username: '', email: '', password: '', roleIds: [] },
    validate: zodResolver(createUserSchema),
  });

  const updateForm = useForm<UpdateUserFormValues>({
    initialValues: { username: '', email: '', password: '', roleIds: [] },
    validate: zodResolver(updateUserSchema),
  });

  const form = editing ? updateForm : createForm;
  const roleOptions = roles.map((r) => ({ value: String(r.id), label: r.name }));

  const openCreate = () => {
    setEditing(null);
    createForm.setValues({ username: '', email: '', password: '', roleIds: [] });
    createForm.resetDirty();
    setModalOpen(true);
  };

  const openEdit = (item: UserItem) => {
    setEditing(item);
    updateForm.setValues({
      username: item.username,
      email: item.email,
      password: '',
      roleIds: item.roles.map((r) => r.id),
    });
    updateForm.resetDirty();
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
    createForm.reset();
    updateForm.reset();
  };

  const handleSubmit = form.onSubmit((values) => {
    const roleIds = values.roleIds ?? [];
    if (editing) {
      const payload: { id: number; username: string; email: string; password?: string; roleIds: number[] } = {
        id: editing.id,
        username: values.username,
        email: values.email,
        roleIds,
      };
      if (values.password?.trim()) payload.password = values.password;
      updateMutation.mutate(payload, { onSuccess: () => closeModal() });
    } else {
      const usernameOk = values.username?.trim();
      const passwordOk = values.password?.trim();
      if (!usernameOk && !passwordOk) {
        notifications.show({ message: 'Username and password are required.', color: 'red' });
        return;
      }
      if (!usernameOk) {
        notifications.show({ message: 'Username is required.', color: 'red' });
        return;
      }
      if (!passwordOk) {
        notifications.show({ message: 'Password is required.', color: 'red' });
        return;
      }
      createMutation.mutate(
        {
          username: values.username,
          email: values.email,
          password: values.password!,
          roleIds,
        },
        { onSuccess: () => closeModal() },
      );
    }
  });

  const handleDelete = (item: UserItem) => {
    openConfirmModal({
      title: 'Delete user',
      children: (
        <Text size="sm">
          Are you sure you want to delete user <strong>{item.username}</strong> ({item.email})? This action cannot be undone.
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

  if (error) {
    return (
      <Paper p="lg">
        <Alert color="red" title="Failed to load users">
          {getDisplayErrorMessage(error)}
        </Alert>
        <Button mt="md" variant="light" onClick={() => refetch()}>
          Retry
        </Button>
      </Paper>
    );
  }

  return (
    <>
      <Paper p="lg">
        <Group position="apart" mb="md">
          <Text weight={600} size="lg">
            Users
          </Text>
          <Group spacing="xs">
            <Tooltip label="Refresh list">
              <ActionIcon
                variant="light"
                onClick={() => refetch()}
                disabled={isLoading}
              >
                <IconRefresh size={16} />
              </ActionIcon>
            </Tooltip>
            {canManageUsers && (
              <Button leftIcon={<IconPlus size={16} />} onClick={openCreate} variant="light">
                Create user
              </Button>
            )}
          </Group>
        </Group>
        {items.length === 0 ? (
          <Text c="dimmed">No users yet.</Text>
        ) : (
          <Table striped highlightOnHover>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Roles</th>
                {canManageUsers && <th style={{ width: 1 }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.username}</td>
                  <td>{item.email}</td>
                  <td>
                    {item.roles.length
                      ? item.roles.map((r) => r.name).join(', ')
                      : '–'}
                  </td>
                  {canManageUsers && (
                    <td>
                      <Group spacing="xs" noWrap>
                        <Tooltip label="Edit user">
                          <ActionIcon
                            variant="subtle"
                            color="blue"
                            onClick={() => openEdit(item)}
                          >
                            <IconEdit size={16} />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Delete user">
                          <ActionIcon
                            variant="subtle"
                            color="red"
                            onClick={() => handleDelete(item)}
                            disabled={deleteMutation.isLoading}
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

      {canManageUsers && (
        <Modal
          opened={modalOpen}
          onClose={closeModal}
          title={editing ? 'Edit user' : 'Create user'}
          centered
        >
          <form onSubmit={handleSubmit}>
            <Stack spacing="md">
              <TextInput
                label="Username"
                required
                placeholder="johndoe"
                {...form.getInputProps('username')}
              />
              <TextInput
                label="Email"
                type="email"
                required
                placeholder="john@example.com"
                {...form.getInputProps('email')}
              />
              {editing ? (
                <PasswordInput
                  label="New password (leave empty to keep current)"
                  placeholder="••••••••"
                  {...form.getInputProps('password')}
                />
              ) : (
                <PasswordInput
                  label="Password"
                  required
                  placeholder="••••••••"
                  {...form.getInputProps('password')}
                />
              )}
              <MultiSelect
                label="Roles"
                data={roleOptions}
                value={form.values.roleIds.map(String)}
                onChange={(v) => form.setFieldValue('roleIds', v.map(Number))}
                error={form.errors.roleIds}
                placeholder="Select roles"
                searchable
              />
              <Group position="right" mt="md">
                <Button variant="subtle" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" loading={createMutation.isLoading || updateMutation.isLoading}>
                  {editing ? 'Update user' : 'Create user'}
                </Button>
              </Group>
            </Stack>
          </form>
        </Modal>
      )}
    </>
  );
}
