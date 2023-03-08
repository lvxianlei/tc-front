/**
 * @author zyc
 * @copyright © 2021
 * @description 员工管理
*/

import React, { useState } from 'react';
import { Space, Input, Button, Popconfirm, message, Upload, Select, Form, Modal } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './StaffMngt.module.less';
import RequestUtil from '../../../utils/RequestUtil';
import AuthUtil from '../../../utils/AuthUtil';
import { staffTypeOptions } from '../../../configuration/DictionaryOptions';
import useRequest from '@ahooksjs/use-request';

export interface IStaff {
    readonly id?: string;
    readonly userId?: string;
    readonly accountId?: string;
    readonly autoAccount?: number;
    readonly category?: string;
    readonly categoryName?: string;
    readonly dept?: string;
    readonly deptName?: string;
    readonly teamGroupId?: string;
    readonly teamGroupIdName?: string;
    readonly description?: string;
    readonly email?: string;
    readonly entryDate?: string;
    readonly name?: string;
    readonly number?: string;
    readonly phone?: string;
    readonly roleId?: string;
    readonly station?: string;
    readonly stationName?: string;
    readonly roleIdList?: string[];
    readonly stationList?: string[];
    readonly status?: 0 | 1;
}

export default function StaffMngt(): React.ReactNode {
    const history = useHistory()
    const [refresh, setRefresh] = useState<boolean>(false);
    const [filterValue, setFilterValue] = useState({});
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<IStaff[]>([]);

    const { loading: statusLoading, run } = useRequest((id: string, status: 0 | 1) => new Promise(async (resove, reject) => {
        try {
            const data: any = await RequestUtil.put(`/tower-system/employee/status?id=${id}&status=${status}`)
            resove(data)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { loading: deleting, run: deleteRun } = useRequest((ids: string[]) => new Promise(async (resove, reject) => {
        try {
            const data: any = await RequestUtil.delete(`/tower-system/employee`, ids)
            resove(data)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const columns = [
        {
            title: '账号',
            width: 100,
            dataIndex: 'account'
        },
        {
            title: '手机号',
            width: 100,
            dataIndex: 'phone'
        },
        {
            title: '角色',
            width: 150,
            dataIndex: 'roleName'
        },
        {
            title: '姓名',
            width: 100,
            dataIndex: 'name'
        },

        {
            title: '部门',
            width: 150,
            dataIndex: 'deptName'
        },
        {
            title: '班组',
            width: 150,
            dataIndex: 'teamGroupName'
        },
        {
            title: '工号',
            dataIndex: 'number',
            width: 120
        },
        {
            title: "企业微信用户",
            dataIndex: 'businessWxUserId',
            width: 120
        },
        {
            title: '员工类型',
            width: 100,
            dataIndex: 'categoryName'
        },
        {
            title: '岗位',
            width: 150,
            dataIndex: 'stationName'
        },
        {
            title: '邮箱',
            width: 150,
            dataIndex: 'email'
        },
        {
            title: '同步即时通讯状态',
            width: 150,
            dataIndex: 'isAsyncTencentName'
        },
        {
            title: "状态",
            width: 50,
            dataIndex: 'statusName'
        },
        {
            title: '备注',
            width: 200,
            dataIndex: 'description'
        },
        {
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 130,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small" className={styles.operationBtn}>
                    <Button type="link" disabled={record.status === 1} onClick={async () => {
                        await run(record.id, 1)
                        history.go(0)
                    }}>启用</Button>
                    <Button type="link" disabled={record.status === 0} onClick={async () => {
                        await run(record.id, 0)
                        history.go(0)
                    }}>禁用</Button>
                    <Popconfirm
                        title="确认重置密码?"
                        onConfirm={() => {
                            RequestUtil.put(`/sinzetech-user/user/resetPassword?userIds=${record.userId}`).then(res => {
                                setRefresh(!refresh);
                            });
                        }}
                        okText="确认"
                        cancelText="取消"
                    >
                        <Button type="link">重置密码</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ]

    const batchDel = () => {
        if (selectedRows.length > 0) {
            RequestUtil.delete(`/tower-system/employee`, selectedKeys).then(res => {
                message.success('批量删除成功');
                setSelectedKeys([]);
                setSelectedRows([]);
                setRefresh(!refresh);
            });
        } else {
            message.warning('请先选择需要删除的数据');
        }
    }

    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: IStaff[]): void => {
        setSelectedKeys(selectedRowKeys);
        setSelectedRows(selectedRows)
    }

    const importUserToTencentIm = () => {
        RequestUtil.post(`/tower-system/employee/importUserToTencentIm`, selectedKeys).then(res => {
            message.success('同步成功');
            setSelectedKeys([]);
            setSelectedRows([]);
            setRefresh(!refresh);
        });
    }

    return <Page
        path="/tower-system/employee"
        columns={columns}
        headTabs={[]}
        exportPath={`/tower-system/employee`}
        extraOperation={<Space direction="horizontal" size="small">
            <Upload
                action={() => {
                    const baseUrl: string | undefined = process.env.REQUEST_API_PATH_PREFIX;
                    return baseUrl + '/tower-system/employee/import'
                }}
                headers={
                    {
                        'Authorization': `Basic ${AuthUtil.getAuthorization()}`,
                        'Tenant-Id': AuthUtil.getTenantId(),
                        'Sinzetech-Auth': AuthUtil.getSinzetechAuth()
                    }
                }
                showUploadList={false}
                onChange={(info) => {
                    if (info.file.response && !info.file.response?.success) {
                        message.warning(info.file.response?.msg)
                    }
                    if (info.file.response && info.file.response?.success) {
                        message.success('导入成功！');
                        setRefresh(!refresh);
                    }
                }}
            >
                <Button type="primary">导入</Button>
            </Upload>
            <Button type="primary" ghost onClick={() => {
                window.open(`${process.env.REQUEST_API_PATH_PREFIX?.replace(/\/*$/, '/') || ''.replace(/\/*$/, '/')}${`${"tower-system/employee/excelTemplate"}`.replace(/^\/*/, '')}`)
            }}>下载导入模板</Button>
            <Link to={{ pathname: `/dept/staffMngt/new`, state: { type: 'new' } }}><Button type="primary" ghost>新增</Button></Link>
            {selectedRows.length > 0 ? <Link to={{ pathname: `/dept/staffMngt/setting`, state: { type: 'edit', data: [...selectedRows] } }}><Button type="primary" ghost>编辑</Button></Link> : <Button type="primary" disabled ghost>编辑</Button>}
            <Button
                type="primary"
                ghost
                disabled={selectedKeys.length <= 0}
                loading={deleting}
                onClick={async () => {
                    Modal.confirm({
                        title: "删除员工！",
                        content: "确定要删除选中的员工吗？",
                        onOk: async () => {
                            await deleteRun(selectedKeys as any)
                            await message.success("删除成功")
                            history.go(0)
                        }
                    })
                }}>删除</Button>
            <Popconfirm
                title="确认同步到即时通讯吗?"
                onConfirm={importUserToTencentIm}
                okText="确认"
                cancelText="取消"
            >
                <Button type="primary" >同步到即时通讯</Button>
            </Popconfirm>

        </Space>}
        refresh={refresh}
        tableProps={{
            rowSelection: {
                selectedRowKeys: selectedKeys,
                onChange: SelectChange
            }
        }}
        searchFormItems={[
            {
                name: 'category',
                label: '员工类型',
                children: <Form.Item name="category" initialValue="">
                    <Select placeholder="请选择" style={{ width: '150px' }} getPopupContainer={triggerNode => triggerNode.parentNode}>
                        <Select.Option value={''} key="0">全部</Select.Option>
                        {staffTypeOptions && staffTypeOptions.map(({ id, name }, index) => {
                            return <Select.Option key={index} value={id}>
                                {name}
                            </Select.Option>
                        })}
                    </Select>
                </Form.Item>
            },
            {
                name: 'fuzzyQuery',
                label: '模糊查询项',
                children: <Input placeholder="账号/手机号/姓名/工号/邮箱" maxLength={50} style={{ width: 200 }} />
            }
        ]}
        filterValue={filterValue}
        onFilterSubmit={(values: Record<string, any>) => {
            setFilterValue(values);
            return values;
        }}
    />
}
