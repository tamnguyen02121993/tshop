import { FC, useState } from 'react';
import {
  Card,
  Table,
  Space,
  Button,
  Tooltip,
  Popconfirm,
  message,
  Input,
} from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import {
  IBrandResponse,
  ICreateBrandRequest,
  IUpdateBrandRequest,
  Mode,
} from '../../interfaces';
import { BrandsService } from '../../services/';
import {
  commonMessage,
  defaultCreateBrandRequest,
  DEFAULT_PAGE_SIZE,
  DEFAULT_STATE_TIME,
  keys,
} from '../../utils';
import { UpdateBrand } from '.';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usePagination } from '../../hooks';

const { Search } = Input;

const ListBrands: FC = () => {
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState<boolean>(false);
  const [mode, setMode] = useState<Mode>('create');
  const [initialValues, setInitialValues] = useState<
    ICreateBrandRequest | IUpdateBrandRequest
  >();

  const { onPageChange, paginationFilter, onSearch } = usePagination();

  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: [keys.brands.fetchAllBrandsPagination, paginationFilter],
    queryFn: () => BrandsService.fetchAllBrandsPagination(paginationFilter),
    staleTime: DEFAULT_STATE_TIME,
    keepPreviousData: true,
  });

  const createBrandMutation = useMutation({
    mutationKey: [keys.brands.createBrand],
    mutationFn: (payload: ICreateBrandRequest) =>
      BrandsService.createBrand(payload),
  });

  const updateBrandMutation = useMutation({
    mutationKey: [keys.brands.updateBrand],
    mutationFn: (payload: IUpdateBrandRequest) =>
      BrandsService.updateBrand(payload),
  });

  const deleteBrandMutation = useMutation({
    mutationKey: [keys.brands.deleteBrand],
    mutationFn: (payload: number) => BrandsService.deleteBrand(payload),
  });

  const refreshListBrands = () => {
    queryClient.invalidateQueries({
      queryKey: [keys.brands.fetchAllBrandsPagination, paginationFilter],
    });
  };

  const handleConfirmDelete = async (id: number) => {
    await deleteBrandMutation.mutateAsync(id, {
      onSuccess: refreshListBrands,
    });
    if (deleteBrandMutation.isSuccess) {
      message.success(commonMessage.deleteSuccessfully);
    } else if (deleteBrandMutation.isError) {
      message.error(commonMessage.deleteFailure);
    }
  };

  const handleSort =
    (property: keyof Omit<IBrandResponse, 'id'>) =>
    (a: IBrandResponse, b: IBrandResponse) => {
      const left = a[property];
      const right = b[property];
      if (!left && !right) {
        return 0;
      } else if (left && !right) {
        return left.localeCompare('');
      } else if (!left && right) {
        return ''.localeCompare(right);
      } else return left!.localeCompare(right!);
    };

  const handleOpenUpdateModal = (item?: IBrandResponse) => {
    const mode = item ? 'edit' : 'create';
    const initialValues = !item
      ? defaultCreateBrandRequest
      : ({
          id: item.id,
          name: item.name,
          status: item.status,
          summary: item.summary,
        } as IUpdateBrandRequest);
    setMode(mode);
    setIsOpenUpdateModal(true);
    setInitialValues(initialValues);
  };

  const handleSubmit = async (
    values: ICreateBrandRequest | IUpdateBrandRequest
  ) => {
    if (mode === 'create') {
      await createBrandMutation.mutateAsync(values, {
        onSuccess: refreshListBrands,
      });
      if (createBrandMutation.isSuccess) {
        message.success(commonMessage.createSuccessfully);
      } else if (createBrandMutation.isError) {
        message.error(commonMessage.createFailure);
      }
    } else {
      await updateBrandMutation.mutateAsync(values as IUpdateBrandRequest, {
        onSuccess: refreshListBrands,
      });
      if (updateBrandMutation.isSuccess) {
        message.success(commonMessage.updateSuccessfully);
      } else if (updateBrandMutation.isError) {
        message.error(commonMessage.updateFailure);
      }
    }
  };

  return (
    <Card title={'Brands'} className={'m-16'}>
      <div className="py-16 flex">
        <Tooltip title="Create brand">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleOpenUpdateModal()}
          >
            Create brand
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
          title="Summary"
          dataIndex={'summary'}
          key={'summary'}
          sorter={handleSort('summary')}
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
          render={(_, record: IBrandResponse) => (
            <Space size="middle">
              <Tooltip title="Update">
                <Button
                  type="primary"
                  shape="circle"
                  icon={<EditOutlined />}
                  onClick={() => handleOpenUpdateModal(record)}
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
            </Space>
          )}
        />
      </Table>

      <UpdateBrand
        mode={mode}
        open={isOpenUpdateModal}
        initialValues={initialValues}
        handleCancel={() => setIsOpenUpdateModal(false)}
        handleSubmit={handleSubmit}
      />
    </Card>
  );
};

export default ListBrands;
