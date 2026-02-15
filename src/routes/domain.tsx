import { ThemeIcon } from '@mantine/core';
import { IconShieldCheck, IconServer, IconWorld } from '@tabler/icons-react';
import { MainRoute } from './types';
import { DomainListPage } from '~/pages/domain';
import { DomainDetailPage } from '~/pages/domain/[id]';
import { CpanelPage } from '~/pages/cpanel';
import { CpanelDetailPage } from '~/pages/cpanel/[id]';
import { WordPressPage } from '~/pages/wordpress';
import { WhitelistIpPage } from '~/pages/whitelist-ip';

export const domainRoutes: MainRoute = {
  path: 'domain',
  key: 'DOMAIN',
  title: 'Pendataan Domain',
  sidebarAsGroup: true,
  icon: (
    <ThemeIcon variant="light">
      <IconWorld />
    </ThemeIcon>
  ),
  subRoutes: [
    {
      component: <DomainListPage />,
      path: '',
      index: true,
      key: 'DOMAIN_INDEX',
      title: 'Domain',
      isSidebarMenu: true,
      icon: (
        <ThemeIcon variant="light">
          <IconWorld />
        </ThemeIcon>
      ),
    },
    {
      component: <CpanelDetailPage />,
      path: 'cpanel/:id',
      index: false,
      key: 'DOMAIN_CPANEL_DETAIL',
      title: 'CPanel Detail',
      isSidebarMenu: false,
    },
    {
      component: <CpanelPage />,
      path: 'cpanel',
      index: false,
      key: 'DOMAIN_CPANEL',
      title: 'CPanel',
      isSidebarMenu: true,
      icon: (
        <ThemeIcon variant="light">
          <IconServer />
        </ThemeIcon>
      ),
    },
    {
      component: <WordPressPage />,
      path: 'wordpress',
      index: false,
      key: 'DOMAIN_WORDPRESS',
      title: 'WordPress',
      isSidebarMenu: true,
      icon: (
        <ThemeIcon variant="light">
          <IconWorld />
        </ThemeIcon>
      ),
    },
    {
      component: <WhitelistIpPage />,
      path: 'whitelist-ip',
      index: false,
      key: 'DOMAIN_WHITELIST_IP',
      title: 'Whitelist IP',
      isSidebarMenu: true,
      requiredRoles: ['superuser'],
      icon: (
        <ThemeIcon variant="light">
          <IconShieldCheck />
        </ThemeIcon>
      ),
    },
    {
      component: <DomainDetailPage />,
      path: ':id',
      index: false,
      key: 'DOMAIN_DETAIL',
      title: 'Detail Domain',
      isSidebarMenu: false,
    },
  ],
};
