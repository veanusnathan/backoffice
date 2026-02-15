import { homeRoutes } from './home';
import { domainRoutes } from './domain';
import { userRoutes } from './user';
import { MainRoute } from './types';

export const routes: MainRoute[] = [homeRoutes, domainRoutes, userRoutes];
