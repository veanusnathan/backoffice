import { ThemeIcon } from '@mantine/core';
import { IconUser, IconUsers, IconShield } from '@tabler/icons-react';
import { MainRoute } from './types';
import { UserPage } from '~/pages/user';
import { RoleListPage } from '~/pages/role';
import { RoleDetailPage } from '~/pages/role/[id]';

export const userRoutes: MainRoute = {
  path: 'user-management',
  key: 'USER_MANAGEMENT',
  title: 'User Management',
  sidebarAsGroup: true,
  icon: (
    <ThemeIcon variant="light">
      <IconUser />
    </ThemeIcon>
  ),
  subRoutes: [
    {
      component: <UserPage />,
      path: '',
      index: true,
      key: 'USER_MANAGEMENT_USERS',
      title: 'Users',
      isSidebarMenu: true,
      icon: (
        <ThemeIcon variant="light">
          <IconUsers />
        </ThemeIcon>
      ),
    },
    {
      component: <RoleListPage />,
      path: 'roles',
      index: false,
      key: 'USER_MANAGEMENT_ROLES',
      title: 'Roles',
      isSidebarMenu: true,
      icon: (
        <ThemeIcon variant="light">
          <IconShield />
        </ThemeIcon>
      ),
    },
    {
      component: <RoleDetailPage />,
      path: 'roles/:id',
      index: false,
      key: 'USER_MANAGEMENT_ROLE_DETAIL',
      title: 'Role Detail',
      isSidebarMenu: false,
    },
  ],
};
