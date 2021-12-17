import React, { useState } from 'react';
import { Space, Input, DatePicker, Button, Popconfirm } from 'antd';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
// import styles from './DailySchedule.module.less';
import { Link, useLocation } from 'react-router-dom';
import RequestUtil from '../../../utils/RequestUtil';
import { weighingListColumns } from "../galvanizingWorkshop.json";

export default function WeighingList(): React.ReactNode {
    const [refresh, setRefresh] = useState<boolean>(false);
    const [filterValue, setFilterValue] = useState({});
    const location = useLocation<{ state: {} }>();

    return <Page
        path="/tower-science/loftingTask/taskPage"
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
                    <Space direction="horizontal" size="small"
                        // className={styles.operationBtn}
                    >
                        <Link to={`/galvanizingWorkshop/weighingList/weighingSetting/${record.id}`}><Button type="link">编辑</Button></Link>
                        <Popconfirm
                            title="确认删除?"
                            onConfirm={() => {
                                RequestUtil.delete(``).then(res => {
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
        requestData={{ status: location.state }}
        extraOperation={<Link to={`/galvanizingWorkshop/weighingList/weighingNew`}><Button type="primary">新增过磅单</Button></Link>}
        refresh={refresh}
        searchFormItems={[
            {
                name: 'fuzzyMsg',
                label: '',
                children: <Input style={{ width: '300px' }} placeholder="请输入塔型/抱杆号进行查询" />
            },
            {
                name: 'updateStatusTime',
                label: '过磅日期',
                children: <DatePicker.RangePicker />
            }
        ]}
        filterValue={filterValue}
        onFilterSubmit={(values: Record<string, any>) => {
            if (values.updateStatusTime) {
                const formatDate = values.updateStatusTime.map((item: any) => item.format("YYYY-MM-DD"));
                values.updateStatusTimeStart = formatDate[0] + ' 00:00:00';
                values.updateStatusTimeEnd = formatDate[1] + ' 23:59:59';
            }
            setFilterValue(values);
            return values;
        }}
    />
}