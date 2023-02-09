import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { QueryClient, QueryClientProvider } from 'react-query';

import AppLayout from './layouts/AppLayout/AppLayout';
import Welcome from './pages/Welcome/Welcome';
import DigitalSignagePlayer from './pages/DigitalPlayer/DigitalPlayer';
import Playlist from './components/Playlist/Playlist';
import Playlists from './components/Playlists/Playlists';
import PlaylistManagement from './pages/PlaylistManagement/PlaylistManagement';
import ErrorPage from './pages/Error/Error';
import { ROUTES } from './common/contants';
import appTheme from './common/theme';

import 'antd/dist/reset.css';
import './App.scss';

// Define routes for the application
const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <AppLayout />,
    children: [
      {
        path: ROUTES.HOME,
        element: <Welcome />
      },
      {
        path: ROUTES.PLAYER,
        element: <DigitalSignagePlayer />
      },
      {
        path: ROUTES.PLAYLISTS,
        element: <PlaylistManagement />,
        children: [
          { path: '', element: <Playlists /> },
          { path: ':playlistId', element: <Playlist /> }
        ]
      },
      {
        path: '*',
        element: <ErrorPage />
      }
    ]
  }
]);

const App = () => {
  const queryClient = new QueryClient();
  return (
    <ConfigProvider theme={appTheme}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ConfigProvider>
  );
};

export default App;
