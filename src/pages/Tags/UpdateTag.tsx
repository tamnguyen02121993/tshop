import { Form, Input, Modal, Select } from 'antd';
import { FC, useEffect } from 'react';
import { ICreateTagRequest, IUpdateTagRequest, Mode } from '../../interfaces';
import { errorMessage, STATUS, transformStatus } from '../../utils';

interface IUpdateTagProps {
  mode: Mode;
  open: boolean;
  initialValues?: ICreateTagRequest | IUpdateTagRequest;
  handleCancel?: () => void;
  handleSubmit?: (values: ICreateTagRequest | IUpdateTagRequest) => void;
}

const UpdateTag: FC<IUpdateTagProps> = ({
  mode,
  open,
  handleCancel,
  handleSubmit,
  initialValues,
}: IUpdateTagProps) => {
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
          name="title"
          label="Title"
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
        <Form.Item name="status" label="Status">
          <Select options={transformStatus(STATUS)} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateTag;
