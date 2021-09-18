import React, { useState } from 'react'
import { Space, Input, DatePicker, Button, Form, Modal, Row, Col } from 'antd'
import { FixedType } from 'rc-table/lib/interface';
import { Link, useHistory } from 'react-router-dom'
import { Page } from '../../common'

export default function PickTower(): React.ReactNode {
    const [visible, setVisible] = useState<boolean>(false);
    const history = useHistory();
    const [form] = Form.useForm();
    const handleModalOk = async () => {
        try {
            const submitData = await form.validateFields()
            console.log(submitData)
            setVisible(false)
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
            key: 'projectName',
            title: '杆塔号',
            width: 100,
            dataIndex: 'projectName'
        },
        {
            key: 'projectNumber',
            title: '塔型',
            width: 100,
            dataIndex: 'projectNumber'
        },
        {
            key: 'projectNumber',
            title: '计划交付时间',
            width: 100,
            dataIndex: 'projectNumber'
        },
        {
            key: 'bidBuyEndTime',
            title: '配段人',
            width: 100,
            dataIndex: 'bidBuyEndTime'
        },
        {
            key: 'biddingEndTime',
            title: '杆塔提料状态',
            width: 100,
            dataIndex: 'biddingEndTime'
        },
        {
            key: 'biddingAddress',
            title: '最新状态变更时间',
            width: 200,
            dataIndex: 'biddingAddress'
        },
        {
            key: 'operation',
            title: '操作',
            fixed: 'right' as FixedType,
            width: 230,
            dataIndex: 'operation',
            render: (_: undefined, record: any): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Button type='link' onClick={() => setVisible(true)}>配段</Button>
                    <Link to={`/workMngt/pickList/pickTower/pickTowerDetail/${record.id}`}>杆塔提料明细</Link>
                </Space>
            )
        }
    ]

    const handleModalCancel = () => setVisible(false)
    const formItemLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 17 }
    };
    return (
        <>
            <Modal title='配段信息'  width={1200} visible={visible} onCancel={handleModalCancel} onOk={handleModalOk}>
                <Form form={form} {...formItemLayout}>
                    <Row>
                        <Col span={12}>
                            <Form.Item name="aaaa" label="塔型">
                                <span>JC30153B</span>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="reason" label="杆塔号">
                                <span>A001</span>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item name="aaaa" label="段号">
                                <span>1</span>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="reason" label="段数">
                                <Input/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item name="aaaa" label="段号">
                                <span>2</span>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="reason" label="段数">
                                <Input/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item name="aaaa" label="段号">
                                <span>3</span>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="reason" label="段数">
                                <Input/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item name="aaaa" label="段号">
                                <span>4</span>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="reason" label="段数">
                                <Input/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item name="aaaa" label="段号">
                                <span>5</span>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="reason" label="段数">
                                <Input/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item name="aaaa" label="段号">
                                <span>6</span>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="reason" label="段数">
                                <Input/>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
            <Page
                path="/tower-market/bidInfo"
                columns={columns}
                extraOperation={
                    <Space>
                    <Button type="primary">导出</Button>
                    <Button type="primary">提交</Button>
                    <Button type="primary" onClick={()=>history.goBack()}>返回上一级</Button>
                    </Space>
                }
                searchFormItems={[
                    {
                        name: 'startBidBuyEndTime',
                        label: '最新状态变更时间',
                        children: <DatePicker />
                    },
                    {
                        name: 'startBidBuyEndTime',
                        label: '塔型状态',
                        children: <DatePicker />
                    },
                    {
                        name: 'fuzzyQuery',
                        label:'计划交付时间',
                        children: <Input placeholder="请输入项目名称/项目编码/审批编号/关联合同/制单人进行查询" maxLength={200} />
                    },
                    {
                        name: 'startReleaseDate',
                        label: '模式',
                        children: <DatePicker />
                    },
                    {
                        name: 'biddingStatus',
                        label: '模糊查询项',
                        children: <Input placeholder="请输入放样任务编号/任务单编号/订单编号/内部合同编号/塔型/塔型钢印号进行查询" maxLength={200} />
                    },
                ]}
            />
        </>
    )
}