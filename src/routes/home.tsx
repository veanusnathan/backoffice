import { ThemeIcon } from '@mantine/core';
import { MainRoute } from './types';
import { IconHome2 } from '@tabler/icons-react';
import { DashboardPage } from '~/pages/home';

export const homeRoutes: MainRoute = {
  path: '/',
  key: 'HOME',
  title: 'Home',
  icon: (
    <ThemeIcon variant="light">
      <IconHome2 />
    </ThemeIcon>
  ),
  subRoutes: [
    {
      component: <DashboardPage />,
      path: '',
      index: true,
      key: 'HOME_INDEX',
      title: 'Home',
      isSidebarMenu: false,
    },
  ],
};
