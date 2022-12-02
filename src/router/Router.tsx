import { createBrowserRouter } from 'react-router-dom';
import { AuthorizedLayout } from '../components/layouts';
import {
  ListCategories,
  ListTags,
  ListBrands,
  ListAppConfigs,
  ListContacts,
  ListProducts,
} from '../pages';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthorizedLayout />,
    children: [
      {
        path: 'categories',
        element: <ListCategories />,
      },
      {
        path: 'brands',
        element: <ListBrands />,
      },
      {
        path: 'tags',
        element: <ListTags />,
      },
      {
        path: 'app-configs',
        element: <ListAppConfigs />,
      },
      {
        path: 'contacts',
        element: <ListContacts />,
      },
      {
        path: 'products',
        element: <ListProducts />,
      },
    ],
  },
]);
