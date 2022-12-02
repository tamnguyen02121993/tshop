import { FC } from 'react';
import { Sidebar } from './';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Divider, Typography } from 'antd';
import { Link, Outlet } from 'react-router-dom';
import './AuthorizedLayout.scss';

const { Title } = Typography;

const AuthorizedLayout: FC = () => {
  return (
    <div className="authorized-layout">
      <div className="left-layout">
        <Title level={3} className="heading-text">
          <Link to={'/'}>T Shop</Link>
        </Title>

        <Divider />
        <Sidebar />
      </div>
      <div className="right-layout">
        <div className="header">
          <div className="right-header">
            <span>Tam Nguyen</span>
            <Avatar icon={<UserOutlined />} />
          </div>
        </div>
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthorizedLayout;
