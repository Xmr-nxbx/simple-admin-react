import { createBrowserRouter, Navigate } from 'react-router-dom';

import LoginPage from '@/pages/Login';
import Error404 from '@/pages/ErrorPages/404';

const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="login" replace />
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '*',
    element: <Error404 />,
  }
]);

export default router;