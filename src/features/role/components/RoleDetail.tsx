import { useState, useEffect } from 'react';
import {
  Loader,
  Paper,
  Stack,
  Text,
  TextInput,
  Group,
  Button,
  ActionIcon,
  Modal,
  Table,
  Flex,
  Tooltip,
} from '@mantine/core';
import { IconArrowLeft, IconUserPlus, IconUserMinus } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useGetRoleDetailQuery } from '../api/useGetRoleDetailQuery';
import { useUpdateRoleMutation } from '../api/useRoleMutations';
import { useUsersQuery } from '~/features/user/api/useUsersQuery';
import { useUpdateUserMutation } from '~/features/user/api/useUserMutations';
import { useStore } from '~/stores';
import { isSuperuser } from '~/features/auth';

interface RoleDetailProps {
  roleId: string;
}

export function RoleDetail({ roleId }: RoleDetailProps) {
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const canManageRoles = isSuperuser(user) || import.meta.env.DEV;

  const id = parseInt(roleId, 10);
  const { data: role, isLoading } = useGetRoleDetailQuery(roleId);
  const { data: allUsers = [] } = useUsersQuery();
  const updateRoleMutation = useUpdateRoleMutation();
  const updateUserMutation = useUpdateUserMutation();

  const [name, setName] = useState('');
  const [assignModalOpen, setAssignModalOpen] = useState(false);

  useEffect(() => {
    if (role?.name) setName(role.name);
  }, [role?.name]);

  const usersInRole = role?.users ?? [];
  const userIdsInRole = new Set(usersInRole.map((u) => u.id));
  const usersNotInRole = allUsers.filter((u) => !userIdsInRole.has(u.id));

  const handleAssign = (userId: number) => {
    const targetUser = allUsers.find((u) => u.id === userId);
    if (!targetUser) return;
    const currentRoleIds = targetUser.roles.map((r) => r.id);
    const newRoleIds = currentRoleIds.includes(id) ? currentRoleIds : [...currentRoleIds, id];
    updateUserMutation.mutate(
      { id: userId, roleIds: newRoleIds },
      { onSuccess: () => setAssignModalOpen(false) },
    );
  };

  const handleUnassign = (userId: number) => {
    const targetUser = allUsers.find((u) => u.id === userId);
    if (!targetUser) return;
    const newRoleIds = targetUser.roles.filter((r) => r.id !== id).map((r) => r.id);
    updateUserMutation.mutate({ id: userId, roleIds: newRoleIds });
  };

  const handleSaveName = () => {
    if (!role || name.trim() === role.name) return;
    updateRoleMutation.mutate({ id: role.id, name: name.trim() });
  };

  if (isLoading || !role) {
    return (
      <Paper p="lg">
        <Loader size="lg" />
      </Paper>
    );
  }

  const formDirty = name !== role.name;

  return (
    <Stack spacing="lg">
      <Paper p="lg">
        <Group position="apart" mb="md">
          <Group spacing="xs">
            <ActionIcon
              variant="subtle"
              onClick={() => navigate('/user-management/roles')}
              size="lg"
            >
              <IconArrowLeft size={20} />
            </ActionIcon>
            <Text weight={600} size="lg">
              Role Detail
            </Text>
          </Group>
        </Group>

        <Stack spacing="sm">
          <TextInput
            label="Role name"
            value={name || role.name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter role name"
            disabled={!canManageRoles}
          />
          {canManageRoles && formDirty && (
            <Button onClick={handleSaveName} loading={updateRoleMutation.isPending}>
              Save
            </Button>
          )}
        </Stack>
      </Paper>

      <Paper p="lg">
        <Stack spacing="md">
          <Flex justify="space-between" align="center">
            <Text weight={600} size="md">
              Users with this role
            </Text>
            {canManageRoles && (
              <Button
                size="sm"
                variant="light"
                leftIcon={<IconUserPlus size={16} />}
                onClick={() => setAssignModalOpen(true)}
              >
                Assign User
              </Button>
            )}
          </Flex>

          {usersInRole.length === 0 ? (
            <Text c="dimmed">No users assigned to this role yet.</Text>
          ) : (
            <Table striped highlightOnHover>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  {canManageRoles && <th style={{ width: 1 }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {usersInRole.map((u) => (
                  <tr key={u.id}>
                    <td>{u.username}</td>
                    <td>{u.email}</td>
                    {canManageRoles && (
                      <td>
                        <Tooltip label="Unassign from role">
                          <ActionIcon
                            variant="subtle"
                            color="red"
                            onClick={() => handleUnassign(u.id)}
                            disabled={updateUserMutation.isLoading}
                          >
                            <IconUserMinus size={16} />
                          </ActionIcon>
                        </Tooltip>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Stack>
      </Paper>

      {canManageRoles && (
        <Modal
          opened={assignModalOpen}
          onClose={() => setAssignModalOpen(false)}
          title="Assign User to Role"
        >
          <Stack>
            {usersNotInRole.length === 0 ? (
              <Text c="dimmed">All users already have this role.</Text>
            ) : (
              usersNotInRole.map((u) => (
                <Flex
                  key={u.id}
                  justify="space-between"
                  align="center"
                  py="xs"
                  sx={{
                    borderBottom: '1px solid var(--mantine-color-gray-2)',
                  }}
                >
                  <div>
                    <Text size="sm" weight={500}>
                      {u.username}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {u.email}
                    </Text>
                  </div>
                  <Button
                    size="xs"
                    variant="light"
                    onClick={() => handleAssign(u.id)}
                    loading={updateUserMutation.isLoading}
                  >
                    Assign
                  </Button>
                </Flex>
              ))
            )}
          </Stack>
        </Modal>
      )}
    </Stack>
  );
}
