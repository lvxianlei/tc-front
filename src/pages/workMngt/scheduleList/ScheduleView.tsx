import React, { useState } from 'react'
import { Space, Input, DatePicker, Button, Form, Modal, Row, Col, Select, Cascader } from 'antd'
import { Link, useHistory } from 'react-router-dom'
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import TextArea from 'antd/lib/input/TextArea';
interface ManagementState {
    selectedKeys: React.Key[]
    selected: object[]
}
export default function ScheduleView(): React.ReactNode {
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
            title: '塔型',
            width: 100,
            dataIndex: 'projectName'
        },
        {
            key: 'projectName',
            title: '塔型钢印号',
            width: 100,
            dataIndex: 'projectName'
        },
        {
            key: 'projectName',
            title: '模式',
            width: 100,
            dataIndex: 'projectName'
        },
        {
            key: 'projectName',
            title: '优先级',
            width: 100,
            dataIndex: 'projectName'
        },
        {
            key: 'bidBuyEndTime',
            title: '提料负责人',
            width: 200,
            dataIndex: 'bidBuyEndTime'
        },
        {
            key: 'biddingEndTime',
            title: '提料计划交付时间',
            width: 200,
            dataIndex: 'biddingEndTime'
        },
        {
            key: 'biddingAgency',
            title: '提料配段负责人',
            width: 100,
            dataIndex: 'biddingAgency'
        },
        {
            key: 'biddingAddress',
            title: '提料配段计划交付时间',
            width: 200,
            dataIndex: 'biddingAddress'
        },
        {
            key: 'biddingAgency',
            title: '放样负责人',
            width: 100,
            dataIndex: 'biddingAgency'
        },
        {
            key: 'biddingAddress',
            title: '放样计划交付时间',
            width: 200,
            dataIndex: 'biddingAddress'
        },
        {
            key: 'biddingAgency',
            title: '组焊清单负责人',
            width: 100,
            dataIndex: 'biddingAgency'
        },
        {
            key: 'biddingAddress',
            title: '组焊计划交付时间',
            width: 200,
            dataIndex: 'biddingAddress'
        },
        {
            key: 'biddingAgency',
            title: '放样配段负责人',
            width: 100,
            dataIndex: 'biddingAgency'
        },
        {
            key: 'biddingAddress',
            title: '放样配段计划交付时间',
            width: 200,
            dataIndex: 'biddingAddress'
        },
        {
            key: 'biddingAgency',
            title: '小样图负责人',
            width: 100,
            dataIndex: 'biddingAgency'
        },
        {
            key: 'biddingAddress',
            title: '小样图计划交付时间',
            width: 200,
            dataIndex: 'biddingAddress'
        },
        {
            key: 'biddingAgency',
            title: '螺栓清单',
            width: 100,
            dataIndex: 'biddingAgency'
        },
        {
            key: 'biddingAddress',
            title: '螺栓计划交付时间',
            width: 200,
            dataIndex: 'biddingAddress'
        },
        {
            key: 'biddingAddress',
            title: '备注',
            width: 200,
            dataIndex: 'biddingAddress'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 100,
            render: (_: undefined, record: any): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Button type='link' onClick={()=>{
                        setVisible(true)
                    }}>指派</Button>
                </Space>
            )
        }
    ]

    const handleModalCancel = () => setVisible(false);
    const formItemLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 17 }
    };
    return (
        <>
            <Modal title='指派信息'  width={1200} visible={visible} onCancel={handleModalCancel} onOk={handleModalOk}>
                <Form form={form} {...formItemLayout}>
                    <Row>
                        <Col span={12}>
                            <Form.Item name="aaaa" label="塔型">
                                <span>JC30153B</span>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="reason" label="模式" rules={[{required: true,message:'请选择模式'}]}>
                                <Select>
                                    <Select.Option value='0' key='0'>新放</Select.Option>
                                    <Select.Option value='1' key='1'>套用</Select.Option>
                                    <Select.Option value='2' key='2'>重新出卡</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item name="aaaa" label="提料负责人" rules={[{required: true,message:'请选择提料负责人'}]}>
                                <Cascader/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="reason" label="计划交付时间" rules={[{required: true,message:'请选择计划交付时间'}]}>
                                <DatePicker format='YYYY-MM-DD' style={{width:'100%'}}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item name="aaaa" label="提料配段负责人" rules={[{required: true,message:'请选择提料配段负责人'}]}>
                                <Cascader/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="reason" label="计划交付时间" rules={[{required: true,message:'请选择计划交付时间'}]}>
                                <DatePicker format='YYYY-MM-DD' style={{width:'100%'}}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item name="aaaa" label="放样负责人" rules={[{required: true,message:'请选择放样负责人'}]}>
                                <Cascader/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="reason" label="计划交付时间" rules={[{required: true,message:'请选择计划交付时间'}]}>
                                <DatePicker format='YYYY-MM-DD' style={{width:'100%'}}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item name="aaaa" label="组焊清单负责人 " rules={[{required: true,message:'请选择组焊清单负责人 '}]}>
                                <Cascader/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="reason" label="计划交付时间" rules={[{required: true,message:'请选择计划交付时间'}]}>
                                <DatePicker format='YYYY-MM-DD' style={{width:'100%'}}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item name="aaaa" label="放样配段负责人" rules={[{required: true,message:'请选择放样配段负责人'}]}>
                                <Cascader/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="reason" label="计划交付时间" rules={[{required: true,message:'请选择计划交付时间'}]}>
                                <DatePicker format='YYYY-MM-DD' style={{width:'100%'}}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item name="aaaa" label="小样图负责人" rules={[{required: true,message:'请选择小样图负责人'}]}>
                                <Cascader/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="reason" label="计划交付时间" rules={[{required: true,message:'请选择计划交付时间'}]}>
                                <DatePicker format='YYYY-MM-DD' style={{width:'100%'}}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item name="aaaa" label="螺栓清单负责人" rules={[{required: true,message:'请选择螺栓清单负责人'}]}>
                                <Cascader/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="reason" label="计划交付时间" rules={[{required: true,message:'请选择计划交付时间'}]}>
                                <DatePicker format='YYYY-MM-DD' style={{width:'100%'}}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item name="aaaa" label="优先级" rules={[{required: true,message:'请选择优先级'}]}>
                                <Cascader/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="decription" label="备注" >
                                <TextArea/>
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
                        <Button type="primary" onClick={() => history.goBack()}>返回上一级</Button>
                    </Space>
                }
                // tableProps={{
                // rowSelection: {
                //     selectedRowKeys: selectKeys.selectedKeys,
                //     onChange: SelectChange
                // }
                // }}
                searchFormItems={[
                    {
                        name: 'startBidBuyEndTime',
                        label: '最新状态变更时间',
                        children: <DatePicker />
                    },
                    {
                        name: 'fuzzyQuery',
                        label:'任务状态',
                        children: <Input placeholder="请输入项目名称/项目编码/审批编号/关联合同/制单人进行查询" maxLength={200} />
                    },
                    {
                        name: 'startReleaseDate',
                        label: '计划交付时间',
                        children: <DatePicker />
                    },
                    {
                        name: 'biddingStatus',
                        label: '模糊查询项',
                        children: <Input placeholder="请输入放样任务编号/任务单编号、订单编号/内部合同编号进行查询" maxLength={200} />
                    },
                ]}
            />
        </>
    )
}