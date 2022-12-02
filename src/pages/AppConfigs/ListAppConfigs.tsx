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
  IAppConfigResponse,
  ICreateAppConfigRequest,
  IUpdateAppConfigRequest,
  Mode,
} from '../../interfaces';
import { AppConfigsService } from '../../services/';
import {
  commonMessage,
  defaultCreateAppConfigRequest,
  DEFAULT_PAGE_SIZE,
  DEFAULT_STATE_TIME,
  keys,
} from '../../utils';
import { UpdateAppConfig } from '.';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usePagination } from '../../hooks';

const { Search } = Input;

const ListAppConfigs: FC = () => {
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState<boolean>(false);
  const [mode, setMode] = useState<Mode>('create');
  const [initialValues, setInitialValues] = useState<
    ICreateAppConfigRequest | IUpdateAppConfigRequest
  >();

  const { onPageChange, paginationFilter, onSearch } = usePagination();

  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: [keys.appConfigs.fetchAllAppConfigsPagination, paginationFilter],
    queryFn: () =>
      AppConfigsService.fetchAllAppConfigsPagination(paginationFilter),
    staleTime: DEFAULT_STATE_TIME,
    keepPreviousData: true,
  });

  const createAppConfigMutation = useMutation({
    mutationKey: [keys.appConfigs.createAppConfig],
    mutationFn: (payload: ICreateAppConfigRequest) =>
      AppConfigsService.createAppConfig(payload),
  });

  const updateAppConfigMutation = useMutation({
    mutationKey: [keys.appConfigs.updateAppConfig],
    mutationFn: (payload: IUpdateAppConfigRequest) =>
      AppConfigsService.updateAppConfig(payload),
  });

  const deleteAppConfigMutation = useMutation({
    mutationKey: [keys.appConfigs.deleteAppConfig],
    mutationFn: (payload: number) => AppConfigsService.deleteAppConfig(payload),
  });

  const refreshListAppConfigs = () => {
    queryClient.invalidateQueries({
      queryKey: [
        keys.appConfigs.fetchAllAppConfigsPagination,
        paginationFilter,
      ],
    });
  };

  const handleConfirmDelete = async (id: number) => {
    await deleteAppConfigMutation.mutateAsync(id, {
      onSuccess: refreshListAppConfigs,
    });
    if (deleteAppConfigMutation.isSuccess) {
      message.success(commonMessage.deleteSuccessfully);
    } else if (deleteAppConfigMutation.isError) {
      message.error(commonMessage.deleteFailure);
    }
  };

  const handleSort =
    (property: keyof Omit<IAppConfigResponse, 'id'>) =>
    (a: IAppConfigResponse, b: IAppConfigResponse) => {
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

  const handleOpenUpdateModal = (item?: IAppConfigResponse) => {
    const mode = item ? 'edit' : 'create';
    const initialValues = !item
      ? defaultCreateAppConfigRequest
      : ({
          id: item.id,
          key: item.key,
          value: item.value,
          status: item.status,
        } as IUpdateAppConfigRequest);
    setMode(mode);
    setIsOpenUpdateModal(true);
    setInitialValues(initialValues);
  };

  const handleSubmit = async (
    values: ICreateAppConfigRequest | IUpdateAppConfigRequest
  ) => {
    if (mode === 'create') {
      await createAppConfigMutation.mutateAsync(values, {
        onSuccess: refreshListAppConfigs,
      });
      if (createAppConfigMutation.isSuccess) {
        message.success(commonMessage.createSuccessfully);
      } else if (createAppConfigMutation.isError) {
        message.error(commonMessage.createFailure);
      }
    } else {
      await updateAppConfigMutation.mutateAsync(
        values as IUpdateAppConfigRequest,
        {
          onSuccess: refreshListAppConfigs,
        }
      );
      if (updateAppConfigMutation.isSuccess) {
        message.success(commonMessage.updateSuccessfully);
      } else if (updateAppConfigMutation.isError) {
        message.error(commonMessage.updateFailure);
      }
    }
  };

  return (
    <Card title={'AppConfigs'} className={'m-16'}>
      <div className="py-16 flex">
        <Tooltip title="Create app config">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleOpenUpdateModal()}
          >
            Create app config
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
          title="Key"
          dataIndex={'key'}
          key={'key'}
          sorter={handleSort('key')}
        />

        <Table.Column
          title="Value"
          dataIndex={'value'}
          key={'value'}
          sorter={handleSort('value')}
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
          render={(_, record: IAppConfigResponse) => (
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

      <UpdateAppConfig
        mode={mode}
        open={isOpenUpdateModal}
        initialValues={initialValues}
        handleCancel={() => setIsOpenUpdateModal(false)}
        handleSubmit={handleSubmit}
      />
    </Card>
  );
};

export default ListAppConfigs;
