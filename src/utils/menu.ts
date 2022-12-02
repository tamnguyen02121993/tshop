import { ReactNode, Key } from 'react';
import type { MenuProps } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

export function getItem(
  label: ReactNode,
  key: Key,
  icon?: ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

export const menuItems: MenuProps['items'] = [
  getItem('Categories', `/categories`),
  getItem('Brands', `/brands`),
  getItem('Contacts', `/contacts`),
  getItem('App Configs', `/app-configs`),
  getItem('Tags', `/tags`),
  getItem('Products', `/products`),
];
