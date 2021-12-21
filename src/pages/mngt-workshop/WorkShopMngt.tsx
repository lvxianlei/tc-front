import React, { useState } from 'react';
import { Input, DatePicker, Button, Form, Modal, Row, Col, Radio, message } from 'antd';
import { Page } from '../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './workshop.module.less';
import RequestUtil from '../../utils/RequestUtil';
import { useHistory } from 'react-router-dom';

export default function DailySchedule(): React.ReactNode {
    const [refresh, setRefresh] = useState<boolean>(false);
    const [filterValue, setFilterValue] = useState({});
    const history = useHistory()
    const [confirmStatus, setConfirmStatus] = useState<number>(1);
    const [ selectedKeys, setSelectedKeys ] = useState<React.Key[]>([]);
    const [visible, setVisible] = useState(false);
    const [detail, setDetail] = useState<any>({});
    const [form] = Form.useForm();
    const columns=[
        {
            title: "工作中心",
            width: 150,
            dataIndex: "issueWeight"
        },
        {
            title: "开始时间",
            width: 150,
            dataIndex: "angleWeight"
        },
        {
            title: "完成时间",
            width: 150,
            dataIndex: "plateWeight"
        },
        {
            title: "状态",
            width: 150,
            dataIndex: "wearHangTeamName"
        },
        {
            title: "加工计划编号",
            width: 150,
            dataIndex: "picklingTeamName"
        },
        {
            title: "计划号",
            width: 150,
            dataIndex: "maintenanceTeamName"
        },
        {
            title: "塔型",
            width: 150,
            dataIndex: "zincPotTeamName"
        },
        {
            title: "零件号",
            width: 150,
            dataIndex: "galvanizedStartTime"
        },
        {
            title: "加工数量",
            width: 100,
            dataIndex: "galvanizedEndTime"
        },
        {
            title: "总重（kg）",
            width: 200,
            dataIndex: "packagingTeamName"
        }
    ]
    const closeModal = () => {
        setVisible(false);
        form.resetFields();
        // setDetail({});
        setSelectedKeys([]);
    }

    const submit = () => {
        if(form) {
            form.validateFields().then(res => {
                const values = form.getFieldsValue(true);
                RequestUtil.post(`/tower-production/galvanized/daily/plan/dispatching`, { ...values, id: selectedKeys.join(',') }).then(res => {
                    message.success("派工成功");
                    setRefresh(!refresh);
                    closeModal();
                });
            })
        }
    }

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
                [ ...columns, {
                    "key": "operation",
                    "title": "操作",
                    "dataIndex": "operation",
                    fixed: "right" as FixedType,
                    "width": 150,
                    render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                        confirmStatus === 1 ? <Button type="link" onClick={() => {
                            history.push(`/workshopManagement/processingTask/dispatch/${record.id}`)
                        }}>派工</Button> : confirmStatus === 2 ? <Button type="link" onClick={() => {
                            history.push(`/workshopManagement/processingTask/detail/${record.id}/${record.status}`)
                        }}>详情</Button>: confirmStatus === 3 ? <Button type="link" onClick={() => {
                            history.push(`/workshopManagement/processingTask/detail/${record.id}/3`)
                        }}>详情</Button>: null
                    )
                }] : [ ...columns]}
            headTabs={[]}
            requestData={{ status: confirmStatus }}
            extraOperation={(data: any) =><>
                <Radio.Group defaultValue={confirmStatus} onChange={operationChange}>
                    <Radio.Button value={1}>未派工</Radio.Button>
                    <Radio.Button value={2}>未采集</Radio.Button>
                    <Radio.Button value={3}>已完成</Radio.Button>
                    <Radio.Button value={4}>已完成</Radio.Button>
                </Radio.Group>
                {confirmStatus === 1 ? <Button type="primary" disabled={ selectedKeys.length <= 0 } onClick={() => {
                    RequestUtil.post(`/tower-production/galvanized/daily/plan/confirm`, selectedKeys).then(res => {
                        message.success("确认成功");
                        setRefresh(!refresh);
                    });
                }}>批量确认</Button> : confirmStatus === 2 ? <Button type="primary" disabled={ selectedKeys.length <= 0 } onClick={() => {
                    setVisible(true);
                }}>派工</Button> : null}
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
                    name: 'time',
                    label: '送齐时间',
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