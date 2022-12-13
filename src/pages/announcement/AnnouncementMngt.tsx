import React, { useState } from 'react';
import { Space, Input, Select, Button, Popconfirm, Form, message } from 'antd';
import { Link } from 'react-router-dom';
import { Page } from '../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './AnnouncementMngt.module.less';
import RequestUtil from '../../utils/RequestUtil';
import { FileProps } from '../common/Attachment';

export interface IAnnouncement {
    readonly id?: string;
    readonly title?: string;
    readonly content?: string;
    readonly state?: number;
    readonly updateTime?: string;
    readonly userNames?: string;
    readonly attachInfoDtos?: FileProps[];
    readonly attachInfoVos?: FileProps[];
    readonly attachVos?: FileProps[];
    readonly staffList?: any;
}

export interface IStaffList {
    readonly id?: string;
    readonly userId?: string;
    readonly name?: string;
    readonly userName?: string;
    readonly signState?: 1 | 2;
}

export default function AnnouncementMngt(): React.ReactNode {
    const [refresh, setRefresh] = useState<boolean>(false);
    const [filterValue, setFilterValue] = useState({});

    const columns = [
        {
            title: '标题',
            width: 150,
            dataIndex: 'title',
            render: (_: string, record: Record<string, any>): React.ReactNode => (
                <Link to={`/announcement/list/detail/${record.id}`}>{_}</Link>
            )
        },
        {
            title: '发送人',
            width: 150,
            dataIndex: 'createUserName'
        },
        {
            title: '状态',
            dataIndex: 'state',
            width: 120,
            render: (state: number): React.ReactNode => {
                switch (state) {
                    case 0:
                        return '草稿';
                    case 1:
                        return '已发布';
                    case 2:
                        return '已撤回';
                }
            }
        },
        {
            title: '最新状态变更时间',
            width: 200,
            dataIndex: 'updateTime'
        },
        {
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 130,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small" className={styles.operationBtn}>
                    {record.state === 0 ? <Link to={{ pathname: `/announcement/list/edit/${record.id}`, state: { type: 'edit' } }}>编辑</Link> : <Button type="link" disabled>编辑</Button>}
                    <Button type="link" disabled={!(record.state === 1) || selectedKeys.length > 0} onClick={() => {
                        RequestUtil.post(`/tower-system/notice/withdraw`, {
                            noticeIds: [record.id]
                        }).then(res => {
                            setRefresh(!refresh);
                        });
                    }}>撤回</Button>
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={() => {
                            RequestUtil.delete(`/tower-system/notice?ids=${record.id}`).then(res => {
                                setRefresh(!refresh);
                            });
                        }}
                        okText="确认"
                        cancelText="取消"
                        disabled={record.state === 1}
                    >
                        <Button type="link" disabled={record.state === 1}>删除</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ]

    const batchDel = () => {
        if (selectedRows.length > 0) {
            RequestUtil.delete(`/tower-system/notice?ids=${selectedRows.map<string>((item: IAnnouncement): string => item?.id || '').join(',')}`).then(res => {
                message.success('批量删除成功');
                setSelectedKeys([]);
                setSelectedRows([]);
                setRefresh(!refresh);
            });
        } else {
            message.warning('请先选择需要删除的数据');
        }
    }

    const batchWithdraw = () => {
        if (selectedRows.length > 0) {
            RequestUtil.post(`/tower-system/notice/withdraw`, {
                noticeIds: selectedRows.map<string>((item: IAnnouncement): string => item?.id || '')
            }).then(res => {
                message.success('批量撤回成功');
                setSelectedKeys([]);
                setSelectedRows([]);
                setRefresh(!refresh);
            });
        } else {
            message.warning('请先选择需要撤回的数据');
        }
    }

    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: IAnnouncement[]): void => {
        setSelectedKeys(selectedRowKeys);
        setSelectedRows(selectedRows)
    }

    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<IAnnouncement[]>([]);

    return <Page
        path="/tower-system/notice"
        columns={columns}
        headTabs={[]}
        extraOperation={
            <Space direction="horizontal" size="small">
                <Link to={{ pathname: `/announcement/list/new`, state: { type: 'new' } }}><Button type="primary">新发布</Button></Link>
                {selectedRows.length > 0 && selectedRows.map(items => items.state).indexOf(0) === -1 && selectedRows.map(items => items.state).indexOf(2) === -1 ? <Button type="primary" onClick={batchWithdraw} ghost>撤回</Button> : <Button type="primary" disabled ghost>撤回</Button>}
                {selectedRows.length > 0 && selectedRows.map(items => items.state).indexOf(1) === -1 ?
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={batchDel}
                        okText="确认"
                        cancelText="取消"
                    >
                        <Button type="primary" ghost>删除</Button>
                    </Popconfirm>
                    : <Button type="primary" disabled ghost>删除</Button>}
            </Space>
        }
        refresh={refresh}
        tableProps={{
            rowSelection: {
                selectedRowKeys: selectedKeys,
                onChange: SelectChange
            }
        }}
        searchFormItems={[
            {
                name: 'state',
                label: '状态',
                children: <Form.Item name="state" initialValue="">
                    <Select placeholder="请选择" style={{ width: "150px" }}>
                        <Select.Option value={''} key="3">全部</Select.Option>
                        <Select.Option value={0} key="0">草稿</Select.Option>
                        <Select.Option value={1} key="1">已发布</Select.Option>
                        <Select.Option value={2} key="2">已撤回</Select.Option>
                    </Select>
                </Form.Item>
            },
            {
                name: 'msg',
                label: '模糊查询项',
                children: <Input maxLength={50} placeholder="请输入" />
            }
        ]}
        filterValue={filterValue}
        onFilterSubmit={(values: Record<string, any>) => {
            setFilterValue(values);
            return values;
        }}
    />
}