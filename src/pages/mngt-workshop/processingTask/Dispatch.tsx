import React, { useState } from 'react'
import { Button, Col, DatePicker, Form, Input, message, Modal, Row, Select, Space, Spin } from 'antd';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { BaseInfo, DetailContent, CommonTable, DetailTitle } from '../../common';
// import { baseInfoData } from './question.json';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import WorkshopEquipmentSelectionComponent, { IUser } from '../../../components/WorkshopEquipmentModal';
import WorkshopTeamSelectionComponent from '../../../components/WorkshopTeamModal';
import TextArea from 'antd/lib/input/TextArea';
import AuthUtil from '../../../utils/AuthUtil';
import moment from 'moment';

const tableColumns = [
    { title: '加工班组', dataIndex: 'index', key: 'index', render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
    { title: '段', dataIndex: 'createDeptName', key: 'createDeptName', },
    { title: '件号', dataIndex: 'createUserName', key: 'createUserName' },
    { title: '材料', dataIndex: 'createTime', key: 'createTime' },
    { title: '材质', dataIndex: 'description', key: 'description' },
    { title: '规格', dataIndex: 'description', key: 'description' },
    { title: '长度(mm)', dataIndex: 'description', key: 'description' },
    { title: '单件孔数', dataIndex: 'description', key: 'description' },
    { title: '数量', dataIndex: 'description', key: 'description' },
    { title: '重量(kg)', dataIndex: 'description', key: 'description' },
    { title: '电焊', dataIndex: 'description', key: 'description' },
    { title: '备注', dataIndex: 'description', key: 'description' },
    { title: '冲引孔', dataIndex: 'description', key: 'description' },
    { title: '是否弧边', dataIndex: 'description', key: 'description' },
    { title: '件号类型', dataIndex: 'description', key: 'description' },
    { title: '个孔径孔数', dataIndex: 'description', key: 'description' },
    { title: '钻孔孔径孔数', dataIndex: 'description', key: 'description' },
    { title: '扩孔孔径孔数', dataIndex: 'description', key: 'description' },
]

export default function Dispatch(): React.ReactNode {
    const history = useHistory();
    const [form] = Form.useForm();
    const [formRef] = Form.useForm();
    const params = useParams<{ id: string }>();
    const [show, setShow] = useState<boolean>(false);
    const [equipment, setEquipment] = useState({});
    const [team, setTeam] = useState({});
    const [selectedRowKeys,setSelectedRowKeys] = useState<React.Key[]>([]);
    const [selectedRows,setSelectedRows] = useState([]);
    const [tableDataSource,setTableDataSource] = useState<any>([]);
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        console.log(params.id)
        let data:any = {};
        if(params.id!=='new'){
            // data = await RequestUtil.get(`/tower-science/issue/material?id=${params.id}`);
            form.setFieldsValue({
                equipmentName:'',
                workshopDeptName:'',
                deptProcessesName:'',
                productionLinesName:'',
                time:[moment(),moment()],
                noDispatchStatus:1,
            });
            formRef.setFieldsValue({
                equipmentName:'',
            })
            setShow(true);
            setTableDataSource([{id:"1"}]);
            setSelectedRowKeys([{id:"1"}].map((item:any)=>{return item.id}))
        }
        resole(data)
    }), {})
    const detailData: any = data;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 }
    };
    return <>
        <Spin spinning={loading}>
            <DetailContent operation={[
                <Button key="edit" style={{ marginRight: '10px' }} type="primary" onClick={async () => {
                    formRef.validateFields().then(async (res)=>{
                        let value = formRef.getFieldsValue(true);
                        if(selectedRowKeys.length>0){
                            await RequestUtil.post(`/tower-science/issue/verify`,{id:params.id}).then(()=>{
                                message.success('派工成功！')
                            }).then(()=>{
                                history.goBack()
                            })
                        }else{
                            message.error('未选择加工明细，不可派工！')
                        }
                       
                    })
                }} disabled={!show}>确认派工</Button>,
                <Button key="goback" onClick={() => history.goBack()}>返回</Button>
            ]}>
                <DetailTitle title="基础信息" />
                <Form form={form} { ...formItemLayout }>
                    <Row>
                        <Col span={12}>
                            <Form.Item name="equipmentName" label="工作中心" initialValue={undefined} rules={[
                                {
                                    "required": true,
                                    "message": "请选择工作中心"
                                }
                            ]}>
                                <Input maxLength={ 50 } addonAfter={ <WorkshopEquipmentSelectionComponent onSelect={ (selectedRows: any[] | any) => {
                                    setEquipment(selectedRows);
                                    form.setFieldsValue({
                                        equipmentName: selectedRows[0].name,
                                        workshopDeptName: selectedRows[0].name,
                                        deptProcessesName: selectedRows[0].name,
                                        productionLinesName: selectedRows[0].name
                                    });
                                } } buttonType="link" buttonTitle="+选择设备"  disabled={show}/> } disabled={show}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="workshopDeptName" label="生产单元" initialValue={undefined}>
                                <Input disabled/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item name="time" label="任务时间范围" initialValue={[moment('2015-01-01'), moment('2015-01-01')]} style={{width:'100%'}} rules={[
                                {
                                    "required": true,
                                    "message": "请选择任务时间范围"
                                }
                            ]}>
                                <DatePicker.RangePicker showTime style={{width:'100%'}} disabled={show}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="noDispatchStatus" label="仅显示未派工明细" initialValue={1} rules={[
                                {
                                    "required": true,
                                    "message": "请选择是否显示未派工明细"
                                }
                            ]}>
                                <Select style={{width:'100%'}} disabled={show}>
                                    <Select.Option value={1} key={1}>是</Select.Option>
                                    <Select.Option value={2} key={2}>否</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <Space>
                <Button type='primary' onClick={()=>{
                    // form.validateFields().then(res => {
                    //     let value = form.getFieldsValue(true);
                    //     if (value.time) {
                    //         const formatDate = value.time.map((item: any) => item.format("YYYY-MM-DD HH:mm:ss"))
                    //         value.startTime = formatDate[0];
                    //         value.endTime = formatDate[1];
                    //         delete value.time
                    //     }
                    //     RequestUtil.get(`/workshopOperating/dispatchDetail`,{startTime,endTime,equipmentId,noDispatchStatus}).then(()=>{
                    //         message.success('查询成功！')
                    //     }).then(()=>{
                    //         setShow(true)
                    //     })
                    // })
                    setShow(true);
                    setTableDataSource([{id:"1"}]);
                    setSelectedRowKeys([{id:"1"}].map((item:any)=>{return item.id}))
                }}>查询</Button>
                <Button type='primary' ghost onClick={()=>{
                    setShow(false)
                    setEquipment({});
                    setTeam({})
                    form.resetFields();
                    formRef.resetFields();
                }}>重置</Button>
                </Space>
                {show?<>
                    <DetailTitle title="指派班组选择" />
                    <Form form={formRef} { ...formItemLayout }>
                        <Row>
                            <Col span={12}>
                                <Form.Item name="equipmentName" label="派工班组" initialValue={undefined} rules={[
                                    {
                                        "required": true,
                                        "message": "请选择派工班组"
                                    }
                                ]}>
                                    <Input maxLength={ 50 } addonAfter={ <WorkshopTeamSelectionComponent onSelect={ (selectedRows: IUser[] | any) => {
                                        setTeam(selectedRows);
                                        formRef.setFieldsValue({equipmentName: selectedRows[0].name});
                                    } } buttonType="link" buttonTitle="+选择班组" /> }/>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                    <DetailTitle title="加工明细" />
                    <CommonTable 
                        columns={tableColumns} 
                        rowKey='id'
                        dataSource={tableDataSource} 
                        pagination={false} 
                        rowSelection={{
                            selectedRowKeys: selectedRowKeys,
                            type: "checkbox",
                            onChange: (selectedRowKeys: React.Key[], selectedRows:any)=>{
                                setSelectedRowKeys(selectedRowKeys)
                                setSelectedRows(selectedRows)
                            }
                        }}
                    />
                </>:null}
            </DetailContent>
        </Spin>
    </>
}