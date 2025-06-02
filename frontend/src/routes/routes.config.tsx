import Books from '@/pages/Books';
import Authors from '@/pages/Authors';
import Genres from '@/pages/Genres';
import Logs from '@/pages/Logs';
import Publishers from '@/pages/Publishers';
import Users from '@/pages/Users';

export interface AppRoute {
  path: string;
  label: string;
  element: React.ReactNode;
  roles: string[];
}

export const protectedRoutes: AppRoute[] = [
  {
    path: '/books',
    label: 'Books',
    element: <Books />,
    roles: ['user', 'admin', 'superadmin'],
  },
  {
    path: '/authors',
    label: 'Authors',
    element: <Authors />,
    roles: ['admin', 'superadmin'],
  },
  {
    path: '/genres',
    label: 'Genres',
    element: <Genres />,
    roles: ['admin', 'superadmin'],
  },
  {
    path: '/logs',
    label: 'Logs',
    element: <Logs />,
    roles: ['admin', 'superadmin'],
  },
  {
    path: '/publishers',
    label: 'Publishers',
    element: <Publishers />,
    roles: ['admin', 'superadmin'],
  },
  {
    path: '/users',
    label: 'Users',
    element: <Users />,
    roles: ['admin', 'superadmin'],
  },
];
