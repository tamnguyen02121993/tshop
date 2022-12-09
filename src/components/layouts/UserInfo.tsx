import { UserOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Avatar, Dropdown, MenuProps } from 'antd';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks';
import { AuthenticationService } from '../../services';
import { keys } from '../../utils';

const items: MenuProps['items'] = [
  {
    key: '1',
    label: 'Signout',
  },
];

const UserInfo: FC = () => {
  const { userInfo, clearUserInfor } = useAuth();
  const navigate = useNavigate();

  const revokeTokenMutation = useMutation({
    mutationKey: [keys.accounts.revokeToken],
    mutationFn: (name: string) => AuthenticationService.revoke(name),
  });

  const onClick: MenuProps['onClick'] = async ({ key }) => {
    switch (key) {
      case '1':
        await revokeTokenMutation.mutateAsync(userInfo.name);
        clearUserInfor();
        navigate('/login');
        break;
      default:
    }
  };
  return (
    <>
      <span>{userInfo.name}</span>
      <Dropdown menu={{ items, onClick }}>
        <Avatar icon={<UserOutlined />} />
      </Dropdown>
    </>
  );
};

export default UserInfo;
