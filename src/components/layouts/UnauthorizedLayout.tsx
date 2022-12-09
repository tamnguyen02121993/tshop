import { FC } from 'react';
import { Outlet } from 'react-router-dom';

const UnauthorizedLayout: FC = () => {
  return <Outlet />;
};

export default UnauthorizedLayout;
