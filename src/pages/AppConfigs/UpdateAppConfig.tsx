import { Form, Input, Modal, Select } from 'antd';
import { FC, useEffect } from 'react';
import {
  ICreateAppConfigRequest,
  IUpdateAppConfigRequest,
  Mode,
} from '../../interfaces';
import { errorMessage, STATUS, transformStatus } from '../../utils';

interface IUpdateAppConfigProps {
  mode: Mode;
  open: boolean;
  initialValues?: ICreateAppConfigRequest | IUpdateAppConfigRequest;
  handleCancel?: () => void;
  handleSubmit?: (
    values: ICreateAppConfigRequest | IUpdateAppConfigRequest
  ) => void;
}

const UpdateAppConfig: FC<IUpdateAppConfigProps> = ({
  mode,
  open,
  handleCancel,
  handleSubmit,
  initialValues,
}: IUpdateAppConfigProps) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        handleSubmit && handleSubmit(values);
        handleCancel && handleCancel();
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [initialValues]);

  return (
    <Modal
      title={`${mode === 'create' ? 'Create' : 'Edit'} app config`}
      open={open}
      bodyStyle={{ padding: '16px' }}
      onOk={handleOk}
      onCancel={() => handleCancel && handleCancel()}
    >
      <Form
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        form={form}
        autoComplete="off"
        initialValues={initialValues}
      >
        {mode === 'edit' && (
          <Form.Item hidden name="id" required>
            <Input />
          </Form.Item>
        )}
        <Form.Item
          name="key"
          label="Key"
          required
          rules={[
            {
              required: true,
              message: errorMessage.required,
            },
            {
              max: 500,
              message: errorMessage.length(500),
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="value"
          label="Value"
          required
          rules={[
            {
              required: true,
              message: errorMessage.required,
            },
            {
              max: 500,
              message: errorMessage.length(500),
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="status" label="Status">
          <Select options={transformStatus(STATUS)} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateAppConfig;
