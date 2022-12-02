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
  ICategoryResponse,
  ICreateCategoryRequest,
  IUpdateCategoryRequest,
  Mode,
} from '../../interfaces';
import { CategoriesService } from '../../services/';
import {
  commonMessage,
  defaultCreateCategoryRequest,
  DEFAULT_PAGE_SIZE,
  DEFAULT_STATE_TIME,
  keys,
} from '../../utils';
import { UpdateCategory } from '.';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usePagination } from '../../hooks';

const { Search } = Input;

const ListCategories: FC = () => {
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState<boolean>(false);
  const [mode, setMode] = useState<Mode>('create');
  const [initialValues, setInitialValues] = useState<
    ICreateCategoryRequest | IUpdateCategoryRequest
  >();

  const { onPageChange, paginationFilter, onSearch } = usePagination();

  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: [keys.categories.fetchAllCategoriesPagination, paginationFilter],
    queryFn: () =>
      CategoriesService.fetchAllCategoriesPagination(paginationFilter),
    staleTime: DEFAULT_STATE_TIME,
    keepPreviousData: true,
  });

  const createCategoryMutation = useMutation({
    mutationKey: [keys.categories.createCategory],
    mutationFn: (payload: ICreateCategoryRequest) =>
      CategoriesService.createCategory(payload),
  });

  const updateCategoryMutation = useMutation({
    mutationKey: [keys.categories.updateCategory],
    mutationFn: (payload: IUpdateCategoryRequest) =>
      CategoriesService.updateCategory(payload),
  });

  const deleteCategoryMutation = useMutation({
    mutationKey: [keys.categories.deleteCategory],
    mutationFn: (payload: number) => CategoriesService.deleteCategory(payload),
  });

  const refreshListCategories = () => {
    queryClient.invalidateQueries({
      queryKey: [
        keys.categories.fetchAllCategoriesPagination,
        paginationFilter,
      ],
    });
  };

  const handleConfirmDelete = async (id: number) => {
    await deleteCategoryMutation.mutateAsync(id, {
      onSuccess: refreshListCategories,
    });
    if (deleteCategoryMutation.isSuccess) {
      message.success(commonMessage.deleteSuccessfully);
    } else if (deleteCategoryMutation.isError) {
      message.success(commonMessage.deleteFailure);
    }
  };

  const handleSort =
    (property: keyof Omit<ICategoryResponse, 'id'>) =>
    (a: ICategoryResponse, b: ICategoryResponse) => {
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

  const handleOpenUpdateModal = (item?: ICategoryResponse) => {
    const mode = item ? 'edit' : 'create';
    const initialValues = !item
      ? defaultCreateCategoryRequest
      : ({
          id: item.id,
          name: item.name,
          status: item.status,
          description: item.description,
        } as IUpdateCategoryRequest);
    setMode(mode);
    setIsOpenUpdateModal(true);
    setInitialValues(initialValues);
  };

  const handleSubmit = async (
    values: ICreateCategoryRequest | IUpdateCategoryRequest
  ) => {
    if (mode === 'create') {
      await createCategoryMutation.mutateAsync(values, {
        onSuccess: refreshListCategories,
      });
      if (createCategoryMutation.isSuccess) {
        message.success(commonMessage.createSuccessfully);
      } else if (createCategoryMutation.isError) {
        message.success(commonMessage.createFailure);
      }
    } else {
      await updateCategoryMutation.mutateAsync(
        values as IUpdateCategoryRequest,
        {
          onSuccess: refreshListCategories,
        }
      );
      if (updateCategoryMutation.isSuccess) {
        message.success(commonMessage.updateSuccessfully);
      } else if (updateCategoryMutation.isError) {
        message.success(commonMessage.updateFailure);
      }
    }
  };

  return (
    <Card title={'Categories'} className={'m-16'}>
      <div className="py-16 flex">
        <Tooltip title="Create category">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleOpenUpdateModal()}
          >
            Create category
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
          title="Description"
          dataIndex={'description'}
          key={'description'}
          sorter={handleSort('description')}
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
          render={(_, record: ICategoryResponse) => (
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

      <UpdateCategory
        mode={mode}
        open={isOpenUpdateModal}
        initialValues={initialValues}
        handleCancel={() => setIsOpenUpdateModal(false)}
        handleSubmit={handleSubmit}
      />
    </Card>
  );
};

export default ListCategories;
