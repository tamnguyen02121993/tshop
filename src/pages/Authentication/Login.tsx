import { useMutation } from '@tanstack/react-query';
import { Button, Form, Input } from 'antd';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks';
import { ILoginRequest } from '../../interfaces';
import { AuthenticationService } from '../../services';
import { errorMessage, keys } from '../../utils';
import './Login.scss';

const initialValues: ILoginRequest = {
  password: '',
  userName: '',
  rememberMe: false,
};

const Login: FC = () => {
  const [form] = Form.useForm();
  const { storeUserInfoToLocalStorage } = useAuth();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationKey: [keys.accounts.login],
    mutationFn: (payload: ILoginRequest) =>
      AuthenticationService.login(payload),
  });

  const handleSubmit = async (values: ILoginRequest) => {
    const result = await loginMutation.mutateAsync(values);
    storeUserInfoToLocalStorage({
      accessToken: result.data.accessToken,
      name: result.data.name,
      refreshToken: result.data.refreshToken,
      audience: result.data.audience,
      issuer: result.data.issuer,
      isAuthenticated: !!result.data.accessToken,
    });

    navigate('/categories');
  };

  return (
    <div className="login__page flex-center">
      <Form
        layout="horizontal"
        className="login__form"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        form={form}
        autoComplete="off"
        initialValues={initialValues}
        onFinish={handleSubmit}
      >
        <Form.Item
          name="userName"
          label="User Name"
          required
          rules={[
            {
              required: true,
              message: errorMessage.required,
            },
            {
              max: 255,
              message: errorMessage.length(255),
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          required
          rules={[
            {
              required: true,
              message: errorMessage.required,
            },
            {
              max: 255,
              message: errorMessage.length(255),
            },
          ]}
        >
          <Input type="password" />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 6, span: 24 }}>
          <Button htmlType="submit">Login</Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default Login;
