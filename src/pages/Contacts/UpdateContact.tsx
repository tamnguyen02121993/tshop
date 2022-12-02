import { Form, Input, Modal, Select } from 'antd';
import { FC, useEffect } from 'react';
import {
  ICreateContactRequest,
  IUpdateContactRequest,
  Mode,
} from '../../interfaces';
import { CONTACT_STATUS, errorMessage, transformStatus } from '../../utils';

interface IUpdateContactProps {
  mode: Mode;
  open: boolean;
  initialValues?: ICreateContactRequest | IUpdateContactRequest;
  handleCancel?: () => void;
  handleSubmit?: (
    values: ICreateContactRequest | IUpdateContactRequest
  ) => void;
}

const UpdateContact: FC<IUpdateContactProps> = ({
  mode,
  open,
  handleCancel,
  handleSubmit,
  initialValues,
}: IUpdateContactProps) => {
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
      title={`${mode === 'create' ? 'Create' : 'Edit'} tag`}
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
          name="email"
          label="Email"
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
          name="phoneNumber"
          label="Phone Number"
          required
          rules={[
            {
              required: true,
              message: errorMessage.required,
            },
            {
              max: 20,
              message: errorMessage.length(20),
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="content"
          label="Content"
          required
          rules={[
            {
              required: true,
              message: errorMessage.required,
            },
          ]}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item name="status" label="Status">
          <Select options={transformStatus(CONTACT_STATUS)} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateContact;
