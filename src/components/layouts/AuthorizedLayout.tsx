import { FC } from 'react';
import { Sidebar, UserInfo } from './';
import { Divider, Typography } from 'antd';
import { Link, Navigate, Outlet } from 'react-router-dom';
import './AuthorizedLayout.scss';
import { useAuth } from '../../hooks';

const { Title } = Typography;

const AuthorizedLayout: FC = () => {
  const { userInfo } = useAuth();
  return userInfo.isAuthenticated ? (
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
            <UserInfo />
          </div>
        </div>
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <Navigate to={'/login'} />
  );
};

export default AuthorizedLayout;
