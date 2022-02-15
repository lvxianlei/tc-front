import React, { useState } from 'react';
import { Input, DatePicker, Button, Form, Radio, message } from 'antd';
import { Page } from '../common';
import { FixedType } from 'rc-table/lib/interface';
import RequestUtil from '../../utils/RequestUtil';
import styles from './workshop.module.less';
import WorkshopTeamSelectionComponent from '../../components/WorkshopTeamModal';
import { useHistory } from 'react-router-dom';
import moment from 'moment';

export default function DailySchedule(): React.ReactNode {
    const [refresh, setRefresh] = useState<boolean>(false);
    const [filterValue, setFilterValue] = useState({});
    const [confirmStatus, setConfirmStatus] = useState<number>(1);
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [form] = Form.useForm();
    const history = useHistory();
    const columns = [
        {
            title: "状态",
            width: 100,
            dataIndex: "status",
            render: (status: number) => {
                switch (status) {
                    case 1: return '未确认'
                    case 2: return '未派工'
                    case 3: return '未采集'
                    case 4: return '已完成'
                }
            }
        },
        {
            title: "订单工程名称",
            width: 150,
            dataIndex: "orderProjectName"
        },
        {
            title: "电压等级",
            width: 150,
            dataIndex: "voltageGradeName"
        },
        {
            title: "计划号",
            width: 150,
            dataIndex: "planNumber"
        },
        {
            title: "塔型",
            width: 150,
            dataIndex: "productCategoryName"
        },
        {
            title: "基数",
            width: 150,
            dataIndex: "number"
        },
        {
            title: "下达重量（kg）",
            width: 150,
            dataIndex: "weight"
        },
        {
            title: "角钢重量（kg）",
            width: 150,
            dataIndex: "angleWeight"
        },
        {
            title: "连板重量（kg）",
            width: 150,
            dataIndex: "boardWeight"
        },
        {
            title: "开始包装时间",
            width: 150,
            dataIndex: "startTime",
            render: (startTime: string) => {
                return startTime ? moment(startTime).format('YYYY-MM-DD') : '-'
            }
        },
        {
            title: "入库时间",
            width: 100,
            dataIndex: "endTime",
            render: (endTime: string) => {
                return endTime ? moment(endTime).format('YYYY-MM-DD') : '-'
            }
        },
        {
            title: "包装班组",
            width: 200,
            dataIndex: "teamName"
        }
    ]


    const operationChange = (event: any) => {
        setConfirmStatus(parseFloat(`${event.target.value}`));
        setRefresh(!refresh);
        setSelectedKeys([]);
    }

    const SelectChange = (selectedRowKeys: React.Key[]): void => {
        setSelectedKeys(selectedRowKeys);
    }

    return <>
        <Page
            path="/tower-production/packageWorkshop"
            sourceKey="packageDailyPlanVOS.records"
            columns={
                [{
                    "key": "index",
                    "title": "序号",
                    "dataIndex": "index",
                    "width": 50,
                    render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{index + 1}</span>)
                }, ...columns, {
                    "key": "operation",
                    "title": "操作",
                    "dataIndex": "operation",
                    fixed: "right" as FixedType,
                    "width": 80,
                    render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                        confirmStatus === 1 ? <Button type="link" onClick={() => {
                            RequestUtil.post(`/tower-production/packageWorkshop/confirm`, [record.id]).then(res => {
                                message.success("确认成功");
                                setRefresh(!refresh);
                            });
                        }}>确认</Button> : confirmStatus === 2 ? <WorkshopTeamSelectionComponent onSelect={(selectedRows: any) => {
                            console.log(selectedRows);
                            RequestUtil.put(`tower-production/packageWorkshop/confirmDispatch`, {
                                teamId: selectedRows[0].id,
                                name: selectedRows[0].name,
                                planList: [{
                                    id: record.id,
                                    planNumber: record.planNumber,
                                    productCategoryName: record.productCategoryName
                                }]
                            }).then(() => {
                                message.success('派工成功！')
                                setRefresh(!refresh)
                            })
                        }} buttonType="link" buttonTitle="派工" /> : confirmStatus === 3 ? <Button type="link" onClick={() => {
                            history.push(`/packagingWorkshop/processingTask/detail/${record.id}/${record.status}`)
                        }}>详情</Button> : <Button type="link" onClick={() => {
                            history.push(`/packagingWorkshop/processingTask/detail/${record.id}/4`)
                        }}>详情</Button>
                    )
                }]}
            headTabs={[]}
            requestData={{ status: confirmStatus }}
            extraOperation={(data: any) => <>
                <Radio.Group defaultValue={confirmStatus} onChange={operationChange}>
                    <Radio.Button value={1}>未确认</Radio.Button>
                    <Radio.Button value={2}>未派工</Radio.Button>
                    <Radio.Button value={3}>未采集</Radio.Button>
                    <Radio.Button value={4}>已完成</Radio.Button>
                </Radio.Group>
                <span className={styles.statistical}>统计：<span className={styles.statistical}>下达总重量：<span style={{color:'#FF8C00'}}>{data?.issueTotalWeight}</span>吨</span><span className={styles.statistical}>角钢总重量：<span style={{color:'#FF8C00'}}>{data?.angleTotalWeight}</span>吨</span><span className={styles.statistical}>连板总重量：<span style={{color:'#FF8C00'}}>{data?.plateTotalWeight}</span>吨</span></span>
                {confirmStatus === 1 ? <Button type="primary" disabled={selectedKeys.length <= 0} onClick={() => {
                    RequestUtil.post(`/tower-production/packageWorkshop/confirm`, selectedKeys).then(res => {
                        message.success("确认成功");
                        setRefresh(!refresh);
                    });
                }}>批量确认</Button> : null}
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
                    name: 'time',
                    label: '入库时间',
                    children: <DatePicker.RangePicker />
                },
                {
                    name: 'fuzzyMsg',
                    label: "模糊查询项",
                    children: <Input style={{ width: '300px' }} placeholder="请输入订单工程名称/计划号/塔型进行查询" />
                }
            ]}
            filterValue={filterValue}
            onFilterSubmit={(values: Record<string, any>) => {
                if (values.time) {
                    const formatDate = values.time.map((item: any) => item.format("YYYY-MM-DD"));
                    values.startTime = formatDate[0] + ' 00:00:00';
                    values.endTime = formatDate[1] + ' 23:59:59';
                }
                setFilterValue(values);
                return values;
            }}
        />
    </>
}