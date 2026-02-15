import { ReactNode } from 'react';

export interface SubRoute {
  /**
   * If `index` is true, that subroute will become the main page
   * when a user visits a main route.
   */
  index?: boolean;

  /**
   * The path specified for the page. DO NOT USE A LEADING SLASH (/).
   * Instead, just specify the path directly. Example: "list", "detail/:id", etc.
   */
  path: string;

  component: React.ReactNode;

  /**
   * Unique identifier of a page. This should be prefixed with the
   * path of the main route. This key can also later be used to set
   * permissions to determine whether a user can access a certain
   * page or not.
   */
  key: string;

  /**
   * Title of the page
   */
  title: string;

  /**
   * If this boolean is true, then the subroute will be rendered as a
   * sidebar menu item with its title as the label.
   */
  isSidebarMenu?: boolean;

  /**
   * If set, the sidebar item and page are only visible/accessible to users with at least one of these roles.
   */
  requiredRoles?: string[];

  icon?: React.ReactNode;
}

export interface MainRoute {
  path: string;
  icon?: ReactNode;
  subRoutes: SubRoute[];
  key: string;
  title: string;
  /** When true, sidebar shows this route as expandable parent with sub-routes as children */
  sidebarAsGroup?: boolean;
}

export interface BreadCrumbsRoute {
  route: string;
  title: string;
}
