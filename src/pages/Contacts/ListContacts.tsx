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
  IContactResponse,
  ICreateContactRequest,
  IUpdateContactRequest,
  Mode,
} from '../../interfaces';
import { ContactsService } from '../../services/';
import {
  commonMessage,
  defaultCreateContactRequest,
  DEFAULT_PAGE_SIZE,
  DEFAULT_STATE_TIME,
  keys,
} from '../../utils';
import { UpdateContact } from '.';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usePagination } from '../../hooks';

const { Search } = Input;

const ListContacts: FC = () => {
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState<boolean>(false);
  const [mode, setMode] = useState<Mode>('create');
  const [initialValues, setInitialValues] = useState<
    ICreateContactRequest | IUpdateContactRequest
  >();

  const { onPageChange, paginationFilter, onSearch } = usePagination();

  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: [keys.contacts.fetchAllContactsPagination, paginationFilter],
    queryFn: () => ContactsService.fetchAllContactsPagination(paginationFilter),
    staleTime: DEFAULT_STATE_TIME,
    keepPreviousData: true,
  });

  const createContactMutation = useMutation({
    mutationKey: [keys.contacts.createContact],
    mutationFn: (payload: ICreateContactRequest) =>
      ContactsService.createContact(payload),
  });

  const updateContactMutation = useMutation({
    mutationKey: [keys.contacts.updateContact],
    mutationFn: (payload: IUpdateContactRequest) =>
      ContactsService.updateContact(payload),
  });

  const deleteContactMutation = useMutation({
    mutationKey: [keys.contacts.deleteContact],
    mutationFn: (payload: string) => ContactsService.deleteContact(payload),
  });

  const refreshListContacts = () => {
    queryClient.invalidateQueries({
      queryKey: [keys.contacts.fetchAllContactsPagination, paginationFilter],
    });
  };

  const handleConfirmDelete = async (id: string) => {
    await deleteContactMutation.mutateAsync(id, {
      onSuccess: refreshListContacts,
    });
    if (deleteContactMutation.isSuccess) {
      message.success(commonMessage.deleteSuccessfully);
    } else if (deleteContactMutation.isError) {
      message.error(commonMessage.deleteFailure);
    }
  };

  const handleSort =
    (property: keyof Omit<IContactResponse, 'id'>) =>
    (a: IContactResponse, b: IContactResponse) => {
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

  const handleOpenUpdateModal = (item?: IContactResponse) => {
    const mode = item ? 'edit' : 'create';
    const initialValues = !item
      ? defaultCreateContactRequest
      : ({
          id: item.id,
          content: item.content,
          email: item.email,
          phoneNumber: item.phoneNumber,
          status: item.status,
        } as IUpdateContactRequest);
    setMode(mode);
    setIsOpenUpdateModal(true);
    setInitialValues(initialValues);
  };

  const handleSubmit = async (
    values: ICreateContactRequest | IUpdateContactRequest
  ) => {
    if (mode === 'create') {
      await createContactMutation.mutateAsync(values, {
        onSuccess: refreshListContacts,
      });
      if (createContactMutation.isSuccess) {
        message.success(commonMessage.createSuccessfully);
      } else if (createContactMutation.isError) {
        message.error(commonMessage.createFailure);
      }
    } else {
      await updateContactMutation.mutateAsync(values as IUpdateContactRequest, {
        onSuccess: refreshListContacts,
      });
      if (updateContactMutation.isSuccess) {
        message.success(commonMessage.updateSuccessfully);
      } else if (updateContactMutation.isError) {
        message.error(commonMessage.updateFailure);
      }
    }
  };

  return (
    <Card title={'Contacts'} className={'m-16'}>
      <div className="py-16 flex">
        <Tooltip title="Create contact">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleOpenUpdateModal()}
          >
            Create contact
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
          title="Email"
          dataIndex={'email'}
          key={'email'}
          sorter={handleSort('email')}
        />

        <Table.Column
          title="Phone Number"
          dataIndex={'phoneNumber'}
          key={'phoneNumber'}
          sorter={handleSort('phoneNumber')}
        />

        <Table.Column
          title="Content"
          dataIndex={'content'}
          key={'content'}
          sorter={handleSort('content')}
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
          render={(_, record: IContactResponse) => (
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

      <UpdateContact
        mode={mode}
        open={isOpenUpdateModal}
        initialValues={initialValues}
        handleCancel={() => setIsOpenUpdateModal(false)}
        handleSubmit={handleSubmit}
      />
    </Card>
  );
};

export default ListContacts;
