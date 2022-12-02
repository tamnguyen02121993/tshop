import { FC } from 'react';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import { menuItems } from '../../utils';

const Sidebar: FC = () => {
  const navigate = useNavigate();
  const onClick: MenuProps['onClick'] = (e) => {
    navigate(e.key);
  };

  return <Menu onClick={onClick} mode="inline" items={menuItems} />;
};

export default Sidebar;
