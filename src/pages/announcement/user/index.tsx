import React, { useState } from 'react';
import { Space, Input, Select, Button, Popconfirm, Form, message } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import RequestUtil from '../../../utils/RequestUtil';
import { FileProps } from '../../common/Attachment';

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
}

export default function AnnouncementMngt(): React.ReactNode {
    const [refresh, setRefresh] = useState<boolean>(false);
    const [filterValue, setFilterValue] = useState({});
    const history = useHistory();
    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            fixed: "left" as FixedType,
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'name',
            title: '分组名称',
            width: 150,
            dataIndex: 'name'
        },
        {
            key: 'employeeNames',
            title: '人员',
            width: 150,
            dataIndex: 'employeeNames'
        },
        {
            key: 'type',
            title: '分组分类',
            dataIndex: 'type',
            width: 120
        },
        {
            key: 'clientId',
            title: '应用范围',
            width: 200,
            dataIndex: 'clientId'
        },
        {
            key: 'description',
            title: '备注',
            width: 200,
            dataIndex: 'description'
        }
    ]

    const batchDel = () => {
        if (selectedRows.length > 0) {
            RequestUtil.delete(`/tower-system/noticeGroup?ids=${selectedRows.map<string>((item: IAnnouncement): string => item?.id || '').join(',')}`).then(res => {
                message.success('批量删除成功！');
                setSelectedKeys([]);
                setSelectedRows([]);
                setRefresh(!refresh);
            });
        } else {
            message.warning('请先选择需要删除的数据');
        }
    }

    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: IAnnouncement[]): void => {
        setSelectedKeys(selectedRowKeys);
        setSelectedRows(selectedRows)
    }

    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<IAnnouncement[]>([]);

    return <Page
        path="/tower-system/noticeGroup"
        columns={columns}
        headTabs={[]}
        extraOperation={
            <Space direction="horizontal" size="small">
                <Link to={{ pathname: `/announcement/user/add`}}><Button type="primary">新增</Button></Link>
                {selectedRows.length > 0 ?
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
            },
            onRow:(record:any) => ({
                onDoubleClick: async () => {
                    history.push(`/announcement/user/edit/${record?.id}`)
                },
               
            })
        }}
        searchFormItems={[
            {
                name: 'type',
                label: '分组分类',
                children: <Input maxLength={50} placeholder="请输入分组分类" />
            },
            {
                name: 'name',
                label: '分组名称',
                children: <Input maxLength={50} placeholder="请输入分组名称" />
            }
        ]}
        filterValue={filterValue}
        onFilterSubmit={(values: Record<string, any>) => {
            setFilterValue(values);
            return values;
        }}
    />
}