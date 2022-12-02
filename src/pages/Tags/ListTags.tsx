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
  ITagResponse,
  ICreateTagRequest,
  IUpdateTagRequest,
  Mode,
} from '../../interfaces';
import { TagsService } from '../../services/';
import {
  commonMessage,
  defaultCreateTagRequest,
  DEFAULT_PAGE_SIZE,
  DEFAULT_STATE_TIME,
  keys,
} from '../../utils';
import { UpdateTag } from '.';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usePagination } from '../../hooks';

const { Search } = Input;

const ListTags: FC = () => {
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState<boolean>(false);
  const [mode, setMode] = useState<Mode>('create');
  const [initialValues, setInitialValues] = useState<
    ICreateTagRequest | IUpdateTagRequest
  >();

  const { onPageChange, paginationFilter, onSearch } = usePagination();

  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: [keys.tags.fetchAllTagsPagination, paginationFilter],
    queryFn: () => TagsService.fetchAllTagsPagination(paginationFilter),
    staleTime: DEFAULT_STATE_TIME,
    keepPreviousData: true,
  });

  const createTagMutation = useMutation({
    mutationKey: [keys.tags.createTag],
    mutationFn: (payload: ICreateTagRequest) => TagsService.createTag(payload),
  });

  const updateTagMutation = useMutation({
    mutationKey: [keys.tags.updateTag],
    mutationFn: (payload: IUpdateTagRequest) => TagsService.updateTag(payload),
  });

  const deleteTagMutation = useMutation({
    mutationKey: [keys.tags.deleteTag],
    mutationFn: (payload: number) => TagsService.deleteTag(payload),
  });

  const refreshListTags = () => {
    queryClient.invalidateQueries({
      queryKey: [keys.tags.fetchAllTagsPagination, paginationFilter],
    });
  };

  const handleConfirmDelete = async (id: number) => {
    await deleteTagMutation.mutateAsync(id, {
      onSuccess: refreshListTags,
    });
    if (deleteTagMutation.isSuccess) {
      message.success(commonMessage.deleteSuccessfully);
    } else if (deleteTagMutation.isError) {
      message.error(commonMessage.deleteFailure);
    }
  };

  const handleSort =
    (property: keyof Omit<ITagResponse, 'id'>) =>
    (a: ITagResponse, b: ITagResponse) => {
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

  const handleOpenUpdateModal = (item?: ITagResponse) => {
    const mode = item ? 'edit' : 'create';
    const initialValues = !item
      ? defaultCreateTagRequest
      : ({
          id: item.id,
          title: item.title,
          status: item.status,
        } as IUpdateTagRequest);
    setMode(mode);
    setIsOpenUpdateModal(true);
    setInitialValues(initialValues);
  };

  const handleSubmit = async (
    values: ICreateTagRequest | IUpdateTagRequest
  ) => {
    if (mode === 'create') {
      await createTagMutation.mutateAsync(values, {
        onSuccess: refreshListTags,
      });
      if (createTagMutation.isSuccess) {
        message.success(commonMessage.createSuccessfully);
      } else if (createTagMutation.isError) {
        message.error(commonMessage.createFailure);
      }
    } else {
      await updateTagMutation.mutateAsync(values as IUpdateTagRequest, {
        onSuccess: refreshListTags,
      });
      if (updateTagMutation.isSuccess) {
        message.success(commonMessage.updateSuccessfully);
      } else if (updateTagMutation.isError) {
        message.error(commonMessage.updateFailure);
      }
    }
  };

  return (
    <Card title={'Tags'} className={'m-16'}>
      <div className="py-16 flex">
        <Tooltip title="Create tag">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleOpenUpdateModal()}
          >
            Create tag
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
          title="Title"
          dataIndex={'title'}
          key={'title'}
          sorter={handleSort('title')}
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
          render={(_, record: ITagResponse) => (
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

      <UpdateTag
        mode={mode}
        open={isOpenUpdateModal}
        initialValues={initialValues}
        handleCancel={() => setIsOpenUpdateModal(false)}
        handleSubmit={handleSubmit}
      />
    </Card>
  );
};

export default ListTags;
