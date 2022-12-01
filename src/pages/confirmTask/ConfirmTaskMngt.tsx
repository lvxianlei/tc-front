import React, { useState } from 'react'
import { Space, Input, DatePicker, Select, Button, Modal, Form, Popconfirm, Row, Col, TreeSelect, message } from 'antd'
import { useHistory, useLocation } from 'react-router-dom'
import { IntgSelect, Page } from '../common';
import RequestUtil from '../../utils/RequestUtil';
import moment from 'moment';
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
import { TreeNode } from 'antd/lib/tree-select';
import useRequest from '@ahooksjs/use-request';
import styles from './confirm.module.less';
import { FixedType } from 'rc-table/lib/interface';
import SelectUser from '../common/SelectUser';

export default function ConfirmTaskMngt(): React.ReactNode {
    const [refresh, setRefresh] = useState<boolean>(false);
    const [confirmLeader, setConfirmLeader] = useState<any | undefined>([]);
    const [assignVisible, setVisible] = useState<boolean>(false);
    const [filterValue, setFilterValue] = useState({});
    const [drawTaskId, setDrawTaskId] = useState<string>('');
    const [form] = Form.useForm();
    const history = useHistory();
    const location = useLocation<{ state?: {} }>();
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [assignType, setAssignType] = useState<'batch' | 'single'>('single');

    const handleAssignModalOk = async () => {
        try {
            form.validateFields().then(async res => {
                const submitData = await form.getFieldsValue(true);
                submitData.drawTaskIds = assignType === 'single' ? [drawTaskId] : selectedKeys;
                submitData.plannedDeliveryTime = moment(submitData.plannedDeliveryTime).format("YYYY-MM-DD HH:ss:mm");
                await RequestUtil.post('/tower-science/drawTask/batchAssignDrawTask', submitData).then(() => {
                    message.success('指派成功！')
                }).then(() => {
                    setVisible(false);
                    form.resetFields();
                }).then(() => {
                    setRefresh(!refresh);
                    history.go(0)
                })
            })

        } catch (error) {
            console.log(error)
        }
    }

    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'taskNum',
            title: '确认任务编号',
            width: 100,
            dataIndex: 'taskNum'
        },
        {
            key: 'scTaskNum',
            title: '营销任务编号',
            width: 100,
            dataIndex: 'scTaskNum'
        },
        {
            key: 'planNumber',
            title: '计划号',
            width: 100,
            dataIndex: 'planNumber'
        },
        {
            key: 'statusName',
            title: '任务状态',
            width: 100,
            dataIndex: 'statusName'
        },
        // {
        //     key: 'status',
        //     title: '任务状态',
        //     width: 100,
        //     dataIndex: 'status',
        //     render: (value: number, record: object): React.ReactNode => {
        //         const renderEnum: any = [
        //             {
        //                 value: 0,
        //                 label: "已拒绝"
        //             },
        //             {
        //                 value: 1,
        //                 label: "待确认"
        //             },
        //             {
        //                 value: 2,
        //                 label: "待指派"
        //             },
        //             {
        //                 value: 3,
        //                 label: "待完成"
        //             },
        //             {
        //                 value: 4,
        //                 label: "已完成"
        //             },
        //             {
        //                 value: 5,
        //                 label: "已提交"
        //             }
        //           ]
        //         return <>{renderEnum.find((item: any) => item.value === value).label}</>
        //     }
        // },
        {
            key: 'updateStatusTime',
            title: '最新状态变更时间',
            width: 200,
            dataIndex: 'updateStatusTime'
        },
        {
            key: 'confirmName',
            title: '确认人',
            width: 200,
            dataIndex: 'confirmName'
        },
        {
            key: 'contractNum',
            title: '内部合同编号',
            width: 200,
            dataIndex: 'contractNum'
        },
        {
            key: 'projectName',
            title: '工程名称',
            width: 200,
            dataIndex: 'projectName'
        },
        {
            key: 'contractName',
            title: '合同名称',
            width: 100,
            dataIndex: 'contractName'
        },
        {
            key: 'aeName',
            title: '业务经理',
            width: 100,
            dataIndex: 'aeName'
        },
        {
            key: 'operation',
            title: '操作',
            fixed: 'right' as FixedType,
            width: 250,
            dataIndex: 'operation',
            render: (_: undefined, record: any): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Button type='link' onClick={() => history.push(`/taskMngt/ConfirmTaskMngt/ConfirmTaskDetail/${record.id}/${record.status}`)} >任务详情</Button>
                    <Button type='link' onClick={async () => {
                        setDrawTaskId(record.id);
                        form.setFieldsValue({
                            plannedDeliveryTime: record.plannedDeliveryTime ? moment(record.plannedDeliveryTime) : ''
                        })
                        setVisible(true);
                        setAssignType('single');
                    }} disabled={record.status !== 2 && record.status !== 3}>指派</Button>
                    <Button type='link' onClick={() => history.push(`/taskMngt/ConfirmTaskMngt/ConfirmDetail/${record.id}`)} disabled={record.status < 4}>明细</Button>
                    <Popconfirm
                        title="确认提交任务?"
                        onConfirm={async () => {
                            await RequestUtil.post(`/tower-science/drawTask/submitDrawTask`, { drawTaskId: record.id }).then(() => {
                                message.success('提交成功！');
                            }).then(() => {
                                setRefresh(!refresh)
                            })
                        }}
                        okText="确认"
                        cancelText="取消"
                        disabled={record.status !== 4}
                    >
                        <Button type='link' disabled={record.status !== 4}>提交任务</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ]

    const handleAssignModalCancel = () => {
        setVisible(false);
        form.resetFields();
    };

    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
    };

    const onFilterSubmit = (value: any) => {
        if (value.statusUpdateTime) {
            const formatDate = value.statusUpdateTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.updateStatusTimeStart = formatDate[0] + ' 00:00:00';
            value.updateStatusTimeEnd = formatDate[1] + ' 23:59:59';
            delete value.statusUpdateTime
        }
        setFilterValue(value)
        return value
    }

    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: any[]): void => {
        setSelectedKeys(selectedRowKeys);
        setSelectedRows(selectedRows)
    }

    return <>
        <Modal visible={assignVisible} title="指派" okText="提交" onOk={handleAssignModalOk} onCancel={handleAssignModalCancel}>
            <Form form={form} {...formItemLayout} layout="horizontal">
                <Form.Item name="assignorName" label="人员" rules={[{ required: true, message: "请选择人员" }]}>
                    <Input size="small" disabled suffix={
                        <SelectUser key={'assignorId'} selectedKey={[form?.getFieldsValue(true)?.assignorName]} onSelect={(selectedRows: Record<string, any>) => {
                            form.setFieldsValue({
                                assignorId: selectedRows[0]?.userId,
                                assignorName: selectedRows[0]?.name,
                            })
                        }} />
                    } />
                </Form.Item>
                <Form.Item name="plannedDeliveryTime" label="计划交付时间" rules={[{ required: true, message: "请选择计划交付时间" }]}>
                    <DatePicker style={{ width: '100%' }} showTime />
                </Form.Item>
            </Form>
        </Modal>
        <Page
            path="/tower-science/drawTask"
            columns={columns}
            refresh={refresh}
            exportPath="/tower-science/drawTask"
            extraOperation={
                <Button type="primary" disabled={selectedKeys.length === 0} onClick={async () => {
                    const rows: number[] = selectedRows.map(res => res.status);
                    if (rows.findIndex((value) => value === 1) !== -1 || rows.findIndex((value) => value === 4) !== -1 || rows.findIndex((value) => value === 5) !== -1 || rows.findIndex((value) => value === 0) !== -1) {
                        message.warning('待指派或待完成状态可进行指派！')
                    } else {
                        setVisible(true);
                        setAssignType('batch');
                    }
                }} ghost>批量指派</Button>
            }
            filterValue={filterValue}
            onFilterSubmit={onFilterSubmit}
            requestData={{ status: location.state?.state }}
            searchFormItems={[
                {
                    name: 'statusUpdateTime',
                    label: '最新状态变更时间',
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
                {
                    name: 'status',
                    label: '任务状态',
                    children: <Form.Item name="status" initialValue={location.state?.state}>
                        <Select style={{ width: "100px" }}>
                            <Select.Option value={''} key={''}>全部</Select.Option>
                            <Select.Option value={2} key={2}>待指派</Select.Option>
                            <Select.Option value={3} key={3}>待完成</Select.Option>
                            <Select.Option value={4} key={4}>已完成</Select.Option>
                            <Select.Option value={5} key={5}>已提交</Select.Option>
                            <Select.Option value={0} key={0}>已拒绝</Select.Option>
                        </Select>
                    </Form.Item>
                },
                {
                    name: 'confirmId',
                    label: '确认人',
                    children: <IntgSelect width={200} />
                },
                {
                    name: 'fuzzyMsg',
                    label: '模糊查询项',
                    children: <Input placeholder="请输入任务编号/合同名称/业务经理进行查询" maxLength={200} />
                },
            ]}
            tableProps={{
                rowSelection: {
                    selectedRowKeys: selectedKeys,
                    onChange: SelectChange
                },
                onRow: (record: Record<string, any>) => ({
                    className: record.status === 1 ?
                        styles.row_color_1 : record.status === 2 ?
                            styles.row_color_2 : undefined
                })
            }}
        />
    </>
}