import { Stack, Text } from '@mantine/core';
import { RoleList } from '~/features/role/components/RoleList';

export function RoleListPage() {
  return (
    <Stack spacing="lg">
      <div>
        <Text weight={600} size="xl">
          Roles
        </Text>
        <Text size="sm" c="dimmed" mt={4}>
          Create and manage roles. Click a role to view details and assign users.
        </Text>
      </div>
      <RoleList />
    </Stack>
  );
}
