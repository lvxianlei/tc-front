import React, { useState } from 'react'
import { Input, DatePicker, Select, Button, Modal, Form, Popconfirm, message } from 'antd'
import { useHistory, useLocation } from 'react-router-dom'
import { IntgSelect, SearchTable } from '../common';
import RequestUtil from '../../utils/RequestUtil';
import moment from 'moment';
import styles from './confirm.module.less';
import { FixedType } from 'rc-table/lib/interface';
import SelectUser from '../common/SelectUser';

export default function ConfirmTaskMngt(): React.ReactNode {
    const [assignVisible, setVisible] = useState<boolean>(false);
    const [filterValue, setFilterValue] = useState({});
    const [drawTaskId, setDrawTaskId] = useState<string>('');
    const [form] = Form.useForm();
    const history = useHistory();
    const location = useLocation<{ state?: {} }>();
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [assignType, setAssignType] = useState<'batch' | 'single'>('single');
    const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

    const handleAssignModalOk = async () => {
        try {
            setConfirmLoading(true)
            form.validateFields().then(async res => {
                const submitData = await form.getFieldsValue(true);
                await RequestUtil.post('/tower-science/drawTask/batchAssignDrawTask', {
                    ...submitData,
                    drawTaskIds: assignType === 'single' ? [drawTaskId] : selectedKeys,
                    plannedDeliveryTime: moment(submitData?.plannedDeliveryTime).format("YYYY-MM-DD HH:ss:mm")
                }).then(() => {
                    message.success('指派成功！')
                    setConfirmLoading(false)
                }).then(() => {
                    form.resetFields();
                }).then(() => {
                    setVisible(false);
                    history.go(0)
                }).catch(e => {
                    setConfirmLoading(false)
                })
            }).catch(e => {
                setConfirmLoading(false)
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
            key: 'initiator',
            title: '发起方',
            width: 100,
            dataIndex: 'initiator'
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
            key: 'description',
            title: '备注',
            width: 200,
            dataIndex: 'description'
        },
        {
            key: 'productCategoryName',
            title: '塔型名称',
            width: 200,
            dataIndex: 'productCategoryName'
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
            width: 400,
            dataIndex: 'operation',
            render: (_: undefined, record: any): React.ReactNode => (
                <>
                    <Button type='link' onClick={() => history.push(`/taskMngt/ConfirmTaskMngt/ConfirmTaskDetail/${record.id}/${record.status}`)} >任务详情</Button>
                    <Button type='link' onClick={async () => {
                        setDrawTaskId(record.id);
                        form.setFieldsValue({
                            plannedDeliveryTime: record?.plannedDeliveryTime ? moment(record?.plannedDeliveryTime) : ''
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
                                history.go(0)
                            })
                        }}
                        okText="确认"
                        cancelText="取消"
                        disabled={record.status !== 4}
                    >
                        <Button type='link' disabled={record.status !== 4}>提交任务</Button>
                    </Popconfirm>
                    <Popconfirm
                        title="确认退回任务?"
                        onConfirm={async () => {
                            await RequestUtil.post(`/tower-science/drawTask/retract/${record.id}`).then(() => {
                                message.success('退回成功！');
                            }).then(() => {
                                history.go(0)
                            })
                        }}
                        okText="确认"
                        cancelText="取消"
                        disabled={record.status !== 4}
                    >
                        <Button type='link' disabled={record.status !== 4}>退回</Button>
                    </Popconfirm>
                    <Button type='link' disabled={record.initiator === '营销发起' || record.status === 4 || record.status === 5 } onClick={() => history.push(`/taskMngt/ConfirmTaskMngt/ConfirmEdit/${record.id}`)}>编辑</Button>
                    <Popconfirm
                        title="确认删除任务?"
                        onConfirm={async () => {
                            await RequestUtil.delete(`/tower-science/drawTask/${record.id}`).then(() => {
                                message.success('删除成功！');
                            }).then(() => {
                                history.go(0)
                            })
                        }}
                        okText="确认"
                        cancelText="取消"
                        disabled={record.status !== 3 || record.initiator === '营销发起'}
                    >
                        <Button type='link' disabled={record.status !== 3|| record.initiator === '营销发起'}>删除</Button>
                    </Popconfirm>
                </>
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
        if (value.confirmId) {
            value.confirmId = value.confirmId?.value;
        }
        setFilterValue(value)
        return value
    }

    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: any[]): void => {
        setSelectedKeys(selectedRowKeys);
        setSelectedRows(selectedRows)
    }

    return <>
        <Modal visible={assignVisible} confirmLoading={confirmLoading} title="指派" okText="提交" onOk={handleAssignModalOk} onCancel={handleAssignModalCancel}>
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
        <SearchTable
            path="/tower-science/drawTask"
            columns={columns}
            exportPath="/tower-science/drawTask"
            extraOperation={
                <>
                    <Button type="primary" onClick={() => history.push(`/taskMngt/ConfirmTaskMngt/ConfirmTaskNew`)} ghost>创建</Button>
                    <Button type="primary" disabled={selectedKeys.length === 0} onClick={async () => {
                        const rows: number[] = selectedRows.map(res => res.status);
                        if (rows.findIndex((value) => value === 1) !== -1 || rows.findIndex((value) => value === 4) !== -1 || rows.findIndex((value) => value === 5) !== -1 || rows.findIndex((value) => value === 0) !== -1) {
                            message.warning('待指派或待完成状态可进行指派！')
                        } else {
                            setVisible(true);
                            setAssignType('batch');
                        }
                    }} ghost>批量指派</Button>
                </>
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
                    name: 'productCategoryName',
                    label: '塔型名称',
                    children: <Input placeholder='请输入' />
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