import React, { useState } from 'react'
import { Space, Input, DatePicker, Select, Button, Modal, Form, Popconfirm, Row, Col } from 'antd'
import { Link } from 'react-router-dom'
import { Page } from '../common';
import { FixedType } from 'rc-table/lib/interface';
import RequestUtil from '../../utils/RequestUtil';
import moment from 'moment';

export default function ConfirmTaskMngt(): React.ReactNode {
    const [assignVisible, setVisible] = useState<boolean>(false);
    const [drawTaskId, setDrawTaskId] = useState<string>('');
    const [form] = Form.useForm();
    const handleAssignModalOk = async () => {
        try {
            const submitData = await form.validateFields();
            submitData.drawTaskId = drawTaskId;
            submitData.plannedDeliveryTime = moment(submitData.plannedDeliveryTime).format('YYYY-MM-DD');
            console.log(submitData)
            await RequestUtil.post('/tower-science/drawTask/assignDrawTask', submitData).then(()=>{
                setVisible(false)
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
            key: 'drawTaskNum',
            title: '确认任务编号',
            width: 100,
            dataIndex: 'drawTaskNum'
        },
        {
            key: 'status',
            title: '任务状态',
            width: 100,
            dataIndex: 'status',
            render: (value: number, record: object): React.ReactNode => {
                const renderEnum: any = [
                    {
                        value: 0,
                        label: "已拒绝"
                    },
                    {
                        value: 1,
                        label: "待确认"
                    },
                    {
                        value: 2,
                        label: "待指派"
                    },
                    {
                        value: 3,
                        label: "待完成"
                    },
                    {
                        value: 4,
                        label: "已完成"
                    },
                    {
                        value: 5,
                        label: "已提交"
                    }
                  ]
                return <>{renderEnum.find((item: any) => item.value === value).label}</>
            }
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
                    <Link to={`/confirmTask/ConfirmTaskMngt/ConfirmTaskDetail/${record.id}`}>任务详情</Link>
                    <Button type='link' onClick={() => { setDrawTaskId(record.id); setVisible(true) }}>指派</Button>
                    <Link to={`/confirmTask/ConfirmTaskMngt/ConfirmDetail/${record.id}`}>明细</Link>
                    <Popconfirm
                        title="确认提交任务?"
                        onConfirm={ async () => {
                            await RequestUtil.post('/tower-science/drawTask/submitDrawTask', record.id)
                        } }
                        okText="确认"
                        cancelText="取消"
                    >   
                        <Button type='link'>提交任务</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ]

    const handleAssignModalCancel = () => setVisible(false);
    const onFilterSubmit = (value: any) => {
        console.log(value)
        return value
    }
    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
    };
    return <>
        <Modal visible={ assignVisible } title="指派" okText="提交" onOk={ handleAssignModalOk } onCancel={ handleAssignModalCancel } width={ 800 }>
            <Form form={ form } { ...formItemLayout }>
                <Row>
                    <Col span={12}>
                        <Form.Item name="dept" label="部门" rules={[{required:true,message:"请选择部门"}]}>
                            <Select style={{width:'100%'}}>
                                <Select.Option value="1">是</Select.Option>
                                <Select.Option value="0">否</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="assignorId" label="人员" rules={[{required:true,message:"请选择人员"}]}>
                            <Select style={{width:'100%'}}>
                                <Select.Option value="1">是</Select.Option>
                                <Select.Option value="0">否</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item name="plannedDeliveryTime" label="计划交付时间" rules={[{required:true,message:"请选择计划交付时间"}]}>
                            <DatePicker format='YYYY-MM-DD' style={{width:'100%'}}/>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
        <Page
            path="/tower-science/drawTask"
            columns={columns}
            extraOperation={<Button type="primary">导出</Button>}
            onFilterSubmit={onFilterSubmit}
            searchFormItems={[
                {
                    name: 'updateStatusTimeStart',
                    label:'最新状态变更时间',
                    children: <DatePicker />
                },
                {
                    name: 'updateStatusTimeEnd',
                    label:'',
                    children: <DatePicker  />
                },
                {
                    name: 'status',
                    label: '任务状态',
                    children: <Select style={{width:"100%"}}>
                        <Select.Option value={1} key={1}>待确认</Select.Option>
                        <Select.Option value={2} key={2}>待指派</Select.Option>
                        <Select.Option value={3} key={3}>待完成</Select.Option>
                        <Select.Option value={4} key={4}>已完成</Select.Option>
                        <Select.Option value={5} key={5}>已提交</Select.Option>
                        <Select.Option value={0} key={0}>已拒绝</Select.Option>
                    </Select>
                },
                {
                    name: 'confirmDept',
                    label: '确认人',
                    children: <Select />
                },
                {
                    name: 'confirmId',
                    label:'',
                    children: <Select  />
                },
                {
                    name: 'fuzzyQueryItem',
                    label: '模糊查询项',
                    children: <Input placeholder="请输入任务编号/合同名称/业务经理进行查询" maxLength={200} />
                },
            ]}
        />
    </>
}