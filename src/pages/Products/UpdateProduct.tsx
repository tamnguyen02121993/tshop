import { useQuery } from '@tanstack/react-query';
import {
  Checkbox,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Image,
  Spin,
} from 'antd';
import { FC, useEffect, useState } from 'react';
import {
  IBrandResponse,
  ICategoryResponse,
  ICreateProductRequest,
  ISelectOption,
  ITagResponse,
  IUpdateProductRequest,
  Mode,
} from '../../interfaces';
import { BrandsService, CategoriesService, TagsService } from '../../services';
import {
  DEFAULT_STATE_TIME,
  errorMessage,
  fallbackImage,
  keys,
  STATUS,
  transformStatus,
  transformToSelectOption,
} from '../../utils';

interface IUpdateProductProps {
  mode: Mode;
  open: boolean;
  initialValues?: ICreateProductRequest | IUpdateProductRequest;
  handleCancel?: () => void;
  handleSubmit?: (
    values: ICreateProductRequest | IUpdateProductRequest
  ) => void;
}

const UpdateProduct: FC<IUpdateProductProps> = ({
  mode,
  open,
  handleCancel,
  handleSubmit,
  initialValues,
}: IUpdateProductProps) => {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState<ISelectOption[]>([]);
  const [brands, setBrands] = useState<ISelectOption[]>([]);
  const [tags, setTags] = useState<ISelectOption[]>([]);
  const [imageUrl, setImageUrl] = useState<string>();

  const categoriesQuery = useQuery({
    queryKey: [keys.categories.fetchAvailableCategories],
    queryFn: CategoriesService.fetchAvailableCategories,
    staleTime: DEFAULT_STATE_TIME,
    onSuccess: (response) => {
      const options = transformToSelectOption<ICategoryResponse>(
        response.data,
        'id',
        'name',
        {
          value: 0,
          label: 'Select category',
          disabled: true,
        }
      );
      setCategories(options);
    },
  });

  const brandsQuery = useQuery({
    queryKey: [keys.brands.fetchAvailableBrands],
    queryFn: BrandsService.fetchAvailableBrands,
    staleTime: DEFAULT_STATE_TIME,
    onSuccess: (response) => {
      const options = transformToSelectOption<IBrandResponse>(
        response.data,
        'id',
        'name',
        {
          value: 0,
          label: 'Select brand',
          disabled: true,
        }
      );
      setBrands(options);
    },
  });

  const tagsQuery = useQuery({
    queryKey: [keys.tags.fetchAvailableTags],
    queryFn: TagsService.fetchAvailableTags,
    staleTime: DEFAULT_STATE_TIME,
    onSuccess: (response) => {
      const options = transformToSelectOption<ITagResponse>(
        response.data,
        'id',
        'title',
        {
          value: 0,
          label: 'Select tags',
          disabled: true,
        }
      );
      setTags(options);
    },
  });

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

  const handleValuesChange = (changedValues: any, values: any) => {
    if (![undefined, null].includes(changedValues.imageUrl)) {
      setImageUrl(changedValues.imageUrl);
    }
  };

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [initialValues]);

  return (
    <Modal
      title={`${mode === 'create' ? 'Create' : 'Edit'} product`}
      open={open}
      bodyStyle={{ padding: '16px' }}
      onOk={handleOk}
      onCancel={() => handleCancel && handleCancel()}
    >
      <Form
        layout="horizontal"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        form={form}
        autoComplete="off"
        initialValues={initialValues}
        onValuesChange={handleValuesChange}
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
              max: 500,
              message: errorMessage.length(500),
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          required
          rules={[
            {
              required: true,
              message: errorMessage.required,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="price"
          label="Price"
          required
          rules={[
            {
              required: true,
              message: errorMessage.required,
            },
          ]}
        >
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item name="salePrice" label="Sale Price">
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item
          name="warranty"
          label="Warranty"
          required
          rules={[
            {
              required: true,
              message: errorMessage.required,
            },
          ]}
        >
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item
          name="quantity"
          label="Quantity"
          required
          rules={[
            {
              required: true,
              message: errorMessage.required,
            },
          ]}
        >
          <InputNumber min={1} />
        </Form.Item>

        <Form.Item
          label="Image Url"
          name="imageUrl"
          required
          rules={[
            {
              required: true,
              message: errorMessage.required,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '24px',
          }}
        >
          <Image
            width={100}
            height={100}
            src={imageUrl}
            fallback={fallbackImage}
            placeholder={
              <div className="flex-center">
                <Spin />
              </div>
            }
          />
        </div>

        <Form.Item
          name="isNewProduct"
          label="New Product?"
          rules={[
            {
              required: true,
              message: errorMessage.required,
            },
          ]}
        >
          <Checkbox />
        </Form.Item>

        <Form.Item
          name="isFeaturedProduct"
          label="Featured Product?"
          required
          rules={[
            {
              required: true,
              message: errorMessage.required,
            },
          ]}
        >
          <Checkbox />
        </Form.Item>

        <Form.Item
          name="isFavoriteProduct"
          label="Favorite Product?"
          required
          rules={[
            {
              required: true,
              message: errorMessage.required,
            },
          ]}
        >
          <Checkbox />
        </Form.Item>

        <Form.Item
          name="categoryId"
          label="Category"
          required
          rules={[
            {
              required: true,
              message: errorMessage.required,
            },
          ]}
        >
          <Select options={categories} />
        </Form.Item>

        <Form.Item
          name="brandId"
          label="Brand"
          required
          rules={[
            {
              required: true,
              message: errorMessage.required,
            },
          ]}
        >
          <Select options={brands} />
        </Form.Item>

        <Form.Item name="tags" label="Tags">
          <Select options={tags} mode="tags" />
        </Form.Item>

        <Form.Item name="status" label="Status">
          <Select options={transformStatus(STATUS)} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateProduct;
