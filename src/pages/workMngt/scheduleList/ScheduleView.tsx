import React, { useState } from 'react'
import { Space, Input, DatePicker, Button, Form, Modal, Row, Col, Select, Cascader } from 'antd'
import { Link, useHistory, useParams } from 'react-router-dom'
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import TextArea from 'antd/lib/input/TextArea';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
interface ManagementState {
    selectedKeys: React.Key[]
    selected: object[]
}
export default function ScheduleView(): React.ReactNode {
    const [visible, setVisible] = useState<boolean>(false);
    const [scheduleData, setScheduleData] = useState<any|undefined>({});
    const history = useHistory();
    const [form] = Form.useForm();
    const params = useParams<{ id: string }>();
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
            key: 'name',
            title: '塔型',
            width: 100,
            dataIndex: 'name'
        },
        {
            key: 'steelProductShape',
            title: '塔型钢印号',
            width: 100,
            dataIndex: 'steelProductShape'
        },
        {
            key: 'pattern',
            title: '模式',
            width: 100,
            dataIndex: 'pattern',
            render: (value: number, record: object): React.ReactNode => {
                const renderEnum: any = [
                  {
                    value: 1,
                    label: "新放"
                  },
                  {
                    value: 2,
                    label: "重新出卡"
                  },
                  {
                    value: 3,
                    label: "套用"
                  },
                ]
                return <>{renderEnum.find((item: any) => item.value === value).label}</>
            }
        },
        {
            key: 'priority',
            title: '优先级',
            width: 100,
            dataIndex: 'priority',
            render: (value: number, record: object): React.ReactNode => {
                const renderEnum: any = [
                  {
                    value: 1,
                    label: "高"
                  },
                  {
                    value: 2,
                    label: "中"
                  },
                  {
                    value: 3,
                    label: "低"
                  },
                ]
                return <>{renderEnum.find((item: any) => item.value === value).label}</>
            }
        },
        {
            key: 'materialLeaderName',
            title: '提料负责人',
            width: 200,
            dataIndex: 'materialLeaderName'
        },
        {
            key: 'materialDeliverTime',
            title: '提料计划交付时间',
            width: 200,
            dataIndex: 'materialDeliverTime'
        },
        {
            key: 'materialPartLeaderName',
            title: '提料配段负责人',
            width: 100,
            dataIndex: 'materialPartLeaderName'
        },
        {
            key: 'materialPartDeliverTime',
            title: '提料配段计划交付时间',
            width: 200,
            dataIndex: 'materialPartDeliverTime'
        },
        {
            key: 'loftingLeaderName',
            title: '放样负责人',
            width: 100,
            dataIndex: 'loftingLeaderName'
        },
        {
            key: 'loftingPartDeliverTime',
            title: '放样计划交付时间',
            width: 200,
            dataIndex: 'loftingPartDeliverTime'
        },
        {
            key: 'combinedWeldingLeaderName',
            title: '组焊清单负责人',
            width: 100,
            dataIndex: 'combinedWeldingLeaderName'
        },
        {
            key: 'combinedWeldingDeliverTime',
            title: '组焊计划交付时间',
            width: 200,
            dataIndex: 'combinedWeldingDeliverTime'
        },
        {
            key: 'loftingPartLeaderName',
            title: '放样配段负责人',
            width: 100,
            dataIndex: 'loftingPartLeaderName'
        },
        {
            key: 'loftingPartDeliverTime',
            title: '放样配段计划交付时间',
            width: 200,
            dataIndex: 'loftingPartDeliverTime'
        },
        {
            key: 'smallSampleLeaderName',
            title: '小样图负责人',
            width: 100,
            dataIndex: 'smallSampleLeaderName'
        },
        {
            key: 'smallSampleDeliverTime',
            title: '小样图计划交付时间',
            width: 200,
            dataIndex: 'smallSampleDeliverTime'
        },
        {
            key: 'boltLeaderName',
            title: '螺栓清单',
            width: 100,
            dataIndex: 'boltLeaderName'
        },
        {
            key: 'boltDeliverTime',
            title: '螺栓计划交付时间',
            width: 200,
            dataIndex: 'boltDeliverTime'
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
                    <Button type='link' onClick={async ()=>{
                        setVisible(true);
                        // const resData: IResponseData = await RequestUtil.get<IResponseData>(`/tower-science/productCategory/taskPage/${params.id}`);
                        // const { loading, data } =await useRequest(() => new Promise(async (resole, reject) => {
                        //     const data: any = await RequestUtil.get(`/tower-science/productCategory/taskPage/${params.id}`)
                        //     resole(data)
                        // }), {})
                        // setScheduleData(data)
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
                <Form form={form} {...formItemLayout} initialValues={scheduleData}>
                    <Row>
                        <Col span={12}>
                            <Form.Item name="name" label="塔型">
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
                path={`/tower-science/productCategory/taskPage/${params.id}`}
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
                        label: '模式',
                        children:   <Select>
                                        <Select.Option value='1' key='1'>新放</Select.Option>
                                        <Select.Option value='3' key='3'>套用</Select.Option>
                                        <Select.Option value='2' key='2'>重新出卡</Select.Option>
                                    </Select>
                    },
                    {
                        name: 'fuzzyQuery',
                        label:'优先级',
                        children:   <Select>
                                        <Select.Option value='1' key='1'>高</Select.Option>
                                        <Select.Option value='2' key='2'>中</Select.Option>
                                        <Select.Option value='3' key='3'>低</Select.Option>
                                    </Select>
                    },
                    {
                        name: 'startReleaseDate',
                        label: '提料负责人',
                        children: <DatePicker />
                    },
                    {
                        name: 'fuzzyMsg',
                        label: '模糊查询项',
                        children: <Input placeholder="请输入塔型/钢印塔型进行查询" maxLength={200} />
                    },
                ]}
            />
        </>
    )
}