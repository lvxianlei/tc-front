import React, { useState } from 'react'
import { Space, Input, Button, Form, Modal, Row, Col, Select, DatePicker, TreeSelect, Spin, message, Radio, Checkbox } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { CommonTable, DetailTitle, Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import TextArea from 'antd/lib/input/TextArea';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import moment from 'moment';
import { patternTypeOptions } from '../../../configuration/DictionaryOptions';
import SchedulePlan from './SchedulePlan';
import { tableColumns, columns } from "./userBase.json"
import SelectUser from '../../common/SelectUser';

export default function ScheduleView(): React.ReactNode {
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [visible, setVisible] = useState<boolean>(false);
    const [edit, setEdit] = useState<boolean>(false);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [load, setLoad] = useState<boolean>(false);
    const [batch, setBatch] = useState<boolean>(false);
    const [filterValue, setFilterValue] = useState({});
    const [scheduleData, setScheduleData] = useState<any | undefined>({});
    const history = useHistory();
    const [form] = Form.useForm();
    const [planData, setPlanData] = useState<any | undefined>([]);
    const params = useParams<{ id: string, status: string }>();
    const [detailData, setDetailData] = useState<any>({});
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const planData: any = await RequestUtil.get(`/tower-science/assignPlan`);
        setPlanData(planData);
        resole(data)
    }), {})

    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: any[]): void => {
        setSelectedKeys(selectedRowKeys);
        setSelectedRows(selectedRows);
    }

    const handleModalOk = async () => {
        try {
            await form.validateFields();
            const saveData = await form.getFieldsValue(true);
            saveData.id = scheduleData.id;
            saveData.assignPlanId = scheduleData.assignPlanId;
            saveData.idList = !batch && selectedKeys.length > 0 ? selectedKeys : [scheduleData.productCategoryId];
            saveData.boltDeliverTime = moment(saveData.boltDeliverTime).format('YYYY-MM-DD HH:mm:ss');
            saveData.weldingDeliverTime = moment(saveData.weldingDeliverTime).format('YYYY-MM-DD HH:mm:ss');
            saveData.loftingDeliverTime = moment(saveData.loftingDeliverTime).format('YYYY-MM-DD HH:mm:ss');
            saveData.loftingPartDeliverTime = moment(saveData.loftingPartDeliverTime).format('YYYY-MM-DD HH:mm:ss');
            saveData.programmingDeliverTime = moment(saveData.programmingDeliverTime).format('YYYY-MM-DD HH:mm:ss');
            saveData.smallSampleDeliverTime = moment(saveData.smallSampleDeliverTime).format('YYYY-MM-DD HH:mm:ss');
            saveData.deliveryDrawDeliverTime = moment(saveData.deliveryDrawDeliverTime).format('YYYY-MM-DD HH:mm:ss');
            saveData.drawDeliverTime = moment(saveData.drawDeliverTime).format('YYYY-MM-DD HH:mm:ss');
            // if (saveData.loftingUser && Array.isArray(saveData.loftingMutualReview) && saveData.loftingMutualReview.length > 0) {
            //     let user: any = []
            //     if (saveData.loftingMutualReview.indexOf('0') > -1) {
            //         saveData.loftingMutualReview.splice(saveData.loftingMutualReview.indexOf('0'), 1)
            //         user = saveData.loftingMutualReview.length > 0 ? saveData.loftingMutualReview.concat(saveData.loftingUser) : saveData.loftingUser
            //         saveData.loftingMutualReview = Array.from(new Set(user))
            //     }
            // } else {
            //     saveData.loftingMutualReview = '';
            // }
            // if (saveData.loftingMutualReview && Array.isArray(saveData.loftingMutualReview) && Array.isArray(saveData.weldingUser) && saveData.weldingUser.length > 0) {
            //     let user: any = []
            //     if (saveData.weldingUser.indexOf('0') > -1) {
            //         saveData.weldingUser.splice(saveData.weldingUser.indexOf('0'), 1)
            //         user = saveData.loftingMutualReview.length > 0 ? saveData.loftingMutualReview.concat(saveData.weldingUser) : saveData.weldingUser
            //         saveData.weldingUser = Array.from(new Set(user))

            //     }
            // } else {
            //     saveData.weldingUser = '';
            // }
            saveData.loftingUser = Array.isArray(saveData.loftingUser) && saveData.loftingUser.length > 0 ? saveData.loftingUser.join(',') : '';
            if (saveData.loftingMutualReview && saveData.loftingMutualReview.indexOf('0') === 0) { //审图校卡
                saveData.loftingMutualReview = saveData.loftingUser && Array.isArray(saveData.loftingUser) ? saveData.loftingUser?.join(',') : saveData.loftingUser
            } else {
                saveData.loftingMutualReview = saveData.loftingMutualReview?.join(',')
            }
            if (saveData.weldingUser && saveData.weldingUser.indexOf('0') === 0) { //组焊清单
                if (saveData.loftingMutualReview && saveData.loftingMutualReview?.indexOf('0') === 0) {
                    saveData.weldingUser = saveData.loftingUser && Array.isArray(saveData.loftingUser) ? saveData.loftingUser.join(',') : saveData.loftingUser
                } else {
                    saveData.weldingUser = Array.isArray(saveData.loftingMutualReview) ? saveData.loftingMutualReview?.join(',') : saveData.loftingMutualReview
                }
            } else {
                saveData.weldingUser = saveData.weldingUser.join(',')
            }
            saveData.ncUser = saveData?.ncUser && saveData?.ncUser.indexOf('0') === 0 ? saveData?.programmingLeader : saveData?.ncUser;
            saveData.productPartUser = saveData?.productPartUser && saveData?.productPartUser.indexOf('0') === 0 ? saveData?.ncUser : saveData?.productPartUser;
            saveData.packageUser = saveData?.packageUser && saveData?.packageUser.indexOf('0') === 0 ? saveData?.productPartUser : saveData?.packageUser;
            saveData.boltPlanCheckUser = saveData?.boltPlanCheckUser && saveData?.boltPlanCheckUser.indexOf('0') === 0 ? saveData?.boltLeader : saveData?.boltPlanCheckUser;
            if (saveData?.boltUser && saveData?.boltUser.indexOf('0') === 0) { //螺栓清单
                saveData.boltUser = saveData?.boltPlanCheckUser && saveData?.boltPlanCheckUser.indexOf('0') === 0 ? saveData?.boltLeader : saveData?.boltPlanCheckUser
            } else {
                saveData.boltUser = saveData?.boltUser?.join(',')
            }
            if (saveData.boltCheckUser && saveData.boltCheckUser.indexOf('0') === 0) { //螺栓清单校核
                if (saveData.boltUser && saveData.boltUser?.indexOf('0') === 0) {
                    saveData.boltCheckUser = saveData?.boltPlanCheckUser && saveData?.boltPlanCheckUser.indexOf('0') === 0 ? saveData.loftingUser : saveData?.boltPlanCheckUser
                } else {
                    saveData.boltCheckUser = Array.isArray(saveData.boltUser) ? saveData.boltUser?.join(',') : saveData.boltUser
                }
            } else {
                saveData.boltCheckUser = saveData?.boltCheckUser?.join(',')
            }
            saveData.boltCheckUser = Array.isArray(saveData?.boltCheckUser) ? saveData?.boltCheckUser?.join(',') : saveData?.boltCheckUser;
            saveData.deliveryDrawLeader = saveData?.deliveryDrawLeader && saveData?.deliveryDrawLeader.indexOf('0') === 0 ? saveData?.drawLeader : saveData?.deliveryDrawLeader;

            await RequestUtil.post('/tower-science/productCategory/assign', saveData).then(() => {

                setVisible(false);
                setBatch(false)
                message.success('指派成功！')
                form.resetFields([
                    'pattern',
                    'boltCheckUser',
                    'boltLeader',
                    'boltPlanCheckUser',
                    'boltUser',
                    'deliveryDrawLeader',
                    'drawLeader',
                    'hangLineBoardCheckUser',
                    'legConfigurationCheckUser',
                    'legConfigurationUser',
                    'legProgrammingUser',
                    'loftingLeader',
                    'loftingMutualReview',
                    'loftingUser',
                    'ncUser',
                    'packageUser',
                    'productPartUser',
                    'programmingLeader',
                    'weldingUser',
                    'smallSampleLeader',
                    'description'
                ]);
                form.setFieldsValue({
                    boltDeliverTime: '',
                    deliveryDrawDeliverTime: '',
                    drawDeliverTime: '',
                    loftingDeliverTime: '',
                    programmingDeliverTime: '',
                    loftingPartDeliverTime: '',
                    smallSampleDeliverTime: '',
                });
            }).then(() => {
                setRefresh(!refresh);
            })
        } catch (error) {
            console.log(error)
        }
    }

    const handleModalCancel = () => {
        setVisible(false);
        setEdit(false);
        setBatch(false);
        form.resetFields([
            'pattern',
            'boltCheckUser',
            'boltLeader',
            'boltPlanCheckUser',
            'boltUser',
            'deliveryDrawLeader',
            'drawLeader',
            'hangLineBoardCheckUser',
            'legConfigurationCheckUser',
            'legConfigurationUser',
            'legProgrammingUser',
            'loftingLeader',
            'loftingMutualReview',
            'loftingUser',
            'ncUser',
            'packageUser',
            'productPartUser',
            'programmingLeader',
            'smallSampleLeader',
            'description'
        ]);
        form.setFieldsValue({
            boltDeliverTime: '',
            deliveryDrawDeliverTime: '',
            drawDeliverTime: '',
            loftingDeliverTime: '',
            programmingDeliverTime: '',
            loftingPartDeliverTime: '',
            smallSampleDeliverTime: '',
        });
    };

    const formItemLayout = {
        labelCol: { span: 10 },
        wrapperCol: { span: 24 }
    };
    const onFilterSubmit = (value: any) => {
        setFilterValue(value)
        return value
    }

    const checkChange = (checked: boolean, id: string, name: string) => {
        if (checked) {
            setDetailData({
                ...detailData,
                [id]: '0'
            })
            form.setFieldsValue({
                [id]: '0',
                [name]: '同上'
            })
        } else {
            setDetailData({
                ...detailData,
                [id]: ''
            })
            form.setFieldsValue({
                [id]: '',
                [name]: ''
            })
        }
    }

    return (
        <>
            <Modal
                title='指派信息'
                width={'95%'}
                visible={visible}
                onCancel={handleModalCancel}
                footer={
                    edit ? null : <>
                        <SchedulePlan plan={setPlanData} />
                        <Button onClick={handleModalCancel}>取消</Button>
                        <Button type='primary' onClick={handleModalOk}>保存并提交</Button>
                    </>
                }
            >
                <Spin spinning={load}>
                    <Form form={form} {...formItemLayout} initialValues={scheduleData || {}}>
                        <Row>
                            <Col span={6}>
                                <Row>
                                    <Col span={18}>
                                        <Form.Item name="name" label="塔型" >
                                            <span>{scheduleData.name}</span>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={6}>
                                <Row>
                                    <Col span={18}>
                                        <Form.Item name="pattern" label="模式" rules={[{ required: true, message: '请选择模式' }]}>
                                            <Select style={{ width: '150px' }} getPopupContainer={triggerNode => triggerNode.parentNode} disabled={edit}>
                                                {patternTypeOptions && patternTypeOptions.map(({ id, name }, index) => {
                                                    return <Select.Option key={index} value={id}>
                                                        {name}
                                                    </Select.Option>
                                                })}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={6}>
                                <Row>
                                    <Col span={18}>
                                        <Form.Item name="priority" label="优先级" rules={[{ required: true, message: '请选择优先级' }]} >
                                            <Select disabled={edit}>
                                                <Select.Option value={1} key={1}>紧急</Select.Option>
                                                <Select.Option value={2} key={2}>高</Select.Option>
                                                <Select.Option value={3} key={3}>中</Select.Option>
                                                <Select.Option value={4} key={4}>低</Select.Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={6}>
                                <Row>
                                    <Col span={18}>
                                        <Form.Item name="assignName" label="指派方案">
                                            <Select disabled={edit} allowClear
                                                onClear={() => {
                                                    console.log('-------clear-scheduleView-plan-------')
                                                }}
                                                onChange={async (value) => {
                                                    if (value) {
                                                        setLoad(true)
                                                        const resData: any = await RequestUtil.get(`/tower-science/assignPlan/planDetailById/${value}`)
                                                        resData.name = form.getFieldsValue(true).name
                                                        setScheduleData({
                                                            ...scheduleData,
                                                            // assignPlanId: resData.id,
                                                            ...resData,
                                                            name: form.getFieldsValue().name,
                                                        });
                                                        form.setFieldsValue({
                                                            ...resData,
                                                            programmingLeader: resData?.weldingLeader,
                                                            programmingLeaderName: resData?.weldingLeaderName,
                                                            deliveryDrawLeaderName: resData.deliveryDrawLeader ? resData.deliveryDrawLeaderName : '同上',
                                                            loftingUser: resData.loftingUser && resData.loftingUser !== null ? resData.loftingUser.indexOf(',') > -1 ? resData.loftingUser.split(',') : [resData.loftingUser] : [],
                                                            loftingMutualReview: resData.loftingMutualReview && resData.loftingMutualReview !== null ? resData.loftingMutualReview.indexOf(',') > -1 ? resData.loftingMutualReview.split(',') : [resData.loftingMutualReview] : [],
                                                            weldingUser: resData.weldingUser && resData.weldingUser !== null ? resData.weldingUser.indexOf(',') > -1 ? resData.weldingUser.split(',') : [resData.weldingUser] : [],
                                                        });
                                                        setLoad(false)
                                                    }
                                                }}>
                                                {planData && planData.map((item: any) => {
                                                    return <Select.Option key={item.id} value={item.id}>{item.assignName}</Select.Option>
                                                })}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={6}>
                                <Row>
                                    <Col span={18}>
                                        <Form.Item name="loftingLeaderName" label="放样负责人" rules={[{ required: true, message: '请选择放样负责人' }]} >
                                            <Input size="small" disabled suffix={
                                                <SelectUser
                                                    key={'loftingLeader'}
                                                    selectedKey={[form?.getFieldsValue(true)?.loftingLeader]}
                                                    disabled={edit || scheduleData?.loftingStatus === 5}
                                                    onSelect={(selectedRows: Record<string, any>) => {
                                                        form.setFieldsValue({
                                                            loftingLeader: selectedRows[0]?.userId,
                                                            loftingLeaderName: selectedRows[0]?.name
                                                        })
                                                    }} />
                                            } />
                                        </Form.Item>
                                    </Col>
                                    <Col span={6} />
                                </Row>
                            </Col>
                            <Col span={6}>
                                <Row>
                                    <Col span={18}>
                                        <Form.Item name="programmingLeaderName" label="编程负责人(生产下达)" rules={[{ required: true, message: '请选择编程负责人' }]} >
                                            <Input size="small" disabled suffix={
                                                <SelectUser key={'programmingLeader'} selectedKey={[form?.getFieldsValue(true)?.programmingLeader]} disabled={edit || scheduleData?.boltStatus === 4} onSelect={(selectedRows: Record<string, any>) => {
                                                    form.setFieldsValue({
                                                        programmingLeader: selectedRows[0]?.userId,
                                                        programmingLeaderName: selectedRows[0]?.name
                                                    })
                                                }} />
                                            } />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={6}>
                                <Row>
                                    <Col span={18}>
                                        <Form.Item name="boltLeaderName" label="螺栓负责人(螺栓计划)" rules={[{ required: true, message: '请选择螺栓清单负责人' }]} >
                                            <Input size="small" disabled suffix={
                                                <SelectUser key={'boltLeader'} selectedKey={[form?.getFieldsValue(true)?.boltLeader]} disabled={edit || scheduleData?.boltStatus === 4} onSelect={(selectedRows: Record<string, any>) => {
                                                    form.setFieldsValue({
                                                        boltLeader: selectedRows[0]?.userId,
                                                        boltLeaderName: selectedRows[0]?.name
                                                    })
                                                }} />
                                            } />
                                        </Form.Item>
                                    </Col>
                                </Row>

                            </Col>
                            <Col span={6}>
                                <Row>
                                    <Col span={18}>
                                        <Form.Item name="drawLeaderName" label="图纸负责人(组装图纸)" rules={[{ required: true, message: '请选择图纸负责人' }]} >
                                            <Input size="small" disabled suffix={
                                                <SelectUser key={'drawLeader'} selectedKey={[form?.getFieldsValue(true)?.drawLeader]} disabled={edit || scheduleData?.templateLoftingStatus === 2} onSelect={(selectedRows: Record<string, any>) => {
                                                    form.setFieldsValue({
                                                        drawLeader: selectedRows[0]?.userId,
                                                        drawLeaderName: selectedRows[0]?.name,
                                                    })
                                                }} />
                                            } />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={6}>
                                <Row>
                                    <Col span={18}>
                                        <Form.Item name="loftingDeliverTime" label="放样交付时间" rules={[{ required: true, message: '请选择放样交付时间' }]} >
                                            <DatePicker style={{ width: '100%' }} format={'YYYY-MM-DD HH:mm:ss'} showTime
                                                disabledDate={current => current && current < moment().startOf('day')}
                                                onChange={(date: any) => {
                                                    const weldingCompletionTime = Number(scheduleData.assignConfigVO.weldingCompletionTime);
                                                    const loftingWithSectionCompletionTime = Number(scheduleData.assignConfigVO.loftingWithSectionCompletionTime);
                                                    const smallSampleCompletionTime = Number(scheduleData.assignConfigVO.smallSampleCompletionTime);
                                                    const boltCompletionTime = Number(scheduleData.assignConfigVO.boltCompletionTime);
                                                    const weldingDrawTime = Number(scheduleData.assignConfigVO.blotDrawDeliverTime);
                                                    const boltDrawTime = Number(scheduleData.assignConfigVO.weldingDrawDeliverTime);
                                                    let newWeldingCompletionTime = new Date(new Date(date).setHours(new Date(date).getHours() + weldingCompletionTime));
                                                    let newLoftingWithSectionCompletionTime = new Date(new Date(date).setHours(new Date(date).getHours() + loftingWithSectionCompletionTime));
                                                    let newSmallSampleCompletionTime = new Date(new Date(date).setHours(new Date(date).getHours() + smallSampleCompletionTime));
                                                    let newBoltCompletionTime = new Date(new Date(date).setHours(new Date(date).getHours() + boltCompletionTime + loftingWithSectionCompletionTime));
                                                    let newWeldingDrawTime = new Date(new Date(date).setHours(new Date(date).getHours() + weldingCompletionTime + boltDrawTime));
                                                    let newBoltDrawTime = new Date(new Date(date).setHours(new Date(date).getHours() + boltCompletionTime + weldingDrawTime));

                                                    form.setFieldsValue({
                                                        weldingDeliverTime: moment(newWeldingCompletionTime),
                                                        boltDeliverTime: moment(newBoltCompletionTime),
                                                        smallSampleDeliverTime: moment(newSmallSampleCompletionTime),
                                                        loftingPartDeliverTime: moment(newLoftingWithSectionCompletionTime),
                                                        deliveryDrawDeliverTime: moment(newBoltDrawTime),
                                                        drawDeliverTime: moment(newWeldingDrawTime)
                                                    })

                                                }} disabled={edit || scheduleData?.loftingStatus === 5} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={6}>
                                <Row>
                                    <Col span={18}>
                                        <Form.Item name="programmingDeliverTime" label="编程时间" rules={[{ required: true, message: '请选择编程时间' }]} >
                                            <DatePicker
                                                disabled={edit || scheduleData?.weldingStatus === 4}
                                                style={{ width: '100%' }}
                                                showTime
                                                format={'YYYY-MM-DD HH:mm:ss'}
                                                disabledDate={current => current && current < moment().startOf('day')}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={6}>
                                <Row>
                                    <Col span={18}>
                                        <Form.Item name="boltDeliverTime" label="螺栓清单交付时间" rules={[{ required: true, message: '请选择螺栓清单交付时间' }]} >
                                            <DatePicker style={{ width: '100%' }} disabled format={'YYYY-MM-DD HH:mm:ss'} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={6}>
                                <Row>
                                    <Col span={18}>
                                        <Form.Item name="drawDeliverTime" label="组装图纸计划交付时间" rules={[{ required: true, message: '请选择组装图纸计划交付时间 ' }]} >
                                            <DatePicker style={{ width: '100%' }} disabled format={'YYYY-MM-DD HH:mm:ss'} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={6}>
                                <Row>
                                    <Col span={18}>
                                        <Form.Item name="loftingUserName" label="放样员">
                                            <Input size="small" disabled suffix={
                                                <SelectUser key={'loftingUser'} selectedKey={form?.getFieldsValue(true)?.loftingUser} disabled={edit || scheduleData?.smallSampleStatus === 2} selectType="checkbox" onSelect={(selectedRows: Record<string, any>) => {
                                                    form.setFieldsValue({
                                                        loftingUser: selectedRows.map((res: any) => res?.userId),
                                                        loftingUserName: selectedRows.map((res: any) => res?.name).join(',')
                                                    })
                                                }} />
                                            } />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={6}>
                                <Row gutter={12}>
                                    <Col span={18}>
                                        <Form.Item name="ncUserName" label="NC程序">
                                            <Input size="small" disabled suffix={
                                                <SelectUser key={'ncUser'} selectedKey={[form?.getFieldsValue(true)?.ncUser]} disabled={edit || scheduleData?.loftingStatus === 5} onSelect={(selectedRows: Record<string, any>) => {
                                                    form.setFieldsValue({
                                                        ncUser: selectedRows[0]?.userId,
                                                        ncUserName: selectedRows[0]?.name
                                                    })
                                                    setDetailData({
                                                        ...detailData,
                                                        ncUser: selectedRows[0]?.userId,
                                                        ncUserName: selectedRows[0]?.name
                                                    })
                                                }} />
                                            } />
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Checkbox onChange={(check) => {
                                            checkChange(check.target.checked, 'ncUser', 'ncUserName')
                                        }} checked={detailData?.ncUser === '0'}>
                                            同上
                                        </Checkbox>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={6}>
                                <Row gutter={12}>
                                    <Col span={18}>
                                        <Form.Item name="boltPlanCheckUserName" label="螺栓计划校核">
                                            <Input size="small" disabled suffix={
                                                <SelectUser key={'boltPlanCheckUser'} selectedKey={[form?.getFieldsValue(true)?.boltPlanCheckUser]} disabled={edit || scheduleData?.boltStatus === 4} onSelect={(selectedRows: Record<string, any>) => {
                                                    form.setFieldsValue({
                                                        boltPlanCheckUser: selectedRows[0]?.userId,
                                                        boltPlanCheckUserName: selectedRows[0]?.name
                                                    })
                                                    setDetailData({
                                                        ...detailData,
                                                        boltPlanCheckUser: selectedRows[0]?.userId,
                                                        boltPlanCheckUserName: selectedRows[0]?.name
                                                    })
                                                }} />
                                            } />
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Checkbox onChange={(check) => {
                                            checkChange(check.target.checked, 'boltPlanCheckUser', 'boltPlanCheckUserName')
                                        }} checked={detailData?.boltPlanCheckUser === '0'}>
                                            同上
                                        </Checkbox>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={6}>
                                <Row gutter={12}>
                                    <Col span={18}>
                                        <Form.Item name="deliveryDrawLeaderName" label="发货图纸" rules={[{ required: true, message: '请选择发货图纸负责人' }]}>
                                            <Input size="small" disabled suffix={
                                                <SelectUser key={'deliveryDrawLeader'} selectedKey={[form?.getFieldsValue(true)?.deliveryDrawLeader]} disabled={edit || scheduleData?.smallSampleStatus === 2} onSelect={(selectedRows: Record<string, any>) => {
                                                    form.setFieldsValue({
                                                        deliveryDrawLeader: selectedRows[0]?.userId,
                                                        deliveryDrawLeaderName: selectedRows[0]?.name
                                                    })
                                                    setDetailData({
                                                        ...detailData,
                                                        deliveryDrawLeader: selectedRows[0]?.userId,
                                                        deliveryDrawLeaderName: selectedRows[0]?.name
                                                    })
                                                }} />
                                            } />
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Checkbox onChange={(check) => {
                                            checkChange(check.target.checked, 'deliveryDrawLeader', 'deliveryDrawLeaderName')
                                        }} checked={detailData?.deliveryDrawLeader === '0'}>
                                            同上
                                        </Checkbox>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={6}>
                                <Row gutter={12}>
                                    <Col span={18}>
                                        <Form.Item name="loftingMutualReviewName" label="审图校卡">
                                            <Input size="small" disabled suffix={
                                                <SelectUser key={'loftingMutualReview'} selectedKey={form?.getFieldsValue(true)?.loftingMutualReview} disabled={edit || scheduleData?.smallSampleStatus === 2} selectType="checkbox" onSelect={(selectedRows: Record<string, any>) => {
                                                    form.setFieldsValue({
                                                        loftingMutualReview: selectedRows.map((res: any) => res?.userId),
                                                        loftingMutualReviewName: selectedRows.map((res: any) => res?.name)?.join(',')
                                                    })
                                                    setDetailData({
                                                        ...detailData,
                                                        loftingMutualReview: selectedRows.map((res: any) => res?.userId),
                                                        loftingMutualReviewName: selectedRows.map((res: any) => res?.name)?.join(',')
                                                    })
                                                }} />
                                            } />
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Checkbox onChange={(check) => {
                                            checkChange(check.target.checked, 'loftingMutualReview', 'loftingMutualReviewName')
                                        }} checked={detailData?.loftingMutualReview === '0'}>
                                            同上
                                        </Checkbox>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={6}>
                                <Row gutter={12}>
                                    <Col span={18}>
                                        <Form.Item name="productPartUserName" label="杆塔配段">
                                            <Input size="small" disabled suffix={
                                                <SelectUser key={'productPartUser'} selectedKey={[form?.getFieldsValue(true)?.productPartUser]} disabled={edit || scheduleData?.smallSampleStatus === 2} onSelect={(selectedRows: Record<string, any>) => {
                                                    form.setFieldsValue({
                                                        productPartUser: selectedRows[0]?.userId,
                                                        productPartUserName: selectedRows[0]?.name
                                                    })
                                                    setDetailData({
                                                        ...detailData,
                                                        productPartUser: selectedRows[0]?.userId,
                                                        productPartUserName: selectedRows[0]?.name
                                                    })
                                                }} />
                                            } />
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Checkbox onChange={(check) => {
                                            checkChange(check.target.checked, 'productPartUser', 'productPartUserName')
                                        }} checked={detailData?.productPartUser === '0'}>
                                            同上
                                        </Checkbox>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={6}>
                                <Row gutter={12}>
                                    <Col span={18}>
                                        <Form.Item name="boltUserName" label="螺栓清单">
                                            <Input size="small" disabled suffix={
                                                <SelectUser key={'boltUser'} selectedKey={form?.getFieldsValue(true)?.boltUser} disabled={edit || scheduleData?.boltStatus === 4} selectType="checkbox" onSelect={(selectedRows: Record<string, any>) => {
                                                    form.setFieldsValue({
                                                        boltUser: selectedRows.map((res: any) => res?.userId),
                                                        boltUserName: selectedRows.map((res: any) => res?.name)?.join(','),
                                                    })
                                                    setDetailData({
                                                        ...detailData,
                                                        boltUser: selectedRows.map((res: any) => res?.userId),
                                                        boltUserName: selectedRows.map((res: any) => res?.name)?.join(','),
                                                    })
                                                }} />
                                            } />
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Checkbox onChange={(check) => {
                                            checkChange(check.target.checked, 'boltUser', 'boltUserName')
                                        }} checked={detailData?.boltUser === '0'}>
                                            同上
                                        </Checkbox>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={6}>
                                <Row>
                                    <Col span={18}>
                                        <Form.Item name="deliveryDrawDeliverTime" label="发货图纸计划交付时间" rules={[{ required: true, message: '请选择发货图纸计划交付时间' }]} >
                                            <DatePicker style={{ width: '100%' }} disabled format={'YYYY-MM-DD HH:mm:ss'} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={6}>
                                <Row gutter={12}>
                                    <Col span={18}>
                                        <Form.Item name="weldingUserName" label="组焊清单">
                                            <Input size="small" disabled suffix={
                                                <SelectUser key={'weldingUser'} selectedKey={form?.getFieldsValue(true)?.weldingUser} disabled={edit || scheduleData?.weldingStatus === 4} selectType="checkbox" onSelect={(selectedRows: Record<string, any>) => {
                                                    form.setFieldsValue({
                                                        weldingUser: selectedRows.map((res: any) => res?.userId),
                                                        weldingUserName: selectedRows.map((res: any) => res?.name)?.join(',')
                                                    })
                                                    setDetailData({
                                                        ...detailData,
                                                        weldingUser: selectedRows.map((res: any) => res?.userId),
                                                        weldingUserName: selectedRows.map((res: any) => res?.name)?.join(',')
                                                    })
                                                }} />
                                            } />
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Checkbox onChange={(check) => {
                                            checkChange(check.target.checked, 'weldingUser', 'weldingUserName')
                                        }} checked={detailData?.weldingUser === '0'}>
                                            同上
                                        </Checkbox>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={6}>
                                <Row gutter={12}>
                                    <Col span={18}>
                                        <Form.Item name="packageUserName" label="包装清单">
                                            <Input size="small" disabled suffix={
                                                <SelectUser key={'packageUser'} selectedKey={[form?.getFieldsValue(true)?.packageUser]} disabled={edit || scheduleData?.smallSampleStatus === 2} onSelect={(selectedRows: Record<string, any>) => {
                                                    form.setFieldsValue({
                                                        packageUser: selectedRows[0]?.userId,
                                                        packageUserName: selectedRows[0]?.name
                                                    })
                                                    setDetailData({
                                                        ...detailData,
                                                        packageUser: selectedRows[0]?.userId,
                                                        packageUserName: selectedRows[0]?.name
                                                    })
                                                }} />
                                            } />
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Checkbox onChange={(check) => {
                                            checkChange(check.target.checked, 'packageUser', 'packageUserName')
                                        }} checked={detailData?.packageUser === '0'}>
                                            同上
                                        </Checkbox>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={6}>
                                <Row gutter={12}>
                                    <Col span={18}>
                                        <Form.Item name="boltCheckUserName" label="螺栓清单校核">
                                            <Input size="small" disabled suffix={
                                                <SelectUser key={'boltCheckUser'} selectedKey={form?.getFieldsValue(true)?.boltCheckUser} disabled={edit || scheduleData?.smallSampleStatus === 2} selectType="checkbox" onSelect={(selectedRows: Record<string, any>) => {
                                                    form.setFieldsValue({
                                                        boltCheckUser: selectedRows.map((res: any) => res?.userId),
                                                        boltCheckUserName: selectedRows.map((res: any) => res?.name).join(',')
                                                    })
                                                    setDetailData({
                                                        ...detailData,
                                                        boltCheckUser: selectedRows.map((res: any) => res?.userId),
                                                        boltCheckUserName: selectedRows.map((res: any) => res?.name).join(',')
                                                    })
                                                }} />
                                            } />
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Checkbox onChange={(check) => {
                                            checkChange(check.target.checked, 'boltCheckUser', 'boltCheckUserName')
                                        }} checked={detailData?.boltCheckUser === '0'}>
                                            同上
                                        </Checkbox>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={6}>
                                <Row>
                                    <Col span={18}>
                                        <Form.Item name="smallSampleLeaderName" label="小样图上传" rules={[{ required: true, message: '请选择小样图负责人' }]} >
                                            <Input size="small" disabled suffix={
                                                <SelectUser key={'smallSampleLeader'} selectedKey={[form?.getFieldsValue(true)?.smallSampleLeader]} disabled={edit || scheduleData?.smallSampleStatus === 2} onSelect={(selectedRows: Record<string, any>) => {
                                                    form.setFieldsValue({
                                                        smallSampleLeader: selectedRows[0]?.userId,
                                                        smallSampleLeaderName: selectedRows[0]?.name
                                                    })
                                                }} />
                                            } />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>

                        </Row>
                        <Row>
                            <Col span={6}>
                                <Row>
                                    <Col span={18}>
                                        <Form.Item name="legConfigurationUserName" label="高低腿配置编制">
                                            <Input size="small" disabled suffix={
                                                <SelectUser key={'legConfigurationUser'} selectedKey={[form?.getFieldsValue(true)?.legConfigurationUser]} disabled={edit || scheduleData?.smallSampleStatus === 2} onSelect={(selectedRows: Record<string, any>) => {
                                                    form.setFieldsValue({
                                                        legConfigurationUser: selectedRows[0]?.userId,
                                                        legConfigurationUserName: selectedRows[0]?.name
                                                    })
                                                }} />
                                            } />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={6}>
                                <Row>
                                    <Col span={18}>
                                        <Form.Item name="legProgrammingUserName" label="编程高低腿">
                                            <Input size="small" disabled suffix={
                                                <SelectUser key={'legProgrammingUser'} selectedKey={[form?.getFieldsValue(true)?.legProgrammingUser]} disabled={edit || scheduleData?.smallSampleStatus === 2} onSelect={(selectedRows: Record<string, any>) => {
                                                    form.setFieldsValue({
                                                        legProgrammingUser: selectedRows[0]?.userId,
                                                        legProgrammingUserName: selectedRows[0]?.name
                                                    })
                                                }} />
                                            } />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={6} />
                            <Col span={6}>
                                <Row>
                                    <Col span={18}>
                                        <Form.Item name="smallSampleDeliverTime" label="小样图交付时间" rules={[{ required: true, message: '请选择小样图交付时间' }]}>
                                            <DatePicker style={{ width: '100%' }} disabled format={'YYYY-MM-DD HH:mm:ss'} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={6}>
                                <Row>
                                    <Col span={18}>
                                        <Form.Item name="legConfigurationCheckUserName" label="高低腿配置校核">
                                            <Input size="small" disabled suffix={
                                                <SelectUser key={'legConfigurationCheckUser'} selectedKey={[form?.getFieldsValue(true)?.legConfigurationCheckUser]} disabled={edit || scheduleData?.smallSampleStatus === 2} onSelect={(selectedRows: Record<string, any>) => {
                                                    form.setFieldsValue({
                                                        legConfigurationCheckUser: selectedRows[0]?.userId,
                                                        legConfigurationCheckUserName: selectedRows[0]?.name
                                                    })
                                                }} />
                                            } />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={12} />
                            <Col span={6}>
                                <Row>
                                    <Col span={18}>
                                        <Form.Item name="description" label="备注"  >
                                            <TextArea rows={1} disabled={edit} showCount maxLength={400} style={{ width: '100%' }} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={6}>
                                <Row>
                                    <Col span={18}>
                                        <Form.Item name="hangLineBoardCheckUserName" label="挂线板校核">
                                            <Input size="small" disabled suffix={
                                                <SelectUser key={'hangLineBoardCheckUser'} selectedKey={[form?.getFieldsValue(true)?.hangLineBoardCheckUser]} disabled={edit || scheduleData?.smallSampleStatus === 2} onSelect={(selectedRows: Record<string, any>) => {
                                                    form.setFieldsValue({
                                                        hangLineBoardCheckUser: selectedRows[0]?.userId,
                                                        hangLineBoardCheckUserName: selectedRows[0]?.name
                                                    })
                                                }} />
                                            } />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Form>
                </Spin>
                {edit && <>
                    <DetailTitle title="操作信息" />
                    <CommonTable haveIndex columns={tableColumns} dataSource={scheduleData?.assignLogList} pagination={false} />
                </>}
            </Modal>
            <Page
                path={`/tower-science/productCategory/taskPage`}
                columns={[
                    {
                        key: "index",
                        title: "序号",
                        dataIndex: "index",
                        width: 50,
                        render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                    },
                    ...columns,
                    {
                        key: 'operation',
                        title: '操作',
                        dataIndex: 'operation',
                        fixed: 'right' as FixedType,
                        width: 100,
                        render: (_: undefined, record: any): React.ReactNode => (
                            <Space direction="horizontal" size="small">
                                <Button type='link' onClick={async () => {
                                    setVisible(true);
                                    setLoad(true)
                                    setBatch(true)
                                    const resData: any = await RequestUtil.get(`/tower-science/productCategory/${record.id}`);
                                    setScheduleData(resData);
                                    if (resData?.assignConfigVO?.weldingCompletionTime
                                        && resData?.assignConfigVO?.loftingWithSectionCompletionTime
                                        && resData?.assignConfigVO.smallSampleCompletionTime
                                        && resData?.assignConfigVO.boltCompletionTime
                                        && resData?.assignConfigVO.drawDeliverTime
                                        && resData?.assignConfigVO.blotDrawDeliverTime
                                        && resData?.loftingDeliverTime) {
                                        const weldingCompletionTime = Number(resData.assignConfigVO.weldingCompletionTime);
                                        const loftingWithSectionCompletionTime = Number(resData.assignConfigVO.loftingWithSectionCompletionTime);
                                        const smallSampleCompletionTime = Number(resData.assignConfigVO.smallSampleCompletionTime);
                                        const boltCompletionTime = Number(resData.assignConfigVO.boltCompletionTime);
                                        const weldingDrawTime = Number(scheduleData.assignConfigVO.blotDrawDeliverTime);
                                        const boltDrawTime = Number(scheduleData.assignConfigVO.weldingDrawDeliverTime);
                                        let newWeldingCompletionTime = new Date(new Date(resData.loftingDeliverTime).setHours(new Date(resData.loftingDeliverTime).getHours() + weldingCompletionTime));
                                        let newLoftingWithSectionCompletionTime = new Date(new Date(resData.loftingDeliverTime).setHours(new Date(resData.loftingDeliverTime).getHours() + loftingWithSectionCompletionTime));
                                        let newSmallSampleCompletionTime = new Date(new Date(resData.loftingDeliverTime).setHours(new Date(resData.loftingDeliverTime).getHours() + smallSampleCompletionTime));
                                        let newBoltCompletionTime = new Date(new Date(resData.loftingDeliverTime).setHours(new Date(resData.loftingDeliverTime).getHours() + boltCompletionTime + loftingWithSectionCompletionTime));
                                        let newWeldingDrawTime = new Date(new Date(resData.loftingDeliverTime).setHours(new Date(resData.loftingDeliverTime).getHours() + weldingCompletionTime + boltDrawTime));
                                        let newBoltDrawTime = new Date(new Date(resData.loftingDeliverTime).setHours(new Date(resData.loftingDeliverTime).getHours() + boltCompletionTime + weldingDrawTime));
                                        resData.weldingDeliverTime = newWeldingCompletionTime
                                        resData.boltDeliverTime = newBoltCompletionTime
                                        resData.smallSampleDeliverTime = newSmallSampleCompletionTime
                                        resData.loftingPartDeliverTime = newLoftingWithSectionCompletionTime
                                        resData.deliveryDrawDeliverTime = newBoltDrawTime
                                        resData.drawDeliverTime = newWeldingDrawTime
                                    }
                                    const newData = {
                                        ...resData,
                                        boltLeader: resData.boltLeader && resData.boltLeader !== -1 ? resData.boltLeader : '',
                                        weldingLeader: resData.weldingLeader && resData.weldingLeader !== -1 ? resData.weldingLeader : '',
                                        loftingLeader: resData.loftingLeader && resData.loftingLeader !== -1 ? resData.loftingLeader : '',
                                        drawLeader: resData.drawLeader && resData.drawLeader !== -1 ? resData.drawLeader : '',
                                        loftingUser: resData.loftingUser && resData.loftingUser !== null ? resData.loftingUser.indexOf(',') > -1 ? resData.loftingUser.split(',') : [resData.loftingUser] : [],
                                        loftingMutualReview: resData.loftingMutualReview && resData.loftingMutualReview !== null ? resData.loftingMutualReview.indexOf(',') > -1 ? resData.loftingMutualReview.split(',') : [resData.loftingMutualReview] : '0',
                                        weldingUser: resData.weldingUser && resData.weldingUser !== null ? resData.weldingUser.indexOf(',') > -1 ? resData.weldingUser.split(',') : [resData.weldingUser] : '0',
                                        smallSampleLeader: resData.smallSampleLeader && resData.smallSampleLeader !== -1 ? resData.smallSampleLeader : '',
                                        ncUser: resData.ncUser ? resData.ncUser : '0',
                                        packageUser: resData.packageUser ? resData.packageUser : '0',
                                        productPartUser: resData.productPartUser ? resData.productPartUser : '0',
                                        boltCheckUser: resData.boltCheckUser && resData.boltCheckUser !== null ? resData.boltCheckUser.indexOf(',') > -1 ? resData.boltCheckUser.split(',') : [resData.boltCheckUser] : '0',
                                        boltPlanCheckUser: resData.boltPlanCheckUser ? resData.boltPlanCheckUser : '0',
                                        boltUser: resData.boltUser && resData.boltUser !== null ? resData.boltUser.indexOf(',') > -1 ? resData.boltUser.split(',') : [resData.boltUser] : '0',
                                        deliveryDrawLeader: resData.deliveryDrawLeader ? resData.deliveryDrawLeader : '0',
                                        deliveryDrawLeaderName: resData.deliveryDrawLeader ? resData.deliveryDrawLeaderName : '同上',

                                        boltDeliverTime: resData.boltDeliverTime ? moment(resData.boltDeliverTime) : '',
                                        weldingDeliverTime: resData.weldingDeliverTime ? moment(resData.weldingDeliverTime) : '',
                                        loftingDeliverTime: resData.loftingDeliverTime ? moment(resData.loftingDeliverTime) : '',
                                        loftingPartDeliverTime: resData.loftingPartDeliverTime ? moment(resData.loftingPartDeliverTime) : '',
                                        programmingDeliverTime: resData.programmingDeliverTime ? moment(resData.programmingDeliverTime) : '',
                                        smallSampleDeliverTime: resData.smallSampleDeliverTime ? moment(resData.smallSampleDeliverTime) : '',
                                        deliveryDrawDeliverTime: resData.deliveryDrawDeliverTime ? moment(resData.deliveryDrawDeliverTime) : '',
                                        drawDeliverTime: resData.drawDeliverTime ? moment(resData.drawDeliverTime) : '',
                                    }
                                    setDetailData(newData)
                                    form.setFieldsValue(newData);
                                    setLoad(false)
                                }} disabled={record.loftingStatus === 5 && record.boltStatus === 4 && record.weldingStatus === 4 && record.smallSampleStatus === 2 && record.templateLoftingStatus === 2}>指派</Button>
                                <Button type='link' onClick={async () => {
                                    setEdit(true);
                                    setVisible(true);
                                    setLoad(true)
                                    const resData: any = await RequestUtil.get(`/tower-science/productCategory/${record.id}`);
                                    setScheduleData(resData);
                                    if (resData?.assignConfigVO?.weldingCompletionTime
                                        && resData?.assignConfigVO?.loftingWithSectionCompletionTime
                                        && resData?.assignConfigVO.smallSampleCompletionTime
                                        && resData?.assignConfigVO.boltCompletionTime
                                        && resData?.assignConfigVO.drawDeliverTime
                                        && resData?.assignConfigVO.blotDrawDeliverTime
                                        && resData?.loftingDeliverTime) {
                                        const weldingCompletionTime = Number(resData.assignConfigVO.weldingCompletionTime);
                                        const loftingWithSectionCompletionTime = Number(resData.assignConfigVO.loftingWithSectionCompletionTime);
                                        const smallSampleCompletionTime = Number(resData.assignConfigVO.smallSampleCompletionTime);
                                        const boltCompletionTime = Number(resData.assignConfigVO.boltCompletionTime);
                                        const weldingDrawTime = Number(resData.assignConfigVO.drawDeliverTime);
                                        const boltDrawTime = Number(resData.assignConfigVO.blotDrawDeliverTime);
                                        let newWeldingCompletionTime = new Date(new Date(resData.loftingDeliverTime).setHours(new Date(resData.loftingDeliverTime).getHours() + weldingCompletionTime));
                                        let newLoftingWithSectionCompletionTime = new Date(new Date(resData.loftingDeliverTime).setHours(new Date(resData.loftingDeliverTime).getHours() + loftingWithSectionCompletionTime));
                                        let newSmallSampleCompletionTime = new Date(new Date(resData.loftingDeliverTime).setHours(new Date(resData.loftingDeliverTime).getHours() + smallSampleCompletionTime));
                                        let newBoltCompletionTime = new Date(new Date(resData.loftingDeliverTime).setHours(new Date(resData.loftingDeliverTime).getHours() + boltCompletionTime + loftingWithSectionCompletionTime));
                                        let newWeldingDrawTime = new Date(new Date(resData.loftingDeliverTime).setHours(new Date(resData.loftingDeliverTime).getHours() + weldingCompletionTime + boltDrawTime));
                                        let newBoltDrawTime = new Date(new Date(resData.loftingDeliverTime).setHours(new Date(resData.loftingDeliverTime).getHours() + boltCompletionTime + weldingDrawTime));
                                        resData.weldingDeliverTime = newWeldingCompletionTime
                                        resData.boltDeliverTime = newBoltCompletionTime
                                        resData.smallSampleDeliverTime = newSmallSampleCompletionTime
                                        resData.loftingPartDeliverTime = newLoftingWithSectionCompletionTime
                                        resData.deliveryDrawDeliverTime = newBoltDrawTime
                                        resData.drawDeliverTime = newWeldingDrawTime
                                    }
                                    form.setFieldsValue({
                                        ...resData,
                                        boltDeliverTime: resData.boltDeliverTime ? moment(resData.boltDeliverTime) : '',
                                        weldingDeliverTime: resData.weldingDeliverTime ? moment(resData.weldingDeliverTime) : '',
                                        loftingDeliverTime: resData.loftingDeliverTime ? moment(resData.loftingDeliverTime) : '',
                                        loftingPartDeliverTime: resData.loftingPartDeliverTime ? moment(resData.loftingPartDeliverTime) : '',
                                        programmingDeliverTime: resData.programmingDeliverTime ? moment(resData.programmingDeliverTime) : '',
                                        smallSampleDeliverTime: resData.smallSampleDeliverTime ? moment(resData.smallSampleDeliverTime) : '',
                                        deliveryDrawDeliverTime: resData.deliveryDrawDeliverTime ? moment(resData.deliveryDrawDeliverTime) : '',
                                        drawDeliverTime: resData.drawDeliverTime ? moment(resData.drawDeliverTime) : '',

                                    });

                                    setLoad(false)
                                }} disabled={!record.loftingLeaderName}>详情</Button>
                            </Space>
                        )
                    }]}
                exportPath={`/tower-science/productCategory/taskPage`}
                extraOperation={
                    <Space>
                        <Button type="primary" ghost onClick={async () => {
                            setVisible(true);
                            setLoad(true)
                            const resData: any = selectedKeys.length > 1 ? await RequestUtil.get(`/tower-science/productCategory/category/name`, { ids: selectedKeys.join(',') }) : await RequestUtil.get(`/tower-science/productCategory/${selectedKeys.join(',')}`);
                            setScheduleData(resData);
                            if (resData?.assignConfigVO?.weldingCompletionTime
                                && resData?.assignConfigVO?.loftingWithSectionCompletionTime
                                && resData?.assignConfigVO.smallSampleCompletionTime
                                && resData?.assignConfigVO.boltCompletionTime
                                && resData?.assignConfigVO.drawDeliverTime
                                && resData?.assignConfigVO.blotDrawDeliverTime
                                && resData?.loftingDeliverTime) {

                                const weldingCompletionTime = Number(resData.assignConfigVO.weldingCompletionTime);
                                const loftingWithSectionCompletionTime = Number(resData.assignConfigVO.loftingWithSectionCompletionTime);
                                const smallSampleCompletionTime = Number(resData.assignConfigVO.smallSampleCompletionTime);
                                const boltCompletionTime = Number(resData.assignConfigVO.boltCompletionTime);
                                const weldingDrawTime = Number(scheduleData.assignConfigVO.blotDrawDeliverTime);
                                const boltDrawTime = Number(scheduleData.assignConfigVO.weldingDrawDeliverTime);
                                let newWeldingCompletionTime = new Date(new Date(resData.loftingDeliverTime).setHours(new Date(resData.loftingDeliverTime).getHours() + weldingCompletionTime));
                                let newLoftingWithSectionCompletionTime = new Date(new Date(resData.loftingDeliverTime).setHours(new Date(resData.loftingDeliverTime).getHours() + loftingWithSectionCompletionTime));
                                let newSmallSampleCompletionTime = new Date(new Date(resData.loftingDeliverTime).setHours(new Date(resData.loftingDeliverTime).getHours() + smallSampleCompletionTime));
                                let newBoltCompletionTime = new Date(new Date(resData.loftingDeliverTime).setHours(new Date(resData.loftingDeliverTime).getHours() + boltCompletionTime + loftingWithSectionCompletionTime));
                                let newWeldingDrawTime = new Date(new Date(resData.loftingDeliverTime).setHours(new Date(resData.loftingDeliverTime).getHours() + weldingCompletionTime + boltDrawTime));
                                let newBoltDrawTime = new Date(new Date(resData.loftingDeliverTime).setHours(new Date(resData.loftingDeliverTime).getHours() + boltCompletionTime + weldingDrawTime));
                                resData.weldingDeliverTime = newWeldingCompletionTime
                                resData.boltDeliverTime = newBoltCompletionTime
                                resData.smallSampleDeliverTime = newSmallSampleCompletionTime
                                resData.loftingPartDeliverTime = newLoftingWithSectionCompletionTime
                                resData.deliveryDrawDeliverTime = newBoltDrawTime
                                resData.drawDeliverTime = newWeldingDrawTime
                            }
                            form.setFieldsValue({
                                ...resData,
                                boltLeader: resData.boltLeader && resData.boltLeader !== -1 ? resData.boltLeader : '',
                                weldingLeader: resData.weldingLeader && resData.weldingLeader !== -1 ? resData.weldingLeader : '',
                                loftingLeader: resData.loftingLeader && resData.loftingLeader !== -1 ? resData.loftingLeader : '',
                                drawLeader: resData.drawLeader && resData.drawLeader !== -1 ? resData.drawLeader : '',
                                loftingMutualReview: resData.loftingMutualReview && resData.loftingMutualReview !== null ? resData.loftingMutualReview.indexOf(',') > -1 ? resData.loftingMutualReview.split(',') : [resData.loftingMutualReview] : ['0'],
                                loftingUser: resData.loftingUser && resData.loftingUser !== null ? resData.loftingUser.indexOf(',') > -1 ? resData.loftingUser.split(',') : [resData.loftingUser] : [],
                                weldingUser: resData.weldingUser && resData.weldingUser !== null ? resData.weldingUser.indexOf(',') > -1 ? resData.weldingUser.split(',') : [resData.weldingUser] : ['0'],
                                smallSampleLeader: resData.smallSampleLeader && resData.smallSampleLeader !== -1 ? resData.smallSampleLeader : '',
                                boltDeliverTime: resData.boltDeliverTime ? moment(resData.boltDeliverTime) : '',
                                weldingDeliverTime: resData.weldingDeliverTime ? moment(resData.weldingDeliverTime) : '',
                                loftingDeliverTime: resData.loftingDeliverTime ? moment(resData.loftingDeliverTime) : '',
                                loftingPartDeliverTime: resData.loftingPartDeliverTime ? moment(resData.loftingPartDeliverTime) : '',
                                programmingDeliverTime: resData.programmingDeliverTime ? moment(resData.programmingDeliverTime) : '',
                                smallSampleDeliverTime: resData.smallSampleDeliverTime ? moment(resData.smallSampleDeliverTime) : '',
                                deliveryDrawDeliverTime: resData.deliveryDrawDeliverTime ? moment(resData.deliveryDrawDeliverTime) : '',
                                drawDeliverTime: resData.drawDeliverTime ? moment(resData.drawDeliverTime) : '',
                                ncUser: resData.ncUser ? resData.ncUser : '0',
                                packageUser: resData.packageUser ? resData.packageUser : '0',
                                productPartUser: resData.productPartUser ? resData.productPartUser : '0',
                                boltCheckUser: resData.boltCheckUser && resData.boltCheckUser.split(','),
                                boltPlanCheckUser: resData.boltPlanCheckUser ? resData.boltPlanCheckUser : '0',
                                boltUser: resData.boltUser && resData.boltUser.split(','),
                                deliveryDrawLeader: resData.deliveryDrawLeader ? resData.deliveryDrawLeader : '0'
                            });
                            setLoad(false)
                        }} disabled={!(selectedKeys.length > 0)}>批量指派</Button>
                        <Button type="ghost" onClick={() => history.goBack()}>返回</Button>
                    </Space>
                }
                requestData={{ loftingTaskId: params.id }}
                onFilterSubmit={onFilterSubmit}
                refresh={refresh}
                tableProps={{
                    rowSelection: {
                        type: "checkbox",
                        selectedRowKeys: selectedKeys,
                        onChange: SelectChange,
                    }
                }}
                filterValue={filterValue}
                searchFormItems={[
                    {
                        name: 'pattern',
                        label: '模式',
                        children: <Select style={{ width: '150px' }} getPopupContainer={triggerNode => triggerNode.parentNode}>
                            {patternTypeOptions && patternTypeOptions.map(({ id, name }, index) => {
                                return <Select.Option key={index} value={id}>
                                    {name}
                                </Select.Option>
                            })}
                        </Select>
                    },
                    {
                        name: 'priority',
                        label: '优先级',
                        children: <Select style={{ width: "100px" }}>
                            <Select.Option value={''} key={''}>全部</Select.Option>
                            <Select.Option value='1' key='1'>紧急</Select.Option>
                            <Select.Option value='2' key='2'>高</Select.Option>
                            <Select.Option value='3' key='3'>中</Select.Option>
                            <Select.Option value='4' key='4'>低</Select.Option>
                        </Select>
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