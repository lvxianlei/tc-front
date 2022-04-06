/**
 * @author zyc
 * @copyright © 2022 
 * @description 包装计划-包捆列表
 */

import React, { useState } from 'react';
import { Input, DatePicker, Button, message, Space, Select, Dropdown, Menu, Radio } from 'antd';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from '../PackingPlan.module.less';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import { Link } from 'react-router-dom';
import { DownOutlined } from '@ant-design/icons';

export interface ISummaryData {
    readonly planCount?: string;
    readonly productCategoryCount?: string;
    readonly packageCount?: string;
    readonly packageComponentCount?: string;
    readonly packageWeight?: string;
}

export default function DailySchedule(): React.ReactNode {
    const [refresh, setRefresh] = useState<boolean>(false);
    const [filterValue, setFilterValue] = useState({});
    const [confirmStatus, setConfirmStatus] = useState<number>(1);
    const [summaryData, setSummaryData] = useState<ISummaryData>({});
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);

    const { data: galvanizedTeamList } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-production/workshopTeam?size=1000`);
            resole(result?.records)
        } catch (error) {
            reject(error)
        }
    }))

    const { data }: Record<string, any> = useRequest(() => new Promise(async (resole, reject) => {
        getSummary();
        resole(true);
    }), {})

    const getSummary = () => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get<ISummaryData>(`/tower-production/package/summary`, { ...filterValue });
        setSummaryData(data);
    });

    const columns = [
        {
            "key": "planNumber",
            "title": "计划号",
            "width": 150,
            "dataIndex": "planNumber"
        },
        {
            "key": "productCategoryName",
            "title": "塔型",
            "width": 150,
            "dataIndex": "productCategoryName"
        },
        {
            "key": "productNumber",
            "title": "杆塔号",
            "width": 150,
            "dataIndex": "productNumber"
        },
        {
            "key": "packageCode",
            "title": "包号",
            "width": 150,
            "dataIndex": "packageCode"
        },
        {
            "key": "packageComponentCount",
            "title": "包件数",
            "width": 150,
            "dataIndex": "packageComponentCount"
        },
        {
            "key": "packageWeight",
            "title": "包重量（KG）",
            "width": 150,
            "dataIndex": "packageWeight"
        },
        {
            "key": "packageTypeName",
            "title": "包类型",
            "width": 150,
            "dataIndex": "packageTypeName"
        },
        {
            "key": "packageAttribute",
            "title": "包属性",
            "width": 150,
            "dataIndex": "packageAttribute"
        },
        {
            "key": "teamName",
            "title": "包装班组",
            "width": 150,
            "dataIndex": "teamName"
        },
        {
            "key": "packageStatus",
            "title": "包状态",
            "width": 150,
            "dataIndex": "packageStatus"
        },
        {
            "key": "startTime",
            "title": "开始包装日期",
            "width": 150,
            "dataIndex": "startTime",
            "type": "date",
            "format": 'YYYY-MM-DD'
        },
        {
            "key": "endTime",
            "title": "要求完成日期",
            "width": 150,
            "dataIndex": "endTime",
            "type": "date",
            "format": 'YYYY-MM-DD'
        }
    ]

    const menu = (
        <Menu>
            <Menu.Item key="1">
                <Button type='text'>批量完成</Button>
            </Menu.Item>
            <Menu.Item key="2">
                打印列表
            </Menu.Item>
        </Menu>
    );

    const operationChange = (event: any) => {
        setConfirmStatus(parseFloat(`${event.target.value}`));
        setRefresh(!refresh);
    }

    return <Page
        path={`tower-production/package`}
        columns={
            [...columns, {
                "key": "operation",
                "title": "操作",
                "dataIndex": "operation",
                fixed: "right" as FixedType,
                "width": 150,
                render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                    <Space>
                        <Link to={`/packingPlan/baleList/detail/${record.id}`}>详情</Link>
                    </Space>
                )
            }]}
        headTabs={[]}
        requestData={{ status: confirmStatus }}
        extraOperation={
            <>
                <Radio.Group defaultValue={confirmStatus} onChange={operationChange}>
                    <Radio.Button value={1}>打包中</Radio.Button>
                    <Radio.Button value={2}>已完成</Radio.Button>
                </Radio.Group>
                <p className={styles.title}>
                    <span className={styles.description}>总计划数：
                        <span className={styles.content}>{summaryData?.planCount}</span>
                    </span>
                    <span className={styles.description}>塔型数：
                        <span className={styles.content}>{summaryData?.productCategoryCount}</span>
                    </span>
                    <span className={styles.description}>总包捆数：
                        <span className={styles.content}>{summaryData?.packageCount}</span>
                    </span>
                    <span className={styles.description}>总件数：
                        <span className={styles.content}>{summaryData?.packageComponentCount}</span>
                    </span>
                    <span className={styles.description}>总重量：
                        <span className={styles.content}>{summaryData?.packageWeight}</span>KG
                    </span>
                </p>
                <Dropdown overlay={menu}>
                    <Button>
                        更多操作 <DownOutlined />
                    </Button>
                </Dropdown>
            </>
        }
        refresh={refresh}
        searchFormItems={[
            {
                name: 'packageType',
                label: '包类型',
                children: <Select placeholder="请选择" style={{ width: '120px' }}>
                    <Select.Option key={0} value={''}>全部</Select.Option>
                </Select>
            },
            {
                name: 'packageAttribute',
                label: '包属性',
                children: <Select placeholder="请选择" style={{ width: '120px' }} defaultValue={''}>
                    <Select.Option key={4} value={''}>全部</Select.Option>
                    <Select.Option key={0} value={0}>专用包</Select.Option>
                    <Select.Option key={1} value={1}>公用包</Select.Option>
                </Select>
            },
            {
                name: 'teamId',
                label: '包装班组',
                children: <Select placeholder="请选择" style={{ width: '120px' }}>
                    <Select.Option key={0} value={''}>全部</Select.Option>
                    {galvanizedTeamList?.map((item: any) => {
                        return <Select.Option key={item.teamName} value={item.id}>{item.teamName}</Select.Option>
                    })}
                </Select>
            },
            {
                name: 'time',
                label: '开始包装日期',
                children: <DatePicker.RangePicker />
            },
            {
                name: 'finishiTtime',
                label: '要求完成日期',
                children: <DatePicker.RangePicker />
            },
            {
                name: 'fuzzyQuery',
                label: "模糊查询项",
                children: <Input style={{ width: '200px' }} placeholder="计划号/塔型" />
            }
        ]}
        filterValue={filterValue}
        onFilterSubmit={(values: Record<string, any>) => {
            if (values?.time) {
                const formatDate = values?.time?.map((item: any) => item.format("YYYY-MM-DD"));
                values.startTimeMin = formatDate[0];
                values.startTimeMax = formatDate[1];
            }
            if (values?.finishiTtime) {
                const formatDate = values?.finishiTtime?.map((item: any) => item.format("YYYY-MM-DD"));
                values.endTimeMin = formatDate[0];
                values.endTimeMax = formatDate[1];
            }
            setFilterValue(values);
            return values;
        }}
        tableProps={{
            rowSelection: {
                selectedRowKeys: selectedKeys,
                onChange: (selectedRowKeys: React.Key[]): void => {
                    setSelectedKeys(selectedRowKeys);
                }
            }
        }}
    />
}