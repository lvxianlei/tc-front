/***
 * 用户管理
 */
import React, { useState, useRef } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Input, message, Modal, Popconfirm, Checkbox, Space } from 'antd';
import RequestUtil from '../../../utils/RequestUtil';
import { Page } from '../../common';
import { IUser, EditRefProps, IResponseData, IAnnouncement } from './IUser';
import AddUserModal from './AddUserModal';

export default function RoleMngtList(): React.ReactNode {
    const [ refresh, setRefresh ] = useState<boolean>(false);
    const [ visible, setVisible ] = useState<boolean>(false);
    const [ id, setId ] = useState<string>("");
    const [ selectedKeys, setSelectedKeys ] = useState<React.Key[]>([]);
    const [ selectedRows, setSelectedRows ] = useState<IAnnouncement[]>([]);
    const addRef = useRef<EditRefProps>();

    const UserMngtListHead = [
        {
            title: "账号",
            dataIndex: "account",
            width: 200
        },
        {
            title: "角色",
            dataIndex: "userRoleNames"
        },
        {
            title: '启用',
            with: 100,
            render: (_: undefined, item: object): React.ReactNode => {
                return (
                    <Checkbox
                        checked={(item as IUser).status === 1 ? true : false}
                        onChange={() => onChangeStatus([item as IUser])}
                    />
                )
            }
        },
    ]

    const onFilterSubmit = (value: any) => {
        return value
    }

    const onChangeStatus = async(items: IUser[]) => {
        const resData: IResponseData = await RequestUtil.put<IResponseData>(`/sinzetech-user/user/status?status=${items.map<number>((item: IUser): number => item?.status === 1 ? 0 : 1)[0]}&userIds=${items.map<number>((item: IUser): number => item?.id as number)}`);
        setRefresh(!refresh);
    }

    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: IAnnouncement[]): void => {
        setSelectedKeys(selectedRowKeys);
        setSelectedRows(selectedRows)
    }

    // 批量删除
    const batchDel = () => {
        if(selectedRows.length > 0) {
            RequestUtil.delete(`/sinzetech-user/user?ids=${ selectedRows.map<string>((item: IAnnouncement): string => item?.id || '').join(',') }`).then(res => {
                message.success('批量删除成功');
                setSelectedKeys([]);
                setSelectedRows([]);
                setRefresh(!refresh);
            });   
        } else {
            message.warning('请先选择需要删除的数据');
        }
    }

    // 重置密码
    const handleResetPassWord = async(items: IUser[]) => {
        const resData: IResponseData = await RequestUtil.put<IResponseData>('/sinzetech-user/user/resetPassword?userIds='+ items.map<number>((item: IUser): number => item?.id as number));
        message.success("重置密码成功！")
        setRefresh(!refresh);
    }

    // 新增回调
    const handleOkuseState = () => new Promise(async (resove, reject) => {
        try {
            await addRef.current?.onSubmit();
            message.success(`${id ? '编辑' : '新增'}角色成功！`)
            setVisible(false)
            setRefresh(!refresh);
            resove(true)
        } catch (error) {
            reject(false)
        }
    })

    return (
        <>
        <Page
            path="/sinzetech-user/user"
            columns={[
                ...UserMngtListHead,
                {
                    title: "操作",
                    dataIndex: "opration",
                    width: 100,
                    fixed: "right",
                    render: (_: any, record: any) => {
                        return (
                            <>
                                <Button type="link" onClick={() => {
                                    setId(record.id);
                                    setVisible(true)
                                }}>编辑</Button>
                                <Popconfirm
                                    title="您确定重置密码吗?"
                                    onConfirm={() => {
                                        handleResetPassWord([record as IUser])
                                    }}
                                    okText="确认"
                                    cancelText="取消"
                                ><Button type="link">重置密码</Button></Popconfirm>
                                <Popconfirm
                                    title="您确定删除该用户吗?"
                                    onConfirm={() => {
                                        RequestUtil.delete(`/sinzetech-user/user?ids=${record.id}`).then(res => {
                                            setRefresh(!refresh);
                                        });
                                    }}
                                    okText="确认"
                                    cancelText="取消"
                                ><Button type="link">删除</Button></Popconfirm>
                            </>
                        )
                    }
                }]}
                refresh={ refresh }
                onFilterSubmit={onFilterSubmit}
                //  filterValue={{ acceptStatus }}
                tableProps={{
                    rowSelection: {
                        selectedRowKeys: selectedKeys,
                        onChange: SelectChange
                    }
                }}
                extraOperation={
                    <Space direction="horizontal" size="small">
                        {/* <Button type="primary" style={{marginRight: 10}}>导入</Button>
                        <Button style={{marginRight: 10}}>下载导入模板</Button>
                        <Button style={{marginRight: 10}}>导出</Button> */}
                        <Button type="primary" style={{marginRight: 10}} onClick={() => {
                            setVisible(true);
                            setId("");
                        }}>新增</Button>
                        {
                            selectedKeys.length > 0 && selectedRows.map(items => items.state).indexOf(1) === -1 ? 
                                    <Popconfirm
                                        title="确认删除?"
                                        onConfirm={ batchDel }
                                        okText="确认"
                                        cancelText="取消"
                                    >
                                        <Button type="primary" icon={<DeleteOutlined />} ghost>删除</Button> 
                                    </Popconfirm>
                            : <Button type="primary" icon={<DeleteOutlined />} disabled ghost>删除</Button>
                        }
                    </Space>
                }
                searchFormItems={[
                    {
                        name: 'account',
                        children: <Input placeholder="请输入账号" style={{ width: 300 }} />
                    },
                    {
                        name: 'name',
                        children: <Input placeholder="请输入姓名" style={{ width: 300 }} />
                    }
                ]}
        />
        <Modal
            title={`${id ? '修改': '新增'}用户`}
            visible={visible}
            width={1000}
            maskClosable={false}
            onCancel={() => {
                setVisible(false)
                addRef.current?.resetFields();
            }}
                footer={[
                <Button key="submit" type="primary" onClick={() => handleOkuseState()}>
                    提交
                </Button>,
                <Button key="back" onClick={() => {
                    setVisible(false)
                    addRef.current?.resetFields();
                }}>
                    取消
                </Button>
                ]}
        >
            <AddUserModal ref={addRef} id={id} />
        </Modal>
        </>
    )
}