import { Avatar, Box, Group, Navbar, Text, useMantineTheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronRight } from '@tabler/icons-react';
import { useStore } from '~/stores';
import { LogOutModal } from './LogOutModal';

export const UserSection = () => {
  const theme = useMantineTheme();
  const [opened, handlers] = useDisclosure(false);

  const { user, onLogout } = useStore();

  const handleLogout = () => {
    onLogout();
  };

  return (
    <>
      <Navbar.Section
        onClick={handlers.open}
        style={{
          padding: `${theme.spacing.sm}`,
        }}
        sx={{
          borderTop: `1px solid ${theme.colors.gray[2]}`,
        }}>
        <Group
          position="apart"
          sx={{
            padding: `${theme.spacing.sm} 8px`,
            ':hover': { cursor: 'pointer', backgroundColor: theme.colors.gray[2] },
          }}>
          <Group>
            <Avatar color="brand" radius="xl">
              {(user?.email?.[0] ?? user?.id?.[0] ?? '?').toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Text fw="bold" size="sm" weight={500}>
                {user?.email ?? user?.id}
              </Text>
            </Box>
          </Group>
          <IconChevronRight />
        </Group>
      </Navbar.Section>
      <LogOutModal opened={opened} onClose={handlers.close} centered onSubmit={handleLogout} />
    </>
  );
};
