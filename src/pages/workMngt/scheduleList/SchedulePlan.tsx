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
            form?.validateFields().then(async res => {
                const saveData = await form.getFieldsValue(true);
                saveData.id = scheduleData.id;
                await RequestUtil.post('/tower-science/tower-science/assignPlan', saveData).then(async () => {
                    setVisible(false);
                    const planData: any = await RequestUtil.get(`/tower-science/assignPlan`);
                    setTableDataSource(planData);
                    form.resetFields();
                })
            })

        } catch (error) {
            console.log(error)
        }
    }

    const handleModalCancel = () => {
        setLoad(false)
        setVisible(false);
        form.resetFields();
    };

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
                {/* <Spin spinning={load}> */}
                <Form form={form} labelCol={{ span: 8 }}>
                    <Row gutter={12}>
                        <Col span={6}>
                            <Form.Item name="assignName" label="指派方案名称" rules={[{ required: true, message: '请填写指派方案名称' }]}>
                                <Input maxLength={20} />
                            </Form.Item>
                        </Col>
                        <Col span={18} />
                        <Col span={6}>
                            <Form.Item name={'loftingLeaderName'} label="放样负责人" rules={[{
                                required: true,
                                message: '请输入放样负责人！'
                            }]}>
                                <Input size="small" disabled suffix={
                                    <SelectUser key={'loftingLeader'} selectedKey={[form?.getFieldsValue(true)?.loftingLeader]}
                                        onSelect={(selectedRows: Record<string, any>) => {
                                            form.setFieldsValue({
                                                loftingLeader: selectedRows[0]?.userId,
                                                loftingLeaderName: selectedRows[0]?.name,
                                            })
                                        }} />
                                } />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name={'weldingLeaderName'} label="编程负责人" rules={[{
                                required: true,
                                message: '请输入编程负责人！'
                            }]}>
                                <Input size="small" disabled suffix={
                                    <SelectUser key={'weldingLeader'} selectedKey={[form?.getFieldsValue(true)?.weldingLeader]}
                                        onSelect={(selectedRows: Record<string, any>) => {
                                            form.setFieldsValue({
                                                weldingLeader: selectedRows[0]?.userId,
                                                weldingLeaderName: selectedRows[0]?.name,
                                            })
                                        }} />
                                } />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name={'boltLeaderName'} label="螺栓负责人" rules={[{
                                required: true,
                                message: '请输入螺栓负责人！'
                            }]}>
                                <Input size="small" disabled suffix={
                                    <SelectUser key={'boltLeader'} selectedKey={[form?.getFieldsValue(true)?.boltLeader]}
                                        onSelect={(selectedRows: Record<string, any>) => {
                                            form.setFieldsValue({
                                                boltLeader: selectedRows[0]?.userId,
                                                boltLeaderName: selectedRows[0]?.name,
                                            })
                                        }} />
                                } />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name={'drawLeaderName'} label="图纸负责人" rules={[{
                                required: true,
                                message: '请输入图纸负责人！'
                            }]}>
                                <Input size="small" disabled suffix={
                                    <SelectUser key={'drawLeader'} selectedKey={[form?.getFieldsValue(true)?.drawLeader]}
                                        onSelect={(selectedRows: Record<string, any>) => {
                                            form.setFieldsValue({
                                                drawLeader: selectedRows[0]?.userId,
                                                drawLeaderName: selectedRows[0]?.name,
                                            })
                                        }} />
                                } />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name={'loftingUserName'} label="放样员">
                                <Input size="small" disabled suffix={
                                    <SelectUser key={'loftingUser'} selectedKey={form?.getFieldsValue(true)?.loftingUser?.split(',') || []} selectType="checkbox" onSelect={(selectedRows: Record<string, any>) => {
                                        form.setFieldsValue({
                                            loftingUser: selectedRows.map((res: any) => res?.userId).join(','),
                                            loftingUserName: selectedRows.map((res: any) => res?.name).join(',')
                                        })
                                    }} />
                                } />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name={'ncUserName'} label="NC程序">
                                <Input size="small" disabled suffix={
                                    <SelectUser key={'ncUser'} selectedKey={[form?.getFieldsValue(true)?.ncUser]}
                                        onSelect={(selectedRows: Record<string, any>) => {
                                            form.setFieldsValue({
                                                ncUser: selectedRows[0]?.userId,
                                                ncUserName: selectedRows[0]?.name,
                                            })
                                        }} />
                                } />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name={'boltPlanCheckUserName'} label="螺栓计划校核">
                                <Input size="small" disabled suffix={
                                    <SelectUser key={'boltPlanCheckUser'} selectedKey={[form?.getFieldsValue(true)?.boltPlanCheckUser]}
                                        onSelect={(selectedRows: Record<string, any>) => {
                                            form.setFieldsValue({
                                                boltPlanCheckUser: selectedRows[0]?.userId,
                                                boltPlanCheckUserName: selectedRows[0]?.name,
                                            })
                                        }} />
                                } />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name={'deliveryDrawLeaderName'} label="发货图纸">
                                <Input size="small" disabled suffix={
                                    <SelectUser key={'deliveryDrawLeader'} selectedKey={[form?.getFieldsValue(true)?.deliveryDrawLeader]}
                                        onSelect={(selectedRows: Record<string, any>) => {
                                            form.setFieldsValue({
                                                deliveryDrawLeader: selectedRows[0]?.userId,
                                                deliveryDrawLeaderName: selectedRows[0]?.name,
                                            })
                                        }} />
                                } />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name={'loftingMutualReviewName'} label="审图校卡">
                                <Input size="small" disabled suffix={
                                    <SelectUser key={'loftingMutualReview'} selectedKey={form?.getFieldsValue(true)?.loftingMutualReview?.split(',') || []} selectType="checkbox" onSelect={(selectedRows: Record<string, any>) => {
                                        form.setFieldsValue({
                                            loftingMutualReview: selectedRows.map((res: any) => res?.userId).join(','),
                                            loftingMutualReviewName: selectedRows.map((res: any) => res?.name)?.join(',')
                                        })
                                    }} />
                                } />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name={'productPartUserName'} label="杆塔配段">
                                <Input size="small" disabled suffix={
                                    <SelectUser key={'productPartUser'} selectedKey={[form?.getFieldsValue(true)?.productPartUser]}
                                        onSelect={(selectedRows: Record<string, any>) => {
                                            form.setFieldsValue({
                                                productPartUser: selectedRows[0]?.userId,
                                                productPartUserName: selectedRows[0]?.name,
                                            })
                                        }} />
                                } />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name={'boltUserName'} label="螺栓清单">
                                <Input size="small" disabled suffix={
                                    <SelectUser key={'boltUser'} selectedKey={[form?.getFieldsValue(true)?.boltUser]}
                                        onSelect={(selectedRows: Record<string, any>) => {
                                            form.setFieldsValue({
                                                boltUser: selectedRows[0]?.userId,
                                                boltUserName: selectedRows[0]?.name,
                                            })
                                        }} />
                                } />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name={'smallSampleLeaderName'} label="小样图上传" rules={[{
                                required: true,
                                message: '请输入小样图上传！'
                            }]}>
                                <Input size="small" disabled suffix={
                                    <SelectUser key={'smallSampleLeader'} selectedKey={[form?.getFieldsValue(true)?.smallSampleLeader]}
                                        onSelect={(selectedRows: Record<string, any>) => {
                                            form.setFieldsValue({
                                                smallSampleLeader: selectedRows[0]?.userId,
                                                smallSampleLeaderName: selectedRows[0]?.name,
                                            })
                                        }} />
                                } />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name={'weldingUserName'} label="组焊清单">
                                <Input size="small" disabled suffix={
                                    <SelectUser key={'weldingUser'} selectedKey={form?.getFieldsValue(true)?.weldingUser?.split(',') || []} selectType="checkbox" onSelect={(selectedRows: Record<string, any>) => {
                                        form.setFieldsValue({
                                            weldingUser: selectedRows.map((res: any) => res?.userId).join(','),
                                            weldingUserName: selectedRows.map((res: any) => res?.name).join(',')
                                        })
                                    }} />
                                } />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name={'packageUserName'} label="包装清单">
                                <Input size="small" disabled suffix={
                                    <SelectUser key={'packageUser'} selectedKey={[form?.getFieldsValue(true)?.packageUser]}
                                        onSelect={(selectedRows: Record<string, any>) => {
                                            form.setFieldsValue({
                                                packageUser: selectedRows[0]?.userId,
                                                packageUserName: selectedRows[0]?.name,
                                            })
                                        }} />
                                } />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name={'boltCheckUserName'} label="螺栓清单校核">
                                <Input size="small" disabled suffix={
                                    <SelectUser key={'boltCheckUser'} selectedKey={[form?.getFieldsValue(true)?.boltCheckUser]}
                                        onSelect={(selectedRows: Record<string, any>) => {
                                            form.setFieldsValue({
                                                boltCheckUser: selectedRows[0]?.userId,
                                                boltCheckUserName: selectedRows[0]?.name,
                                            })
                                        }} />
                                } />
                            </Form.Item>
                        </Col>
                        <Col span={6} />
                        <Col span={6}>
                            <Form.Item name={'legConfigurationUserName'} label="高低腿配置编制">
                                <Input size="small" disabled suffix={
                                    <SelectUser key={'legConfigurationUser'} selectedKey={[form?.getFieldsValue(true)?.legConfigurationUser]}
                                        onSelect={(selectedRows: Record<string, any>) => {
                                            form.setFieldsValue({
                                                legConfigurationUser: selectedRows[0]?.userId,
                                                legConfigurationUserName: selectedRows[0]?.name,
                                            })
                                        }} />
                                } />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name={'legProgrammingUserName'} label="编程高低腿">
                                <Input size="small" disabled suffix={
                                    <SelectUser key={'legProgrammingUser'} selectedKey={[form?.getFieldsValue(true)?.legProgrammingUser]}
                                        onSelect={(selectedRows: Record<string, any>) => {
                                            form.setFieldsValue({
                                                legProgrammingUser: selectedRows[0]?.userId,
                                                legProgrammingUserName: selectedRows[0]?.name,
                                            })
                                        }} />
                                } />
                            </Form.Item>
                        </Col>
                        <Col span={12} />
                        <Col span={6}>
                            <Form.Item name={'legConfigurationCheckUserName'} label="高低腿配置校核">
                                <Input size="small" disabled suffix={
                                    <SelectUser key={'legConfigurationCheckUser'} selectedKey={[form?.getFieldsValue(true)?.legConfigurationCheckUser]}
                                        onSelect={(selectedRows: Record<string, any>) => {
                                            form.setFieldsValue({
                                                legConfigurationCheckUser: selectedRows[0]?.userId,
                                                legConfigurationCheckUserName: selectedRows[0]?.name,
                                            })
                                        }} />
                                } />
                            </Form.Item>
                        </Col>
                        <Col span={18} />
                        <Col span={6}>
                            <Form.Item name={'hangLineBoardCheckUserName'} label="挂线板校核">
                                <Input size="small" disabled suffix={
                                    <SelectUser key={'hangLineBoardCheckUser'} selectedKey={[form?.getFieldsValue(true)?.hangLineBoardCheckUser]}
                                        onSelect={(selectedRows: Record<string, any>) => {
                                            form.setFieldsValue({
                                                hangLineBoardCheckUser: selectedRows[0]?.userId,
                                                hangLineBoardCheckUserName: selectedRows[0]?.name,
                                            })
                                        }} />
                                } />
                            </Form.Item>
                        </Col>
                        <Col span={18} />
                    </Row>
                </Form>
                {/* </Spin> */}
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
                                            ...resData
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