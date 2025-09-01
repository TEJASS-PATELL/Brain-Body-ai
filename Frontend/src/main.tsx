import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import HomePage from './Pages/Home';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import ErrorPage from './Pages/ErrorPage';
import ProtectedRoute from './Components/ProtectedRoute';
import Features from './Pages/Features';
import Loader from './Components/Loader';

const LazyChatbot = React.lazy(() => import('./Pages/Chatbot'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: '/login', element: <Login /> },
      { path: '/signup', element: <Signup /> },
      { path: '/chatbot/features', element: <Features /> },
      {
        path: '/chatbot',
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<Loader text="Loading Brain+Body AI...." />}>
                <LazyChatbot />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
