import { Stack, Text } from '@mantine/core';
import { UserList } from '~/features/user/components/UserList';

export function UserPage() {
  return (
    <Stack spacing="lg">
      <div>
        <Text weight={600} size="xl">
          User management
        </Text>
        <Text size="sm" c="dimmed" mt={4}>
          Create, view, edit, and delete users. Only superusers can create or modify users.
        </Text>
      </div>
      <UserList />
    </Stack>
  );
}
