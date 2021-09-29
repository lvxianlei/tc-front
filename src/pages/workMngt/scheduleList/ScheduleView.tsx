import React, { useState } from 'react'
import { Space, Input, Button, Form, Modal, Row, Col, Select, Cascader, DatePicker } from 'antd'
import { Link, useHistory, useParams } from 'react-router-dom'
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import TextArea from 'antd/lib/input/TextArea';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import moment from 'moment';
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
            const submitData = await form.validateFields();
            console.log(submitData);
            submitData.id = scheduleData.id;
            submitData.boltDeliverTime= moment(submitData.boltDeliverTime).format('YYYY-MM-DD');
            submitData.combinedWeldingDeliverTime= moment(submitData.combinedWeldingDeliverTime).format('YYYY-MM-DD');
            submitData.loftingDeliverTime= moment(submitData.loftingDeliverTime).format('YYYY-MM-DD');
            submitData.loftingPartDeliverTime= moment(submitData.loftingPartDeliverTime).format('YYYY-MM-DD');
            submitData.materialDeliverTime=moment(submitData.materialDeliverTime).format('YYYY-MM-DD');
            submitData.materialPartDeliverTime= moment(submitData.materialPartDeliverTime).format('YYYY-MM-DD');
            submitData.smallSampleDeliverTime= moment(submitData.smallSampleDeliverTime).format('YYYY-MM-DD');
            await RequestUtil.post('/tower-science/productCategory/assign', submitData).then(()=>{
                setVisible(false)
            })
        
        } catch (error) {
            console.log(error)
        }
    }
    const handleModalSave = async () => {
        try {
            const saveData = await form.validateFields();
            saveData.id = scheduleData.id;
            saveData.boltDeliverTime= moment(saveData.boltDeliverTime).format('YYYY-MM-DD');
            saveData.combinedWeldingDeliverTime= moment(saveData.combinedWeldingDeliverTime).format('YYYY-MM-DD');
            saveData.loftingDeliverTime= moment(saveData.loftingDeliverTime).format('YYYY-MM-DD');
            saveData.loftingPartDeliverTime= moment(saveData.loftingPartDeliverTime).format('YYYY-MM-DD');
            saveData.materialDeliverTime=moment(saveData.materialDeliverTime).format('YYYY-MM-DD');
            saveData.materialPartDeliverTime= moment(saveData.materialPartDeliverTime).format('YYYY-MM-DD');
            saveData.smallSampleDeliverTime= moment(saveData.smallSampleDeliverTime).format('YYYY-MM-DD');
            await RequestUtil.post('/tower-science/productCategory/assign/save', saveData).then(()=>{
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
                        const resData: any = await RequestUtil.get(`/tower-science/productCategory/${record.id}`);
                        setScheduleData(resData);
                        form.setFieldsValue({
                            ...resData,
                            boltDeliverTime: moment(resData.boltDeliverTime),
                            combinedWeldingDeliverTime: moment(resData.combinedWeldingDeliverTime),
                            loftingDeliverTime: moment(resData.loftingDeliverTime),
                            loftingPartDeliverTime: moment(resData.loftingPartDeliverTime),
                            materialDeliverTime: moment(resData.materialDeliverTime),
                            materialPartDeliverTime: moment(resData.materialPartDeliverTime),
                            smallSampleDeliverTime: moment(resData.smallSampleDeliverTime)
                        });
                        setVisible(true);
                    }}>指派</Button>
                </Space>
            )
        }
    ]

    const handleModalCancel = () => setVisible(false);
    const formItemLayout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 24 }
    };
    const onFilterSubmit = (value: any) => {
        return value
    }
    return (
        <>
            <Modal 
                title='指派信息'  
                width={1200} 
                visible={visible} 
                onCancel={handleModalCancel}
                footer={
                    <>
                        <Button onClick={handleModalCancel}>取消</Button>
                        <Button type='primary' ghost onClick={handleModalSave}>保存</Button>
                        <Button type='primary' onClick={handleModalOk}>保存并提交</Button>
                    </>
                }
            >
                {console.log(form.getFieldsValue(true))}
                <Form form={form} {...formItemLayout} initialValues={scheduleData||{}}>
                    <Row>
                        <Col span={12}>
                            <Row>
                                <Col span={15}>
                                    <Form.Item name="name" label="塔型" >
                                        <span>{scheduleData.name}</span>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="pattern" label="模式" rules={[{required: true,message:'请选择模式'}]}>
                                <Select>
                                    <Select.Option value={1} key={1}>新放</Select.Option>
                                    <Select.Option value={3} key={3}>套用</Select.Option>
                                    <Select.Option value={2} key={2}>重新出卡</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Row>
                                <Col span={15}>
                                    <Form.Item name="materialLeader" label="提料负责人" rules={[{required: true,message:'请选择提料负责人部门'}]} >
                                        <Select/>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item name="materialLeader" label="" rules={[{required: true,message:'请选择提料负责人'}]} >
                                        <Select/>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="materialDeliverTime" label="计划交付时间" rules={[{required: true,message:'请选择计划交付时间'}]} >
                                <DatePicker  style={{width:'100%'}}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Row>
                                <Col span={15}>
                                    <Form.Item name="materialPartLeader" label="提料配段负责人" rules={[{required: true,message:'请选择提料配段负责人'}]} >
                                        <Input/>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item name="materialPartLeader" label="" rules={[{required: true,message:'请选择提料负责人'}]} >
                                        <Select/>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="materialPartDeliverTime" label="计划交付时间" rules={[{required: true,message:'请选择计划交付时间'}]} >
                                <DatePicker  style={{width:'100%'}} disabled/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Row>
                                <Col span={15}>
                                    <Form.Item name="loftingLeader" label="放样负责人" rules={[{required: true,message:'请选择放样负责人'}]}>
                                        <Select/>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item name="materialLeader" label="" rules={[{required: true,message:'请选择提料负责人'}]} >
                                        <Select/>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="loftingDeliverTime" label="计划交付时间" rules={[{required: true,message:'请选择计划交付时间'}]} >
                                <DatePicker  style={{width:'100%'}}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Row>
                                <Col span={15}>
                                    <Form.Item name="combinedWeldingLeader" label="组焊清单负责人 " rules={[{required: true,message:'请选择组焊清单负责人 '}]} >
                                        <Select/>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item name="materialLeader" label="" rules={[{required: true,message:'请选择提料负责人'}]} >
                                        <Select/>
                                    </Form.Item>
                                </Col>
                            </Row>
                            
                        </Col>
                        <Col span={12}>
                            <Form.Item name="combinedWeldingDeliverTime" label="计划交付时间" rules={[{required: true,message:'请选择计划交付时间'}]} >
                                <DatePicker  style={{width:'100%'}} disabled/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Row>
                                <Col span={15}>
                                    <Form.Item name="loftingPartLeader" label="放样配段负责人" rules={[{required: true,message:'请选择放样配段负责人'}]} >
                                        <Select/>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item name="materialLeader" label="" rules={[{required: true,message:'请选择提料负责人'}]} >
                                        <Select/>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="loftingPartDeliverTime" label="计划交付时间" rules={[{required: true,message:'请选择计划交付时间'}]} >
                                <DatePicker  style={{width:'100%'}} disabled/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Row>
                                <Col span={15}>
                                    <Form.Item name="smallSampleLeader" label="小样图负责人" rules={[{required: true,message:'请选择小样图负责人'}]} >
                                        <Select/>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item name="materialLeader" label="" rules={[{required: true,message:'请选择提料负责人'}]} >
                                        <Select/>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="smallSampleDeliverTime" label="计划交付时间" rules={[{required: true,message:'请选择计划交付时间'}]}>
                                <DatePicker  style={{width:'100%'}} disabled/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Row>
                                <Col span={15}>
                                    <Form.Item name="boltLeader" label="螺栓清单负责人" rules={[{required: true,message:'请选择螺栓清单负责人'}]} >
                                        <Select/>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item name="materialLeader" label="" rules={[{required: true,message:'请选择提料负责人'}]} >
                                        <Select/>
                                    </Form.Item>
                                </Col>
                            </Row>
                            
                        </Col>
                        <Col span={12}>
                            <Form.Item name="boltDeliverTime" label="计划交付时间" rules={[{required: true,message:'请选择计划交付时间'}]} >
                                <DatePicker  style={{width:'100%'}} disabled/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Row>
                                <Col span={15}>
                                    <Form.Item name="priority" label="优先级" rules={[{required: true,message:'请选择优先级'}]} > 
                                        <Select>
                                            <Select.Option value={1} key={1}>高</Select.Option>
                                            <Select.Option value={2} key={2}>中</Select.Option>
                                            <Select.Option value={3} key={3}>低</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="description" label="备注"  >
                                <TextArea rows={1}/>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
            <Page
                path={ `/tower-science/productCategory/taskPage/${params.id}` }
                columns={ columns }
                extraOperation={
                    <Space>
                        <Button type="primary">导出</Button>
                        <Button type="primary" onClick={ () => history.goBack() }>返回上一级</Button>
                    </Space>
                }
                onFilterSubmit={ onFilterSubmit }
                // tableProps={{
                // rowSelection: {
                //     selectedRowKeys: selectKeys.selectedKeys,
                //     onChange: SelectChange
                // }
                // }}
                searchFormItems={[
                    {
                        name: 'pattern',
                        label: '模式',
                        children:   <Select style={{width:"100%"}}>
                                        <Select.Option value='1' key='1'>新放</Select.Option>
                                        <Select.Option value='3' key='3'>套用</Select.Option>
                                        <Select.Option value='2' key='2'>重新出卡</Select.Option>
                                    </Select>
                    },
                    {
                        name: 'priority',
                        label:'优先级',
                        children:   <Select style={{width:"100%"}}>
                                        <Select.Option value='1' key='1'>高</Select.Option>
                                        <Select.Option value='2' key='2'>中</Select.Option>
                                        <Select.Option value='3' key='3'>低</Select.Option>
                                    </Select>
                    },
                    {
                        name: 'materialPartLeader',
                        label: '提料负责人',
                        children: <Input />
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