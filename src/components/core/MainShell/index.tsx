import { AppShell, Group, Header, Navbar, Stack, Text } from '@mantine/core';
import { PropsWithChildren } from 'react';
import { Link, Location } from 'react-router-dom';
import { UserSection } from './UserSection';
import { SidebarLink } from '../SidebarLink';
import { homeRoutes } from '~/routes/home';

interface MainShellProps {
  sidebarMenus: React.ReactNode;
  location?: Location;
}

export const MainShell: React.FC<PropsWithChildren & MainShellProps> = ({
  children,
  sidebarMenus,
  location,
}) => {
  return (
    <AppShell
      sx={theme => {
        return {
          backgroundColor: theme.colors.gray[1],
        };
      }}
      navbar={
        <Navbar width={{ base: 300 }} p="xs" zIndex={1}>
          <Navbar.Section grow>
            <Stack spacing={1}>
              {location?.pathname !== '/' && (
                <SidebarLink label={homeRoutes.title} to={homeRoutes.path} icon={homeRoutes.icon} />
              )}
              {sidebarMenus}
            </Stack>
          </Navbar.Section>
          <UserSection />
        </Navbar>
      }
      header={
        <Header height={70} px="xl">
          <Group h="100%" align="center">
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Text weight={600} size="lg">MAIN</Text>
            </Link>
          </Group>
        </Header>
      }>
      {children}
    </AppShell>
  );
};
