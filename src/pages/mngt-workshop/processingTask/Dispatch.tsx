import React, { useState } from 'react'
import { Button, Col, DatePicker, Form, Input, message, Row, Select, Space, Spin } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailContent, CommonTable, DetailTitle } from '../../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import WorkshopEquipmentSelectionComponent, { IUser } from '../../../components/WorkshopEquipmentModal';
import WorkshopTeamSelectionComponent from '../../../components/WorkshopTeamModal';
import AuthUtil from '../../../utils/AuthUtil';
import moment from 'moment';

const tableColumns = [
    { title: '加工班组', dataIndex: 'name', key: 'name'},
    { title: '段', dataIndex: 'segmentName', key: 'segmentName', },
    { title: '件号', dataIndex: 'code', key: 'code' },
    { title: '材料', dataIndex: 'materialName', key: 'materialName' },
    { title: '材质', dataIndex: 'structureTexture', key: 'structureTexture' },
    { title: '规格', dataIndex: 'structureSpec', key: 'structureSpec' },
    { title: '长度(mm)', dataIndex: 'length', key: 'length' },
    { title: '单件孔数', dataIndex: 'holesNum', key: 'holesNum' },
    { title: '数量', dataIndex: 'processingNum', key: 'processingNum' },
    { title: '重量(kg)', dataIndex: 'basicsWeight', key: 'basicsWeight' },
    { title: '电焊', dataIndex: 'electricWelding', key: 'electricWelding' },
    { title: '备注', dataIndex: 'description', key: 'description' },
    // { title: '冲引孔', dataIndex: 'punchHole', key: 'punchHole' },
    // { title: '是否弧边', dataIndex: 'arcEdge', key: 'arcEdge' },
    { title: '类型', dataIndex: 'type', key: 'type' },
    { title: '个孔径孔数', dataIndex: 'apertureNumber', key: 'apertureNumber' },
    { title: '钻孔孔径孔数', dataIndex: 'drillApertureNumber', key: 'drillApertureNumber' },
    { title: '扩孔孔径孔数', dataIndex: 'reamingApertureNumber', key: 'reamingApertureNumber' },
]

export default function Dispatch(): React.ReactNode {
    const history = useHistory();
    const [form] = Form.useForm();
    const [formRef] = Form.useForm();
    const params = useParams<{ id: string }>();
    const [show, setShow] = useState<boolean>(false);
    const [equipment, setEquipment] = useState<any>({});
    const [team, setTeam] = useState<any>({});
    const [selectedRowKeys,setSelectedRowKeys] = useState<React.Key[]>([]);
    const [selectedRows,setSelectedRows] = useState([]);
    const [tableDataSource,setTableDataSource] = useState<any>([]);
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        console.log(params.id)
        let data:any = {};
        if(params.id!=='new'){
            const data:any = await RequestUtil.get(`/tower-aps/machining?current=1&size=20&status=0&id=${params.id}`);
            form.setFieldsValue({
                ...data.records[0],
                time:[moment(data.records[0].startTime.split(' ')[0]),moment(data.records[0].endTime.split(' ')[0])],
                type:1,
            });
            let submitValue={
                ...data.records[0],
                startTime: data.records[0].startTime+':00',
                endTime: data.records[0].endTime+':59',
                status:0,
            }
            const tableDataSource: any = await RequestUtil.get(`tower-aps/machining/dispatchView`,submitValue)
            setTableDataSource(tableDataSource);
            setSelectedRowKeys(tableDataSource.map((item:any)=>{return item.id}))
            setShow(true);
        }else{
            form.setFieldsValue({
                time:[moment(),moment(new Date().setDate(new Date().getDate()+2))],
            });
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
                        if(selectedRowKeys.length>0){
                            await RequestUtil.put(`/tower-aps/machining/confirmDispatch`,{
                                teamId:team.id,
                                idList:selectedRowKeys
                            }).then(()=>{
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
                            <Form.Item name="workCenterName" label="工作中心" initialValue={undefined} rules={[
                                {
                                    "required": true,
                                    "message": "请选择工作中心"
                                }
                            ]}>
                                <Input maxLength={ 50 } addonAfter={ <WorkshopEquipmentSelectionComponent onSelect={ (selectedRows: any) => {
                                    setEquipment(selectedRows[0]);
                                    form.setFieldsValue({
                                        time:[moment(),moment(new Date().setDate(new Date().getDate()+2))],
                                        workCenterName: selectedRows[0].workCenterName,
                                        productUnitName: selectedRows[0].unitName
                                    });
                                } } buttonType="link" buttonTitle="+选择工作中心"  disabled={show}/> } disabled={show}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="productUnitName" label="生产单元" >
                                <Input disabled/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item name="time" label="任务时间范围" style={{width:'100%'}} rules={[
                                {
                                    "required": true,
                                    "message": "请选择任务时间范围"
                                }
                            ]}>
                                <DatePicker.RangePicker  style={{width:'100%'}} disabled={show}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="type" label="仅显示未派工明细" initialValue={1} rules={[
                                {
                                    "required": true,
                                    "message": "请选择是否显示未派工明细"
                                }
                            ]}>
                                <Select style={{width:'100%'}} disabled={show}>
                                    <Select.Option value={1} key={1}>是</Select.Option>
                                    <Select.Option value={0} key={0}>否</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <Space style={{padding:'0px 0px 24px 0px'}}>
                <Button type='primary' onClick={async ()=>{
                    await form.validateFields()
                    let value = form.getFieldsValue(true);
                    if (value.time) {
                        const formatDate = value.time.map((item: any) => item.format("YYYY-MM-DD"))
                        value.startTime = formatDate[0]+' 00:00:00';
                        value.endTime = formatDate[1]+' 23:59:59';
                    }
                    let submitValue={
                        startTime: value.startTime,
                        endTime: value.endTime,
                        type: value.type,
                        productionUnitId: equipment.unitId,
                        workCenterId: equipment.id,
                        status:0,
                    }
                    const tableDataSource: any = await RequestUtil.get(`tower-aps/machining/dispatchView`,submitValue)
                    message.success('查询成功！')
                    setTableDataSource(tableDataSource);
                    setSelectedRowKeys(tableDataSource.map((item:any)=>{return item.id}))
                    setShow(true);
                }}>查询</Button>
                {params.id!=='new'&& <Button type='primary' onClick={()=>{
                    setShow(false)
                    // setEquipment({});
                    // setTeam({})
                    // form.resetFields();
                    // formRef.resetFields();
                }}>编辑</Button>}
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
                                <Form.Item name="teamName" label="派工班组" initialValue={undefined} rules={[
                                    {
                                        "required": true,
                                        "message": "请选择派工班组"
                                    }
                                ]}>
                                    <Input maxLength={ 50 } disabled addonAfter={ <WorkshopTeamSelectionComponent onSelect={ (selectedRows: IUser[] | any) => {
                                        setTeam(selectedRows[0]);
                                        formRef.setFieldsValue({teamName: selectedRows[0].name});
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