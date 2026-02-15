import { Box, Breadcrumbs, NavLink, Title } from '@mantine/core';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { routes } from '~/routes';
import { MainShell } from '~/components/core/MainShell';
import { BreadCrumbsRoute, SubRoute } from '~/routes/types';
import { SidebarLink } from '~/components/core/SidebarLink';
import { useStore } from '~/stores';

function hasRequiredRole(userRoles: string[] | undefined, requiredRoles?: string[]): boolean {
  if (!requiredRoles?.length) return true;
  if (import.meta.env.DEV) return true; // Development: bypass role check (e.g. whitelist IP)
  if (!userRoles?.length) return false;
  return requiredRoles.some((r) => userRoles.includes(r));
}

export const MainRouter = () => {
  const location = useLocation();
  const user = useStore((s) => s.user);

  const renderMainRoutes = (callback: (subRoute: SubRoute) => React.ReactElement | undefined) => {
    return routes.map(mainRoute => {
      return (
        <Route path={`${mainRoute.path}/*`} key={mainRoute.key}>
          {mainRoute.subRoutes.map(callback)}
        </Route>
      );
    });
  };

  const renderRoutes = () => {
    return renderMainRoutes(subRoute => {
      return (
        <Route
          path={subRoute.path}
          element={subRoute.component}
          index={subRoute.index}
          key={subRoute.key}
        />
      );
    });
  };

  const renderPageTitle = () => {
    return renderMainRoutes(subRoute => {
      return (
        <Route
          path={subRoute.path}
          element={<Title>{subRoute.title}</Title>}
          index={subRoute.index}
          key={subRoute.key}
        />
      );
    });
  };

  const renderSidebar = () => {
    const sidebarItems = routes.flatMap((mainRoute) => {
      if (mainRoute.sidebarAsGroup) {
        const subMenuItems = mainRoute.subRoutes.filter(
          (s) => s.isSidebarMenu && hasRequiredRole(user?.roles, s.requiredRoles),
        );
        const isDomainPath = location.pathname.startsWith(`/${mainRoute.path}`);
        return [
          <NavLink
            key={mainRoute.key}
            label={mainRoute.title}
            icon={mainRoute.icon}
            defaultOpened={isDomainPath}
            childrenOffset="md"
          >
            {subMenuItems.map((subRoute) => {
              const fullPath = `/${mainRoute.path}${subRoute.path ? '/' + subRoute.path : ''}`;
              const isActive = fullPath === location.pathname;
              return (
                <NavLink
                  key={subRoute.key}
                  component={Link}
                  to={fullPath}
                  label={subRoute.title}
                  icon={subRoute.icon}
                  active={isActive}
                  styles={{ label: { fontSize: 16 } }}
                />
              );
            })}
          </NavLink>,
        ];
      }

      return mainRoute.subRoutes
        .filter(
          (s) => s.isSidebarMenu && hasRequiredRole(user?.roles, s.requiredRoles),
        )
        .map((subRoute) => {
          const fullPath = `/${mainRoute.path}${subRoute.path ? '/' + subRoute.path : ''}`.replace(
            /\/+/g,
            '/',
          );
          const isActive = fullPath === location.pathname;
          return (
            <SidebarLink
              key={subRoute.key}
              label={subRoute.title}
              to={fullPath}
              icon={subRoute.icon}
              active={isActive}
            />
          );
        });
    });

    return (
      <Route path="*" element={<>{sidebarItems}</>} />
    );
  };

  const splittedUrl = location.pathname.split('/');
  const breadCrumbsRoute: BreadCrumbsRoute[] = [];

  let previousPath = '';

  splittedUrl.forEach((item, index) => {
    const currentPath = item.trim();

    if (currentPath || index === 0) {
      previousPath = previousPath ? `${previousPath}/${currentPath}` : currentPath;

      let title = '';
      if (index === 0) {
        title = 'home';
      } else {
        const routeParts = currentPath.split('/');
        if (routeParts.length > 0) {
          const lastPart = routeParts[routeParts.length - 1];

          if (!isNaN(Number(lastPart))) {
            routeParts.pop();
            title = `${previousPath.split('/')[previousPath.split('/').length - 2]} details`;
          } else {
            title = lastPart;
          }
        }
      }

      breadCrumbsRoute.push({ route: previousPath, title });
    }
  });

  const breadCrumbsItem = breadCrumbsRoute.map((item, index) => {
    return (
      <Link to={item.route} key={index} style={{ textDecoration: 'none', color: '#00C48F' }}>
        {item.title}
      </Link>
    );
  });

  return (
    <MainShell sidebarMenus={<Routes>{renderSidebar()}</Routes>} location={location}>
      {location.pathname !== '/' && (
        <Breadcrumbs pb={10} fw="bolder">
          {breadCrumbsItem}
        </Breadcrumbs>
      )}
      <Box pb="lg" mt={5}>
        <Routes>{renderPageTitle()}</Routes>
      </Box>
      <Routes>{renderRoutes()}</Routes>
    </MainShell>
  );
};
