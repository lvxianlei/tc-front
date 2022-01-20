import React, { useState } from 'react';
import { Space, Input, DatePicker, Button, Popconfirm, message } from 'antd';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import { Link } from 'react-router-dom';
import RequestUtil from '../../../utils/RequestUtil';
import { weighingListColumns } from "../galvanizingWorkshop.json";

export default function WeighingList(): React.ReactNode {
    const [refresh, setRefresh] = useState<boolean>(false);
    const [filterValue, setFilterValue] = useState({});

    return <Page
        path="/tower-production/weighing"
        columns={[
            {
                "key": "index",
                "title": "序号",
                "dataIndex": "index",
                "width": 50,
                render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{index + 1}</span>)
            },
            ...weighingListColumns,
            {
                key: 'operation',
                title: '操作',
                dataIndex: 'operation',
                fixed: 'right' as FixedType,
                width: 150,
                render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                    <Space direction="horizontal" size="small">
                        <Link to={`/galvanizingWorkshop/weighingList/weighingSetting/${record.id}`}><Button type="link">编辑</Button></Link>
                        <Popconfirm
                            title="确认删除?"
                            onConfirm={() => {
                                RequestUtil.delete(`/tower-production/weighing/${record.id}`).then(res => {
                                    message.success('删除成功');
                                    setRefresh(!refresh);
                                });
                            }}
                            okText="确认"
                            cancelText="取消"
                        >
                            <Button type="link">删除</Button>
                        </Popconfirm>
                    </Space>
                )
            }
        ]}
        headTabs={[]}
        extraOperation={<Link to={`/galvanizingWorkshop/weighingList/weighingNew`}><Button type="primary">新增过磅单</Button></Link>}
        refresh={refresh}
        searchFormItems={[
            {
                name: 'time',
                label: '过磅日期',
                children: <DatePicker.RangePicker />
            },
            {
                name: 'fuzzyMsg',
                label: "模糊查询项",
                children: <Input style={{ width: '300px' }} placeholder="请输入塔型/抱杆号进行查询" />
            }
        ]}
        filterValue={filterValue}
        onFilterSubmit={(values: Record<string, any>) => {
            if (values.time) {
                const formatDate = values.time.map((item: any) => item.format("YYYY-MM-DD"));
                values.weighingStartTime = formatDate[0];
                values.weighingEndTime = formatDate[1];
            }
            setFilterValue(values);
            return values;
        }}
    />
}