import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '@/pages/Login';
import AccessDenied from '@/pages/AccessDenied';
import { ProtectedRoute } from './ProtectedRoute';
import SidebarLayout from '@/layouts/SidebarLayout';
import { protectedRoutes } from './routes.config';

export default function AppRouter() {
  return (
    <Routes>
      {}
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/books" replace />} />
      <Route path="/denied" element={<AccessDenied />} />

      {}
      <Route
        element={
          <ProtectedRoute roles={['user', 'admin', 'superadmin']}>
            <SidebarLayout />
          </ProtectedRoute>
        }
      >
        {protectedRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Route>
    </Routes>
  );
}
