import { ThemeIcon } from '@mantine/core';
import { MainRoute } from './types';
import { IconHome2 } from '@tabler/icons-react';

export const homeRoutes: MainRoute = {
  path: '/',
  key: 'HOME',
  title: 'Home',
  icon: (
    <ThemeIcon variant="light">
      <IconHome2 />
    </ThemeIcon>
  ),
  subRoutes: [],
};
