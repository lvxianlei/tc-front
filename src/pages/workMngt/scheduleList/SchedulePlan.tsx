import React, { useState } from 'react'
import { Space, Input, Button, Form, Modal, Table, Popconfirm, Spin, Row, Col } from 'antd'
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import SelectUser from '../../common/SelectUser';
export default function SchedulePlan(props: any) {
    const [visible, setVisible] = useState<boolean>(false);
    const [tableVisible, setTableVisible] = useState<boolean>(false);
    const [load, setLoad] = useState<boolean>(false);
    const [scheduleData, setScheduleData] = useState<any | undefined>({});
    const [form] = Form.useForm();
    const [tableDataSource, setTableDataSource] = useState<any | undefined>([])
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const planData: any = await RequestUtil.get(`/tower-science/assignPlan`);
        setTableDataSource(planData);
        resole(data)
    }), {})

    const handleModalOk = async () => {
        try {
            const saveData = await form.validateFields();
            saveData.id = scheduleData.id;
            saveData.materialLeader = saveData.material
            saveData.materialLeaderName = saveData.materialName
            saveData.boltLeader = saveData.bolt
            saveData.boltLeaderName = saveData.boltName
            saveData.weldingLeader = saveData.welding
            saveData.weldingLeaderName = saveData.weldingName
            saveData.loftingLeader = saveData.lofting
            saveData.loftingLeaderName = saveData.loftingName
            saveData.drawLeader = saveData.draw
            saveData.drawLeaderName = saveData.drawName
            saveData.smallSampleLeader = saveData.smallSample
            saveData.smallSampleLeaderName = saveData.smallSampleName
            await RequestUtil.post('/tower-science/tower-science/assignPlan', saveData).then(async () => {
                setVisible(false);
                const planData: any = await RequestUtil.get(`/tower-science/assignPlan`);
                setTableDataSource(planData);
                form.resetFields();
            })
        } catch (error) {
            console.log(error)
        }
    }

    const handleModalCancel = () => { setVisible(false); form.resetFields() };

    return (
        <>
            <Modal
                title='指派信息'
                width='80%'
                visible={visible}
                onCancel={handleModalCancel}
                footer={
                    <>
                        <Button onClick={handleModalCancel}>关闭</Button>
                        <Button type='primary' onClick={handleModalOk}>保存并提交</Button>
                    </>
                }
            >
                <Spin spinning={load}>
                    <Form form={form} labelCol={{ span: 8 }}>
                        <Row gutter={12}>
                            <Col span={6}>
                                <Form.Item name="assignName" label="指派方案名称" rules={[{ required: true, message: '请填写指派方案名称' }]}>
                                    <Input maxLength={20} />
                                </Form.Item>
                            </Col>
                            <Col span={18}/>
                            <Col span={6}>
                                <Form.Item name={'loftingName'} label="放样负责人" rules={[{
                                    required: true,
                                    message: '请输入放样负责人！'
                                }]}>
                                    <Input size="small" disabled suffix={
                                        <SelectUser key={'lofting'} selectedKey={[form?.getFieldsValue(true)?.lofting]}
                                            onSelect={(selectedRows: Record<string, any>) => {
                                                form.setFieldsValue({
                                                    lofting: selectedRows[0]?.userId,
                                                    loftingName: selectedRows[0]?.name,
                                                })
                                            }} />
                                    } />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item name={'loftingName'} label="编程负责人" rules={[{
                                    required: true,
                                    message: '请输入编程负责人！'
                                }]}>
                                    <Input size="small" disabled suffix={
                                        <SelectUser key={'lofting'} selectedKey={[form?.getFieldsValue(true)?.lofting]}
                                            onSelect={(selectedRows: Record<string, any>) => {
                                                form.setFieldsValue({
                                                    lofting: selectedRows[0]?.userId,
                                                    loftingName: selectedRows[0]?.name,
                                                })
                                            }} />
                                    } />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item name={'loftingName'} label="螺栓负责人" rules={[{
                                    required: true,
                                    message: '请输入螺栓负责人！'
                                }]}>
                                    <Input size="small" disabled suffix={
                                        <SelectUser key={'lofting'} selectedKey={[form?.getFieldsValue(true)?.lofting]}
                                            onSelect={(selectedRows: Record<string, any>) => {
                                                form.setFieldsValue({
                                                    lofting: selectedRows[0]?.userId,
                                                    loftingName: selectedRows[0]?.name,
                                                })
                                            }} />
                                    } />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item name={'loftingName'} label="图纸负责人" rules={[{
                                    required: true,
                                    message: '请输入图纸负责人！'
                                }]}>
                                    <Input size="small" disabled suffix={
                                        <SelectUser key={'lofting'} selectedKey={[form?.getFieldsValue(true)?.lofting]}
                                            onSelect={(selectedRows: Record<string, any>) => {
                                                form.setFieldsValue({
                                                    lofting: selectedRows[0]?.userId,
                                                    loftingName: selectedRows[0]?.name,
                                                })
                                            }} />
                                    } />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item name={'loftingName'} label="放样员">
                                    <Input size="small" disabled suffix={
                                        <SelectUser key={'lofting'} selectedKey={[form?.getFieldsValue(true)?.lofting]}
                                            onSelect={(selectedRows: Record<string, any>) => {
                                                form.setFieldsValue({
                                                    lofting: selectedRows[0]?.userId,
                                                    loftingName: selectedRows[0]?.name,
                                                })
                                            }} />
                                    } />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item name={'loftingName'} label="NC程序">
                                    <Input size="small" disabled suffix={
                                        <SelectUser key={'lofting'} selectedKey={[form?.getFieldsValue(true)?.lofting]}
                                            onSelect={(selectedRows: Record<string, any>) => {
                                                form.setFieldsValue({
                                                    lofting: selectedRows[0]?.userId,
                                                    loftingName: selectedRows[0]?.name,
                                                })
                                            }} />
                                    } />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item name={'loftingName'} label="螺栓计划校核">
                                    <Input size="small" disabled suffix={
                                        <SelectUser key={'lofting'} selectedKey={[form?.getFieldsValue(true)?.lofting]}
                                            onSelect={(selectedRows: Record<string, any>) => {
                                                form.setFieldsValue({
                                                    lofting: selectedRows[0]?.userId,
                                                    loftingName: selectedRows[0]?.name,
                                                })
                                            }} />
                                    } />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item name={'loftingName'} label="发货图纸">
                                    <Input size="small" disabled suffix={
                                        <SelectUser key={'lofting'} selectedKey={[form?.getFieldsValue(true)?.lofting]}
                                            onSelect={(selectedRows: Record<string, any>) => {
                                                form.setFieldsValue({
                                                    lofting: selectedRows[0]?.userId,
                                                    loftingName: selectedRows[0]?.name,
                                                })
                                            }} />
                                    } />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item name={'loftingName'} label="审图交卡">
                                    <Input size="small" disabled suffix={
                                        <SelectUser key={'lofting'} selectedKey={[form?.getFieldsValue(true)?.lofting]}
                                            onSelect={(selectedRows: Record<string, any>) => {
                                                form.setFieldsValue({
                                                    lofting: selectedRows[0]?.userId,
                                                    loftingName: selectedRows[0]?.name,
                                                })
                                            }} />
                                    } />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item name={'loftingName'} label="杆塔配段">
                                    <Input size="small" disabled suffix={
                                        <SelectUser key={'lofting'} selectedKey={[form?.getFieldsValue(true)?.lofting]}
                                            onSelect={(selectedRows: Record<string, any>) => {
                                                form.setFieldsValue({
                                                    lofting: selectedRows[0]?.userId,
                                                    loftingName: selectedRows[0]?.name,
                                                })
                                            }} />
                                    } />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item name={'loftingName'} label="螺栓清单">
                                    <Input size="small" disabled suffix={
                                        <SelectUser key={'lofting'} selectedKey={[form?.getFieldsValue(true)?.lofting]}
                                            onSelect={(selectedRows: Record<string, any>) => {
                                                form.setFieldsValue({
                                                    lofting: selectedRows[0]?.userId,
                                                    loftingName: selectedRows[0]?.name,
                                                })
                                            }} />
                                    } />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item name={'loftingName'} label="小样图上传" rules={[{
                                    required: true,
                                    message: '请输入小样图上传！'
                                }]}>
                                    <Input size="small" disabled suffix={
                                        <SelectUser key={'lofting'} selectedKey={[form?.getFieldsValue(true)?.lofting]}
                                            onSelect={(selectedRows: Record<string, any>) => {
                                                form.setFieldsValue({
                                                    lofting: selectedRows[0]?.userId,
                                                    loftingName: selectedRows[0]?.name,
                                                })
                                            }} />
                                    } />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item name={'loftingName'} label="组焊清单">
                                    <Input size="small" disabled suffix={
                                        <SelectUser key={'lofting'} selectedKey={[form?.getFieldsValue(true)?.lofting]}
                                            onSelect={(selectedRows: Record<string, any>) => {
                                                form.setFieldsValue({
                                                    lofting: selectedRows[0]?.userId,
                                                    loftingName: selectedRows[0]?.name,
                                                })
                                            }} />
                                    } />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item name={'loftingName'} label="包装清单">
                                    <Input size="small" disabled suffix={
                                        <SelectUser key={'lofting'} selectedKey={[form?.getFieldsValue(true)?.lofting]}
                                            onSelect={(selectedRows: Record<string, any>) => {
                                                form.setFieldsValue({
                                                    lofting: selectedRows[0]?.userId,
                                                    loftingName: selectedRows[0]?.name,
                                                })
                                            }} />
                                    } />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item name={'loftingName'} label="螺栓清单校核">
                                    <Input size="small" disabled suffix={
                                        <SelectUser key={'lofting'} selectedKey={[form?.getFieldsValue(true)?.lofting]}
                                            onSelect={(selectedRows: Record<string, any>) => {
                                                form.setFieldsValue({
                                                    lofting: selectedRows[0]?.userId,
                                                    loftingName: selectedRows[0]?.name,
                                                })
                                            }} />
                                    } />
                                </Form.Item>
                            </Col>
                            <Col span={6} />
                            <Col span={6}>
                                <Form.Item name={'loftingName'} label="高低腿配置编制">
                                    <Input size="small" disabled suffix={
                                        <SelectUser key={'lofting'} selectedKey={[form?.getFieldsValue(true)?.lofting]}
                                            onSelect={(selectedRows: Record<string, any>) => {
                                                form.setFieldsValue({
                                                    lofting: selectedRows[0]?.userId,
                                                    loftingName: selectedRows[0]?.name,
                                                })
                                            }} />
                                    } />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item name={'loftingName'} label="编程高低腿">
                                    <Input size="small" disabled suffix={
                                        <SelectUser key={'lofting'} selectedKey={[form?.getFieldsValue(true)?.lofting]}
                                            onSelect={(selectedRows: Record<string, any>) => {
                                                form.setFieldsValue({
                                                    lofting: selectedRows[0]?.userId,
                                                    loftingName: selectedRows[0]?.name,
                                                })
                                            }} />
                                    } />
                                </Form.Item>
                            </Col>
                            <Col span={12} />
                            <Col span={6}>
                                <Form.Item name={'loftingName'} label="高低腿配置校核">
                                    <Input size="small" disabled suffix={
                                        <SelectUser key={'lofting'} selectedKey={[form?.getFieldsValue(true)?.lofting]}
                                            onSelect={(selectedRows: Record<string, any>) => {
                                                form.setFieldsValue({
                                                    lofting: selectedRows[0]?.userId,
                                                    loftingName: selectedRows[0]?.name,
                                                })
                                            }} />
                                    } />
                                </Form.Item>
                            </Col>
                            <Col span={18} />
                            <Col span={6}>
                                <Form.Item name={'loftingName'} label="挂线板校核">
                                    <Input size="small" disabled suffix={
                                        <SelectUser key={'lofting'} selectedKey={[form?.getFieldsValue(true)?.lofting]}
                                            onSelect={(selectedRows: Record<string, any>) => {
                                                form.setFieldsValue({
                                                    lofting: selectedRows[0]?.userId,
                                                    loftingName: selectedRows[0]?.name,
                                                })
                                            }} />
                                    } />
                                </Form.Item>
                            </Col>
                            <Col span={18} />
                        </Row>
                    </Form>
                </Spin>
            </Modal>
            <Modal
                title='指派方案'
                width={700}
                visible={tableVisible}
                onCancel={() => {
                    props?.plan(tableDataSource)
                    setTableVisible(false)
                }}
                footer={false}
            >
                <Button type='primary' onClick={() => {
                    form.setFieldsValue({
                        assignName: '',
                    })
                    setScheduleData({})
                    setVisible(true)

                }} style={{ marginBottom: '8px' }}>添加</Button>
                <Table
                    dataSource={tableDataSource}
                    pagination={false}
                    size='small'
                    columns={[
                        {
                            title: '方案名称',
                            dataIndex: 'assignName'
                        }, {
                            title: '操作',
                            dataIndex: 'operation',
                            render: (_: undefined, record: any): React.ReactNode => (
                                <Space direction="horizontal" size="small">
                                    <Button type='link' onClick={async () => {
                                        setLoad(true)
                                        const resData: any = await RequestUtil.get(`/tower-science/assignPlan/planDetailById/${record.id}`)
                                        setScheduleData(resData);
                                        form.setFieldsValue({
                                            ...resData,
                                            bolt: resData.boltLeader,
                                            boltName: resData.boltLeaderName,
                                            welding: resData.weldingLeader,
                                            weldingName: resData.weldingLeaderName,
                                            lofting: resData.loftingLeader,
                                            loftingName: resData.loftingLeaderName,
                                            draw: resData.drawLeader,
                                            drawName: resData.drawLeaderName,
                                            smallSample: resData.smallSampleLeader,
                                            smallSampleName: resData.smallSampleLeaderName
                                        });
                                        setLoad(false)
                                        setVisible(true);
                                    }}>编辑</Button>
                                    <Popconfirm
                                        title="确认删除?"
                                        onConfirm={() => {
                                            RequestUtil.delete(`/tower-science/assignPlan/${record.id}`).then(async res => {
                                                const planData: any = await RequestUtil.get(`/tower-science/assignPlan`);
                                                setTableDataSource(planData);
                                            });
                                        }}
                                        okText="确认"
                                        cancelText="取消"
                                    >
                                        <Button type="link">删除</Button>
                                    </Popconfirm>
                                </Space>
                            )
                        }
                    ]}
                />
            </Modal>
            <Button type='primary' onClick={() => {
                setTableVisible(true)
            }}>指派方案管理</Button>

        </>
    )
}