import { Form, Input, Modal, Select } from 'antd';
import { FC, useEffect } from 'react';
import {
  ICreateCategoryRequest,
  IUpdateCategoryRequest,
  Mode,
} from '../../interfaces';
import { errorMessage, STATUS, transformStatus } from '../../utils';

interface IUpdateCategoryProps {
  mode: Mode;
  open: boolean;
  initialValues?: ICreateCategoryRequest | IUpdateCategoryRequest;
  handleCancel?: () => void;
  handleSubmit?: (
    values: ICreateCategoryRequest | IUpdateCategoryRequest
  ) => void;
}

const UpdateCategory: FC<IUpdateCategoryProps> = ({
  mode,
  open,
  handleCancel,
  handleSubmit,
  initialValues,
}: IUpdateCategoryProps) => {
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
      title={`${mode === 'create' ? 'Create' : 'Edit'} category`}
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
          name="name"
          label="Name"
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
          name="description"
          label="Description"
          rules={[
            {
              max: 500,
              message: errorMessage.length(500),
            },
          ]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item name="status" label="Status">
          <Select options={transformStatus(STATUS)} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateCategory;
