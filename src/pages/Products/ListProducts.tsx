import { FC, useState } from 'react';
import {
  Card,
  Table,
  Space,
  Button,
  Tooltip,
  Popconfirm,
  message,
  Image,
  Input,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  FileImageOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  IProductResponse,
  ICreateProductRequest,
  IUpdateProductRequest,
  Mode,
  IUpdateProductImagesRequest,
} from '../../interfaces';
import { ProductsService } from '../../services/';
import {
  commonMessage,
  defaultCreateProductRequest,
  DEFAULT_PAGE_SIZE,
  DEFAULT_STATE_TIME,
  fallbackImage,
  keys,
} from '../../utils';
import { UpdateImages, UpdateProduct } from '.';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usePagination } from '../../hooks';

const { Search } = Input;

const ListProducts: FC = () => {
  const [isOpenUpdateProductModal, setIsOpenUpdateProductModal] =
    useState<boolean>(false);
  const [isOpenUpdateImagesModal, setIsOpenUpdateImagesModal] =
    useState<boolean>(false);
  const [mode, setMode] = useState<Mode>('create');
  const [initialValues, setInitialValues] = useState<
    ICreateProductRequest | IUpdateProductRequest
  >();
  const [selectedProduct, setSelectedProduct] = useState<IProductResponse>();

  const { onPageChange, paginationFilter, onSearch } = usePagination();

  const queryClient = useQueryClient();

  const { isLoading, data } = useQuery({
    queryKey: [keys.products.fetchAllProductsPagination, paginationFilter],
    queryFn: () => ProductsService.fetchAllProductsPagination(paginationFilter),
    staleTime: DEFAULT_STATE_TIME,
    keepPreviousData: true,
  });

  const createProductMutation = useMutation({
    mutationKey: [keys.products.createProduct],
    mutationFn: (payload: ICreateProductRequest) =>
      ProductsService.createProduct(payload),
  });

  const updateProductMutation = useMutation({
    mutationKey: [keys.products.updateProduct],
    mutationFn: (payload: IUpdateProductRequest) =>
      ProductsService.updateProduct(payload),
  });

  const updateProductImagesMutation = useMutation({
    mutationKey: [keys.products.updateProductImages],
    mutationFn: (payload: IUpdateProductImagesRequest) =>
      ProductsService.updateProductImages(payload),
  });

  const deleteProductMutation = useMutation({
    mutationKey: [keys.products.deleteProduct],
    mutationFn: (payload: string) => ProductsService.deleteProduct(payload),
  });

  const refreshListProducts = () => {
    queryClient.invalidateQueries({
      queryKey: [keys.products.fetchAllProductsPagination, paginationFilter],
    });
  };

  const handleConfirmDelete = async (id: string) => {
    await deleteProductMutation.mutateAsync(id, {
      onSuccess: refreshListProducts,
    });
    if (deleteProductMutation.isSuccess) {
      message.success(commonMessage.deleteSuccessfully);
    } else if (deleteProductMutation.isError) {
      message.error(commonMessage.deleteFailure);
    }
  };

  const handleSort =
    (property: keyof Omit<IProductResponse, 'id'>) =>
    (a: IProductResponse, b: IProductResponse) => {
      const left = a[property];
      const right = b[property];
      if (!left && !right) {
        return 0;
      } else if (left && !right) {
        return left.toString().localeCompare('');
      } else if (!left && right) {
        return ''.localeCompare(right.toString());
      } else return left!.toString().localeCompare(right!.toString());
    };

  const handleOpenUpdateProductModal = (item?: IProductResponse) => {
    const mode = item ? 'edit' : 'create';
    const initialValues = !item
      ? defaultCreateProductRequest
      : ({
          id: item.id,
          name: item.name,
          categoryId: item.categoryId,
          brandId: item.brandId,
          imageUrl: item.imageUrl,
          isFavoriteProduct: item.isFavoriteProduct,
          isFeaturedProduct: item.isFavoriteProduct,
          isNewProduct: item.isNewProduct,
          price: item.price,
          quantity: item.quantity,
          warranty: item.warranty,
          description: item.description,
          salePrice: item.salePrice,
          status: item.status,
          tags: item.tags,
        } as IUpdateProductRequest);
    setMode(mode);
    setIsOpenUpdateProductModal(true);
    setInitialValues(initialValues);
  };

  const handleOpenUpdateImagesModal = (item: IProductResponse) => {
    setIsOpenUpdateImagesModal(true);
    setMode('edit');
    setSelectedProduct(item);
  };

  const handleSubmit = async (
    values: ICreateProductRequest | IUpdateProductRequest
  ) => {
    if (mode === 'create') {
      await createProductMutation.mutateAsync(values, {
        onSuccess: refreshListProducts,
      });
      if (createProductMutation.isSuccess) {
        message.success(commonMessage.createSuccessfully);
      } else if (createProductMutation.isError) {
        message.error(commonMessage.createFailure);
      }
    } else {
      await updateProductMutation.mutateAsync(values as IUpdateProductRequest, {
        onSuccess: refreshListProducts,
      });
      if (updateProductMutation.isSuccess) {
        message.success(commonMessage.updateSuccessfully);
      } else if (updateProductMutation.isError) {
        message.error(commonMessage.updateFailure);
      }
    }
  };

  const handleUpdateImages = async (values: any) => {
    await updateProductImagesMutation.mutateAsync(
      {
        id: selectedProduct?.id!,
        images: values,
      },
      {
        onSuccess: () => {
          refreshListProducts();
          message.success(commonMessage.updateSuccessfully);
          setIsOpenUpdateImagesModal(false);
        },
      }
    );
  };

  return (
    <Card title={'Products'} className={'m-16'}>
      <div className="py-16 flex">
        <Tooltip title="Create product">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleOpenUpdateProductModal()}
          >
            Create product
          </Button>
        </Tooltip>
        <div className="ml-auto">
          <Search
            placeholder="Enter your search text"
            onSearch={onSearch}
            enterButton
            allowClear
          />
        </div>
      </div>
      <Table
        rowKey={(data) => data.id}
        dataSource={data?.data.data}
        sticky
        pagination={{
          pageSize: paginationFilter.pageSize,
          current: paginationFilter.pageIndex + 1,
          total: data?.data.totalRows,
          showSizeChanger: true,
          pageSizeOptions: DEFAULT_PAGE_SIZE,
          onChange: onPageChange,
        }}
      >
        <Table.Column
          title="Name"
          dataIndex={'name'}
          key={'name'}
          sorter={handleSort('name')}
        />

        <Table.Column
          title="Warranty"
          dataIndex={'warranty'}
          key={'warranty'}
          render={(_, record: IProductResponse) => {
            return (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Image
                  width={100}
                  height={100}
                  src={record.imageUrl}
                  fallback={fallbackImage}
                />
              </div>
            );
          }}
        />

        <Table.Column
          title="Price"
          dataIndex={'price'}
          key={'price'}
          sorter={handleSort('price')}
        />

        <Table.Column
          title="Warranty"
          dataIndex={'warranty'}
          key={'warranty'}
          sorter={handleSort('warranty')}
        />

        <Table.Column
          title="Quantity"
          dataIndex={'quantity'}
          key={'quantity'}
          sorter={handleSort('quantity')}
        />

        <Table.Column
          title="Status"
          dataIndex={'status'}
          key={'status'}
          sorter={handleSort('status')}
        />

        <Table.Column
          title="Actions"
          key={'actions'}
          render={(_, record: IProductResponse) => (
            <Space size="middle">
              <Tooltip title="Update">
                <Button
                  type="primary"
                  shape="circle"
                  icon={<EditOutlined />}
                  onClick={() => handleOpenUpdateProductModal(record)}
                ></Button>
              </Tooltip>
              <Popconfirm
                title={commonMessage.confirmDelete}
                onConfirm={() => handleConfirmDelete(record.id)}
                okText="Yes"
                cancelText="No"
              >
                <Tooltip title="Delete">
                  <Button
                    type="primary"
                    shape="circle"
                    danger
                    icon={<DeleteOutlined />}
                  ></Button>
                </Tooltip>
              </Popconfirm>
              <Tooltip title="Add images">
                <Button
                  type="primary"
                  shape="circle"
                  icon={<FileImageOutlined />}
                  onClick={() => handleOpenUpdateImagesModal(record)}
                ></Button>
              </Tooltip>
            </Space>
          )}
        />
      </Table>

      <UpdateProduct
        mode={mode}
        open={isOpenUpdateProductModal}
        initialValues={initialValues}
        handleCancel={() => setIsOpenUpdateProductModal(false)}
        handleSubmit={handleSubmit}
      />

      <UpdateImages
        open={isOpenUpdateImagesModal}
        handleCancel={() => setIsOpenUpdateImagesModal(false)}
        handleSubmit={handleUpdateImages}
        initialValues={selectedProduct?.images || []}
      />
    </Card>
  );
};

export default ListProducts;
