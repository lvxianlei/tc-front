import React, { useState } from 'react';
import { Input, DatePicker, Button, Form, Radio, message } from 'antd';
import { Page } from '../common';
import { FixedType } from 'rc-table/lib/interface';
import RequestUtil from '../../utils/RequestUtil';
import styles from './workshop.module.less';
import { useHistory } from 'react-router-dom';

export default function DailySchedule(): React.ReactNode {
    const [refresh, setRefresh] = useState<boolean>(false);
    const [filterValue, setFilterValue] = useState({});
    const [confirmStatus, setConfirmStatus] = useState<number>(1);
    const [ selectedKeys, setSelectedKeys ] = useState<React.Key[]>([]);
    const [form] = Form.useForm();
    const history = useHistory();
    const columns=[
        {
            title: "状态",
            width: 150,
            dataIndex: "issueWeight"
        },
        {
            title: "订单工程名称",
            width: 150,
            dataIndex: "issueWeight"
        },
        {
            title: "电压等级",
            width: 150,
            dataIndex: "issueWeight"
        },
        {
            title: "计划号",
            width: 150,
            dataIndex: "angleWeight"
        },
        {
            title: "塔型",
            width: 150,
            dataIndex: "plateWeight"
        },
        {
            title: "基数",
            width: 150,
            dataIndex: "wearHangTeamName"
        },
        {
            title: "下达重量",
            width: 150,
            dataIndex: "picklingTeamName"
        },
        {
            title: "角钢重量",
            width: 150,
            dataIndex: "maintenanceTeamName"
        },
        {
            title: "连板重量",
            width: 150,
            dataIndex: "zincPotTeamName"
        },
        {
            title: "开始包装时间",
            width: 150,
            dataIndex: "galvanizedStartTime"
        },
        {
            title: "入库时间",
            width: 100,
            dataIndex: "galvanizedEndTime"
        },
        {
            title: "包装班组",
            width: 200,
            dataIndex: "packagingTeamName"
        }
    ]


    const operationChange = (event: any) => {
        setConfirmStatus(parseFloat(`${event.target.value}`));
        setRefresh(!refresh);
    }

    const SelectChange = (selectedRowKeys: React.Key[]): void => {
        setSelectedKeys(selectedRowKeys);
    }

    return <>
        <Page
            path="/tower-production/galvanized/daily/plan"
            sourceKey="galvanizedDailyPlanVOS.records"
            columns={
                confirmStatus === 1 || confirmStatus === 2 || confirmStatus === 3 ? 
                [ {
                    "key": "index",
                    "title": "序号",
                    "dataIndex": "index",
                    "width": 50,
                    render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{index + 1}</span>)
                },...columns, {
                    "key": "operation",
                    "title": "操作",
                    "dataIndex": "operation",
                    fixed: "right" as FixedType,
                    "width": 150,
                    render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                        confirmStatus === 1 ? <Button type="link" onClick={() => {
                        }}>确认</Button> : confirmStatus === 2 ? <Button type="link" onClick={() => {
                            history.push(`/packagingWorkshop/processingTask/dispatch/${record.id}`)
                        }}>派工</Button>: confirmStatus === 3 ? <Button type="link" onClick={() => {
                            history.push(`/packagingWorkshop/processingTask/detail/${record.id}/${record.status}`)
                        }}>详情</Button>:<Button type="link" onClick={() => {
                            history.push(`/packagingWorkshop/processingTask/detail/${record.id}/4`)
                        }}>详情</Button>
                    )
                }] : [{
                    "key": "index",
                    "title": "序号",
                    "dataIndex": "index",
                    "width": 50,
                    render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{index + 1}</span>)
                }, ...columns]}
            headTabs={[]}
            requestData={{ status: confirmStatus }}
            extraOperation={(data: any) =><>
                <Radio.Group defaultValue={confirmStatus} onChange={operationChange}>
                    <Radio.Button value={1}>未确认</Radio.Button>
                    <Radio.Button value={2}>未派工</Radio.Button>
                    <Radio.Button value={3}>未采集</Radio.Button>
                    <Radio.Button value={4}>已完成</Radio.Button>
                </Radio.Group>
                <span className={styles.statistical}>统计<span className={styles.statistical}>下达总重量：{data?.issueTotalWeight}吨</span><span className={styles.statistical}>角钢总重量：{data?.angleTotalWeight}吨</span><span className={styles.statistical}>连板总重量：{data?.plateTotalWeight}吨</span></span>
                {confirmStatus === 1 ? <Button type="primary" disabled={ selectedKeys.length <= 0 } onClick={() => {
                    RequestUtil.post(`/tower-production/galvanized/daily/plan/confirm`, selectedKeys).then(res => {
                        message.success("确认成功");
                        setRefresh(!refresh);
                    });
                }}>批量确认</Button>  : null}
                </>}
            refresh={refresh}
            tableProps={{
                rowSelection: {
                    selectedRowKeys: selectedKeys,
                    onChange: SelectChange
                }
            }}
            searchFormItems={[
                {
                    name: 'fuzzyMsg',
                    label: '',
                    children: <Input style={{ width: '300px' }} placeholder="请输入订单工程名称/计划号/塔型进行查询" />
                },
                {
                    name: 'fuzzyMsg',
                    label: '状态',
                    children: <Input style={{ width: '300px' }} placeholder="请输入订单工程名称/计划号/塔型进行查询" />
                },
                {
                    name: 'time',
                    label: '入库时间',
                    children: <DatePicker.RangePicker />
                }
            ]}
            filterValue={filterValue}
            onFilterSubmit={(values: Record<string, any>) => {
                if (values.time) {
                    const formatDate = values.time.map((item: any) => item.format("YYYY-MM-DD"));
                    values.galvanizedStartTime = formatDate[0];
                    values.galvanizedEndTime = formatDate[1];
                }
                setFilterValue(values);
                return values;
            }}
        />
    </>
}